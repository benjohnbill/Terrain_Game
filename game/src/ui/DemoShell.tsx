/**
 * The commit-first demo shell.
 *
 * Gate 07 sealed this interaction on a live evaluation of
 * `mockup/combat-calc/turn-loop-prototype.html`:
 *
 *   커밋량 → 행동 소환 → 세부 작전 → 가능 지역 빛남 → 지목
 *
 * with the **commit bar as the entrance**, three zones (thin strip / calm map /
 * hero bar), and information *summoned by the commit decision* rather than
 * always painted. This is that flow over the real Runtime. It is a demo shell,
 * not build ticket 04 — that ticket is `needs-info` and this claims none of it.
 *
 * **It renders beside `App.tsx`, not over it.** `App.tsx` is what the Playwright
 * suite drives, against a couple of dozen `data-testid`s; putting a hero commit
 * bar on top of that DOM would risk pointer interception for no gain. So this is
 * a second Vite entry (`demo.html`) and `App.tsx` is untouched.
 *
 * **Honesty is a rendered property here.** Every action node carries one of
 * three classes, ported from the prototype: `wired` reaches the Runtime, `dev`
 * is a demo stand-in for a designed mechanic that is not built yet, and `facade`
 * blooms and deliberately does nothing because its value is not this file's to
 * invent. A demo that quietly fakes a mechanic teaches the wrong thing about the
 * game.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Runtime } from '../runtime/runtime.js';
import { CRADLE_R1 } from '../world/index.js';
import { preview } from '../preview/preview.js';
import { isPartyTo } from '../domain/fronts.js';
import { musterHexOf } from '../domain/movement.js';
// The stack's size is read from `view.commitment.budget` rather than imported:
// the projection reports `TURN_COMMITMENT_BUDGET` itself, so reading the view
// keeps even this shell downstream of the Runtime instead of beside it.
import type { ActorId, GameEvent, Intent, SectorId } from '../runtime/types.js';
import { MapBoard } from './MapBoard.js';
import { EVENT_GLOSS } from './gloss.js';
import { averageBand, bandFor, barLabel, barPercent, ownMenAt, type RBand, type ReconGrade } from './eval-r.js';

const ACTORS: readonly ActorId[] = ['realm-a', 'realm-b'];

type Verb = 'attack' | 'defend' | 'recon' | 'fortify';

/** How real each verb is. See the file header. */
type Fidelity = 'wired' | 'dev' | 'facade';

interface Plan {
  readonly id: string;
  readonly name: string;
  readonly fidelity: Fidelity;
  /**
   * The plan's scoring line at resolution, read from
   * `docs/features/combat-formula/MAGNITUDE.md` M7 and never chosen here. Defence
   * plans carry none — M7 gives thresholds to attack plans only.
   */
  readonly threshold?: number;
  /** Reconnaissance grades only: the sealed FG-M① unit price, per sector. */
  readonly unitPrice?: number;
  readonly grade?: ReconGrade;
  readonly note: string;
}

interface Action {
  readonly verb: Verb;
  readonly name: string;
  readonly fidelity: Fidelity;
  /** Whether an R band means anything for this verb. */
  readonly shaped: boolean;
  readonly plans: readonly Plan[];
  readonly note: string;
}

/**
 * The four verbs, at the four different levels of reality they actually occupy.
 *
 * 공격 and 방어 are the **same intent** — `allocate-commitment` onto a sector you
 * do not hold is an attack and onto one you hold is a defence. There is no
 * attack/defence discriminator anywhere in the intent surface, by design, so the
 * verb is a framing this shell derives from who holds the ground.
 */
const ACTIONS: readonly Action[] = [
  {
    verb: 'attack',
    name: '공격',
    fidelity: 'wired',
    shaped: true,
    note: '커밋을 붓고 야전군을 보냅니다. 도착한 곳에서 전투가 벌어져요.',
    plans: [
      { id: 'swift-seizure', name: '신속 점령', fidelity: 'dev', threshold: 1.5, note: '문턱은 M7에서 읽습니다. 판정 차별화는 아직 없어요.' },
      { id: 'deliberate-pressure', name: '신중 압박', fidelity: 'dev', threshold: 1.1, note: '문턱은 M7에서 읽습니다. 판정 차별화는 아직 없어요.' },
      { id: 'flanking-breakthrough', name: '우회 돌파', fidelity: 'facade', threshold: 1.6, note: '판 위에 아무 장치도 없습니다 — 기동 pass 소관.' },
      { id: 'encirclement', name: '포위 섬멸', fidelity: 'facade', threshold: 2.2, note: '판 위에 아무 장치도 없습니다 — 기동 pass 소관.' },
    ],
  },
  {
    verb: 'defend',
    name: '방어',
    fidelity: 'wired',
    shaped: true,
    note: '내 구역에 커밋을 붓습니다. 지형과 축성이 방어 쪽에 얹혀요.',
    plans: [
      { id: 'stronghold', name: '거점 방어', fidelity: 'wired', note: '판 위의 기본 태세입니다. 실제로 이 값으로 판정돼요.' },
      { id: 'delaying', name: '지연 방어', fidelity: 'facade', note: 'battle.ts에 분기는 있고 클릭이 없습니다.' },
    ],
  },
  {
    verb: 'recon',
    name: '정찰',
    fidelity: 'dev',
    shaped: false,
    note: '적 구역을 관측해 추정 밴드를 좁힙니다. 단가는 FG-M① 봉인값.',
    plans: [
      { id: 'recon-normal', name: '일반 정찰', fidelity: 'dev', unitPrice: 2, grade: 'normal', note: '구역당 커밋 2 · 반폭 ±25%' },
      { id: 'recon-enhanced', name: '강화 정찰', fidelity: 'dev', unitPrice: 6, grade: 'enhanced', note: '구역당 커밋 6 · 반폭 ±10%' },
    ],
  },
  {
    verb: 'fortify',
    name: '축성',
    fidelity: 'facade',
    shaped: false,
    note: '단가가 설계상 공백입니다. 숫자를 여기서 만들 수는 없어요.',
    plans: [],
  },
];

type Step = 'idle' | 'action' | 'plan' | 'target';

interface Flow {
  readonly step: Step;
  readonly amount: number;
  readonly verb: Verb | null;
  readonly plan: Plan | null;
}

const IDLE: Flow = { step: 'idle', amount: 0, verb: null, plan: null };

/** One committed order, kept so the slot strip can colour the turn's history. */
interface Order {
  readonly sector: SectorId;
  readonly chips: number;
  readonly verb: Verb;
  readonly planName: string;
}

export function DemoShell() {
  const [seed, setSeed] = useState('duel-0001');
  const [viewer, setViewer] = useState<ActorId>('realm-a');
  const [generation, setGeneration] = useState(0);
  const [tick, setTick] = useState(0);
  const [log, setLog] = useState<GameEvent[]>([]);

  const [flow, setFlow] = useState<Flow>(IDLE);
  const [focused, setFocused] = useState<SectorId | null>(null);
  const [orders, setOrders] = useState<readonly Order[]>([]);
  /**
   * Reconnaissance, as a demo stand-in for ticket 08.
   *
   * A real observation is an **observation testimony** — an honest interval
   * stamped with the turn it was taken, stored in the Runtime, corrected forward
   * by a sealed ageing envelope before it is read (fog `RULINGS.md` ③). None of
   * that exists yet. This is a grade per sector held in the view layer, cleared
   * when the turn advances, and it narrows the band around a **public prior
   * rather than around the truth** — which is precisely the property a testimony
   * would supply and this cannot. Nothing here enters `MatchState` or the
   * projection, so ticket 08 arrives with its design unprejudiced.
   */
  const [devBand, setDevBand] = useState<Readonly<Record<string, ReconGrade>>>({});
  const [reserve, setReserve] = useState(0);
  const [banner, setBanner] = useState<string | null>(null);
  const [trayOpen, setTrayOpen] = useState(false);
  const [trayFrom, setTrayFrom] = useState(0);

  const runtime = useMemo(
    () => Runtime.open({ world: CRADLE_R1, seed, actors: ACTORS }),
    [seed, generation],
  );
  const view = useMemo(() => runtime.view(viewer), [runtime, viewer, tick]);

  // Per-turn interaction state is cleared when the Runtime opens a new turn. A
  // ref rather than a derived value because this is an edge, not a state.
  const lastTurn = useRef(view.turn);
  useEffect(() => {
    if (view.turn === lastTurn.current) return;
    lastTurn.current = view.turn;
    setOrders([]);
    setReserve(0);
    setDevBand({});
    setFlow(IDLE);
    setFocused(null);
  }, [view.turn]);

  useEffect(() => {
    if (banner === null) return;
    const id = window.setTimeout(() => setBanner(null), 3200);
    return () => window.clearTimeout(id);
  }, [banner]);

  const submitting = useCallback(
    (intent: Intent): boolean => {
      const card = preview(view, intent);
      if (!card.admissible) {
        setBanner(card.reason ?? '그 명령은 지금 받을 수 없어요.');
        return false;
      }
      // The mutation runs OUTSIDE the state updater: StrictMode double-invokes
      // updaters in development, and a submit inside one is sent twice — the
      // first accepted, the second refused as a repeat.
      const events = runtime.submit(intent);
      setLog((l) => [...l, ...events]);
      setTick((t) => t + 1);
      return true;
    },
    [runtime, view],
  );

  const seatDone = view.committed.includes(viewer);
  const owing = view.actors.filter((actor) => !view.committed.includes(actor));
  const nextSeat = owing.find((actor) => actor !== viewer) ?? null;

  const holderOf = useCallback(
    (sector: SectorId): ActorId | null =>
      view.realms.find((realm) => realm.sectors.includes(sector))?.actor ?? null,
    [view.realms],
  );

  /**
   * Where a verb may be aimed, from the projection alone.
   *
   * Front sectors this viewer is party to, split by who holds the ground —
   * which is what makes one commitment an attack and the other a defence.
   */
  const eligible = useCallback(
    (verb: Verb): readonly SectorId[] => {
      if (verb === 'fortify') return [];
      const onFronts = [...new Set(
        view.fronts.filter((front) => isPartyTo(front, viewer)).flatMap((front) => front.sectors),
      )];
      if (verb === 'defend') return onFronts.filter((sector) => holderOf(sector) === viewer);
      return onFronts.filter((sector) => holderOf(sector) !== viewer);
    },
    [view.fronts, viewer, holderOf],
  );

  const action = flow.verb === null ? null : ACTIONS.find((a) => a.verb === flow.verb) ?? null;
  const targets = flow.step === 'target' && flow.verb !== null ? eligible(flow.verb) : [];

  const spent = view.commitment.spent;
  const budget = view.commitment.budget;
  const available = Math.max(0, budget - spent - reserve);

  const gradeOf = useCallback(
    (sector: SectorId): ReconGrade | null => devBand[sector] ?? null,
    [devBand],
  );

  /**
   * The force the current verb puts on the scale.
   *
   * A defence weighs the men already standing on the ground. An **attack weighs
   * the men it would send** — the same detachment `confirmTarget` marches — which
   * is somewhere else by definition. Asking "who is present" for an attack
   * returns zero on every candidate and flattens every band to one number.
   */
  const ownFor = useCallback(
    (sector: SectorId) => {
      if (flow.verb === 'defend') return ownMenAt(view, sector);
      const mover = view.detachments[0];
      return mover === undefined
        ? { men: 0, wear: 0 }
        : { men: mover.readyMen, wear: mover.fatigue };
    },
    [flow.verb, view],
  );

  // The two bands. LEFT follows the focused sector; RIGHT holds the average over
  // the verb's eligible fronts and does not move when a sector is clicked.
  const leftBand: RBand | null = useMemo(() => {
    if (action === null || !action.shaped || focused === null) return null;
    return bandFor(view, viewer, focused, gradeOf(focused), ownFor(focused));
  }, [action, focused, view, viewer, gradeOf, ownFor]);

  const rightBand: RBand | null = useMemo(() => {
    if (action === null || !action.shaped || flow.verb === null) return null;
    return averageBand(view, viewer, eligible(flow.verb), gradeOf, ownFor);
  }, [action, flow.verb, view, viewer, eligible, gradeOf, ownFor]);

  // Before a sector is clicked, both bars show the average — the seal's own UX:
  // "action picked → both show the average → click a front → only LEFT moves".
  const leftShown = leftBand ?? rightBand;

  const armAmount = useCallback((n: number) => {
    setFlow({ step: 'action', amount: n, verb: null, plan: null });
  }, []);

  const pickVerb = useCallback((verb: Verb) => {
    const picked = ACTIONS.find((a) => a.verb === verb);
    if (picked === undefined) return;
    if (picked.plans.length === 0) {
      // 축성 lands here: its unit price is blank by design (FG-M① and R2 both
      // leave it unset), so the honest thing is to say so and spend nothing.
      setBanner(`${picked.name} — ${picked.note}`);
      setFlow(IDLE);
      return;
    }
    setFlow((f) => ({ ...f, step: 'plan', verb, plan: null }));
  }, []);

  const pickPlan = useCallback((plan: Plan) => {
    setFlow((f) => ({ ...f, step: 'target', plan }));
    setFocused(null);
  }, []);

  /** Chips already poured on a sector by this shell, so a new order adds rather than replaces. */
  const chipsOn = useCallback(
    (sector: SectorId): number =>
      orders.filter((order) => order.sector === sector).reduce((sum, order) => sum + order.chips, 0),
    [orders],
  );

  const confirmTarget = useCallback(
    (sector: SectorId) => {
      const plan = flow.plan;
      const verb = flow.verb;
      if (plan === null || verb === null) return;

      if (verb === 'recon') {
        const price = plan.unitPrice ?? 0;
        if (price > available) {
          setBanner(`정찰 단가 ${price}에 남은 행동력이 모자라요.`);
          return;
        }
        setReserve((r) => r + price);
        setDevBand((b) => ({ ...b, [sector]: plan.grade ?? 'normal' }));
        setOrders((o) => [...o, { sector, chips: price, verb, planName: plan.name }]);
        setBanner(`${sector} 관측 — 추정 밴드가 좁아졌어요.`);
        setFlow(IDLE);
        return;
      }

      if (plan.fidelity === 'facade') {
        setBanner(`${plan.name} — ${plan.note}`);
        setFlow(IDLE);
        return;
      }

      const chips = flow.amount;
      if (chips > available) {
        setBanner('남은 행동력이 모자라요.');
        return;
      }

      // `allocate-commitment` REPLACES its sector's share rather than adding to
      // it, so a second order on the same sector must carry the running total or
      // it silently wipes the first.
      if (!submitting({
        kind: 'allocate-commitment',
        actor: viewer,
        sector,
        chips: chipsOn(sector) + chips,
      })) return;

      if (verb === 'attack') {
        // Chips alone create no engagement site. Without the march the player
        // pours commitment into a sector and nothing whatsoever happens there.
        const mover = view.detachments[0];
        if (mover !== undefined) {
          submitting({
            kind: 'move-detachment',
            actor: viewer,
            detachmentId: mover.id,
            destinationHex: musterHexOf(view.board, sector),
            forcedMarch: false,
          });
        }
      }

      setOrders((o) => [...o, { sector, chips, verb, planName: plan.name }]);
      setBanner(`${sector} — ${plan.name} · 행동력 ${chips}`);
      setFlow(IDLE);
    },
    [flow, available, submitting, viewer, chipsOn, view.detachments, view.board],
  );

  const lockTurn = useCallback(() => {
    setTrayFrom(log.length);
    if (submitting({ kind: 'lock-commitment', actor: viewer })) {
      setFlow(IDLE);
    }
  }, [submitting, viewer, log.length]);

  const handOff = useCallback(() => {
    if (nextSeat === null) return;
    setViewer(nextSeat);
    setFocused(null);
    setFlow(IDLE);
    setTrayOpen(false);
  }, [nextSeat]);

  // The turn closed if the reveal produced a new turn's events. The tray is the
  // loop visibly closing on itself, which is half of what gate 07 sealed.
  const resolution = log.slice(trayFrom).filter((event) => event.type !== 'commitment-locked');
  useEffect(() => {
    if (resolution.some((event) => event.type === 'turn-opened')) setTrayOpen(true);
  }, [log.length]);

  const choosing = view.phase === 'capital-selection' && !seatDone;
  const selectable = choosing ? (view.realms.find((r) => r.actor === viewer)?.sectors ?? []) : targets;

  const hint = (() => {
    if (view.outcome !== null) return '매치가 끝났어요.';
    if (view.phase === 'capital-selection') {
      return choosing ? '수도를 고르세요 — 내 땅을 클릭.' : `${owing.join(', ')} 대기 중`;
    }
    if (seatDone) return nextSeat === null ? '공개를 기다립니다.' : `${nextSeat} 차례예요`;
    if (flow.step === 'idle') return '커밋만 하세요 — 아래 눈금을 클릭.';
    if (flow.step === 'action') return '무엇을 할까요?';
    if (flow.step === 'plan') return '세부 작전을 고르세요.';
    return '빛나는 구역을 지목하세요.';
  })();

  return (
    <div className="demo-shell">
      <div className="hud">
        <span className="g">
          턴 <b>{view.turn}</b>
        </span>
        <span className="sep">·</span>
        <span className="g">
          <span className={`seat ${viewer}`}>{viewer}</span>
        </span>
        {view.economy && (
          <>
            <span className="sep">·</span>
            <span className="g">국고 <b>{view.economy.treasury.toFixed(1)}</b></span>
            <span className="sep">·</span>
            <span className="g">야전군 <b>{view.economy.field.toLocaleString('en-US')}</b></span>
            <span className="sep">·</span>
            <span className="g">
              동원
              <span className="meter"><i style={{ width: `${Math.min(100, view.economy.mobilization * 100)}%` }} /></span>
            </span>
          </>
        )}
        <span className="spacer" />
        <span className="g">{view.world.worldId}@{view.world.revision}</span>
      </div>

      <div className="stage-map">
        <MapBoard
          view={view}
          selectable={selectable}
          focused={focused}
          onFocus={setFocused}
          onPick={(sector) => {
            if (choosing) {
              submitting({ kind: 'choose-capital', actor: viewer, sector });
              return;
            }
            if (flow.step === 'target') confirmTarget(sector);
          }}
        />
      </div>

      {/* The bars exist only for R-shaped actions. A non-combat verb gets no bar
          rather than a meaningless one — the seal is explicit about that. */}
      {action?.shaped && (
        <>
          <EvalColumn
            side="left"
            band={leftShown}
            label={focused === null ? '전선 교전 — 구역 지목 전' : `전선 교전 · ${focused}`}
            threshold={flow.plan?.threshold ?? null}
            thresholdName={flow.plan?.name ?? null}
          />
          <EvalColumn side="right" band={rightBand} label="이 행동 평균" threshold={null} thresholdName={null} />
        </>
      )}

      {banner !== null && <div className="banner">{banner}</div>}

      <div className="commit">
        <div className="slots">
          {Array.from({ length: budget }, (_, i) => {
            const order = slotOwner(orders, i);
            const armed = order === null && i >= spent + reserve && i < spent + reserve + flow.amount;
            const used = order !== null;
            const cls = used ? ` used u-${order.verb === 'attack' ? 'attack' : order.verb === 'defend' ? 'defend' : order.verb === 'recon' ? 'recon' : 'facade'}` : '';
            return (
              <button
                key={i}
                type="button"
                className={`slot${armed ? ' armed' : ''}${cls}`}
                data-testid={`slot-${i}`}
                title={used ? `${order.sector} · ${order.planName}` : `행동력 ${i + 1}`}
                disabled={used || seatDone || view.phase !== 'decision'}
                onClick={() => armAmount(i + 1 - spent - reserve)}
              />
            );
          })}
        </div>
        <div className="bottom">
          <span className="lab">
            커밋 풀 <b>{available}</b>/{budget} · 비축 불가
          </span>
          <span className="hint" data-testid="hint">{hint}</span>
          {view.phase === 'decision' && !seatDone && (
            <button type="button" className="cbtn end" data-testid="lock" onClick={lockTurn}>
              턴 종료 → 결전
            </button>
          )}
          {seatDone && nextSeat !== null && view.outcome === null && (
            <button type="button" className="cbtn" data-testid="hand-off" onClick={handOff}>
              ▶ {nextSeat}에게 넘기기
            </button>
          )}
          {view.outcome !== null && (
            <button type="button" className="cbtn end" onClick={() => { setGeneration((n) => n + 1); setLog([]); setTick(0); }}>
              새 매치
            </button>
          )}
        </div>
      </div>

      {(flow.step === 'action' || flow.step === 'plan') && (
        <Bloom
          amount={flow.amount}
          caption={flow.step === 'action' ? '커밋 소환 — 무엇을 할까요?' : `${action?.name} — 세부 작전`}
          nodes={flow.step === 'action'
            ? ACTIONS.map((a) => ({ key: a.verb, name: a.name, fidelity: a.fidelity, note: a.note, onPick: () => pickVerb(a.verb) }))
            : (action?.plans ?? []).map((p) => ({ key: p.id, name: p.name, fidelity: p.fidelity, note: p.note, plan: true, onPick: () => pickPlan(p) }))}
          onDismiss={() => setFlow(IDLE)}
        />
      )}

      {trayOpen && (
        <div className="tray" data-testid="tray">
          <div className="traybox">
            <div className="th">
              <b>턴 {view.turn - 1} 결과</b>
              <span className="sp" />
              <button type="button" className="cbtn" onClick={() => setTrayOpen(false)}>닫기</button>
            </div>
            <div className="traylist">
              {resolution.map((event, i) => (
                <div key={i} className={`ev ${trayTone(event.type)}`} style={{ animationDelay: `${i * 55}ms` }}>
                  <span className="etag">{trayTag(event.type)}</span>
                  <span className="etx">
                    <b>{EVENT_GLOSS[event.type] ?? event.type}</b>
                    <div className="sub">{event.type}</div>
                  </span>
                </div>
              ))}
            </div>
            <div className="tf">
              <button type="button" className="cbtn end" onClick={() => setTrayOpen(false)}>턴 {view.turn} 시작</button>
            </div>
          </div>
        </div>
      )}

      {view.outcome !== null && (
        <div className="banner" data-testid="victory" style={{ top: '46%' }}>
          {view.outcome.winner === viewer ? '승리' : '패배'} — {view.outcome.loser}의 수도가 함락됐어요.
          <small>{view.outcome.capital} · 턴 {view.outcome.turn}</small>
        </div>
      )}

      <input
        aria-label="seed"
        value={seed}
        onChange={(e) => { setSeed(e.target.value); setLog([]); setTick(0); }}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 1, height: 1 }}
      />
    </div>
  );
}

function slotOwner(orders: readonly Order[], index: number): Order | null {
  let cursor = 0;
  for (const order of orders) {
    if (index < cursor + order.chips) return order;
    cursor += order.chips;
  }
  return null;
}

function trayTone(type: string): string {
  if (type === 'battle-resolved' || type === 'front-resolved') return 'fight';
  if (type === 'sector-captured' || type === 'sector-integrated' || type === 'shield-dissolved') return 'land';
  return '';
}

function trayTag(type: string): string {
  if (type === 'battle-resolved') return '교전';
  if (type === 'front-resolved') return '전선';
  if (type === 'sector-captured' || type === 'sector-integrated') return '영토';
  if (type === 'upkeep-resolved') return '정비';
  return '내정';
}

/**
 * One eval column.
 *
 * White fills to the band's low edge, hatched grey spans the band itself, and
 * the printed number is the centre. Geometry ported from the sealed prototype so
 * the two artifacts read identically. The threshold needle is passed only to the
 * LEFT column: it is a property of the plan against *this* front, and averaging
 * it across fronts would make it mean nothing.
 */
function EvalColumn({
  side,
  band,
  label,
  threshold,
  thresholdName,
}: {
  side: 'left' | 'right';
  band: RBand | null;
  label: string;
  threshold: number | null;
  thresholdName: string | null;
}) {
  const lo = band === null ? 50 : barPercent(band.lo);
  const hi = band === null ? 50 : barPercent(band.hi);
  const mid = band === null ? 1 : band.mid;
  const thLo = threshold === null ? 0 : barPercent(threshold - 0.05);
  const thHi = threshold === null ? 0 : barPercent(threshold + 0.05);

  return (
    <div className={`eval ${side}`} data-testid={`eval-${side}`}>
      <div className="etop">적 우세 ▲</div>
      <div className="ewrap">
        <div className="ecol">
          <div className="ewhite" style={{ height: `${lo}%` }} />
          {/* A band whose ends both sit past the scale still has to render AS a
              band: zero hatch would say "this is a point reading", and the one
              claim this bar always makes is that it is not one. */}
          <div className="egrey" style={{ bottom: `${lo}%`, height: `${Math.max(2.5, hi - lo)}%` }} />
          <div className={`evalr${mid < 0.98 ? ' dis' : ''}`} data-testid={`eval-${side}-r`}>
            {band === null ? '—' : barLabel(mid)}
          </div>
        </div>
        {threshold !== null && (
          <div className="evalth">
            <div className="zone" style={{ bottom: `${thLo}%`, height: `${Math.max(1, thHi - thLo)}%` }} />
            <div className="lab" style={{ bottom: `${thHi}%` }}>
              {thresholdName}
              <br />R≥{threshold.toFixed(2)} 필요
            </div>
          </div>
        )}
      </div>
      <div className="ebot">▼ 내 우세</div>
      <div className="ename">{label}</div>
    </div>
  );
}

interface BloomNode {
  readonly key: string;
  readonly name: string;
  readonly fidelity: Fidelity;
  readonly note: string;
  readonly plan?: boolean;
  readonly onPick: () => void;
}

/** The exaggerated radial bloom. Timing and geometry are the prototype's. */
function Bloom({
  amount,
  caption,
  nodes,
  onDismiss,
}: {
  amount: number;
  caption: string;
  nodes: readonly BloomNode[];
  onDismiss: () => void;
}) {
  const radius = 210;
  return (
    <div className="bloom">
      <button type="button" className="scrim" aria-label="취소" onClick={onDismiss} />
      <div className="center">
        <div className="amt">{amount}</div>
        <div className="cap">{caption}</div>
      </div>
      <div className="ring">
        {nodes.map((node, i) => {
          const angle = (-90 + (360 / nodes.length) * i) * (Math.PI / 180);
          return (
            <button
              key={node.key}
              type="button"
              className={`bnode ${node.fidelity}${node.plan ? ' plan' : ''}`}
              data-testid={`bnode-${node.key}`}
              title={node.note}
              style={{
                left: `calc(50% + ${Math.cos(angle) * radius}px)`,
                top: `calc(46% + ${Math.sin(angle) * radius}px)`,
                animationDelay: `${i * 26}ms`,
              }}
              onClick={node.onPick}
            >
              <span className="nm">{node.name}</span>
              <span className={`tag${node.plan ? '2' : ''}${node.fidelity === 'facade' ? ' fac' : ''}`}>
                {node.fidelity === 'wired' ? '작동' : node.fidelity === 'dev' ? '데모' : '미구현'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
