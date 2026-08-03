/**
 * The viewer shell.
 *
 * What ticket 02 has to show: a player starting a match sees a rendered
 * two-realm board — their own realm, the enemy realm, and both capitals once
 * chosen. The opening beat is the sealed one: choose a capital, both sides
 * simultaneously and in secret, both sites revealed together.
 *
 * Player-facing copy is Korean because the game's audience is; comments and
 * identifiers stay English, per the project's artifact-voice rule.
 *
 * The commit-first shell the game is actually operated through is ticket 04's,
 * against gate 07's sealed interaction skeleton. Nothing here should be mistaken
 * for that design — this is the board and the setup beat, no more.
 *
 * **Interaction state lives here, not in the Runtime**: the seed box, which
 * viewer is being shown, hover, and the sector under consideration but not yet
 * committed. Only a submitted intent crosses into the Runtime.
 *
 * **Demo branch addition — hot-seat legibility, not new mechanics.** The seat is
 * handed between the two realms through one dropdown, which is correct
 * hot-seat wiring and completely undiscoverable: a first-time player locks
 * realm-a's capital, reads "Waiting for realm-b", and has nothing on screen
 * telling them *they* are realm-b too. `SeatBar` states whose seat it is, what
 * that seat must do next, and offers the hand-off as a button. It reads the
 * same projection everything else does and submits nothing — the turn order
 * stays the Runtime's (gate 02), so this can only make the existing loop
 * findable, never change it.
 */

import { useCallback, useMemo, useState } from 'react';
import { Runtime } from '../runtime/runtime.js';
import { CRADLE_R1 } from '../world/index.js';
import { preview } from '../preview/preview.js';
import { isPartyTo } from '../domain/fronts.js';
import { musterHexOf } from '../domain/movement.js';
import type { RecruitmentPosture } from '../domain/recruitment.js';
import type { ActorId, GameEvent, Intent, MatchView, SectorId } from '../runtime/types.js';
import { MapBoard } from './MapBoard.js';

const ACTORS: readonly ActorId[] = ['realm-a', 'realm-b'];
const GREYBOX_RECRUIT_ID = 'greybox-recruit';

/**
 * Korean glosses for the event log — a reading aid appended to the raw type,
 * never a replacement for it.
 *
 * The log is the only place the turn's resolution is visible in this probe, and
 * `front-resolved` / `shield-dissolved` tell an audience nothing. Every key here
 * is an event the Runtime actually emits (`#turnEvent` call sites plus the four
 * submit-path types); an unglossed type renders bare rather than guessed at,
 * which is why the lookup is allowed to miss.
 */
const EVENT_GLOSS: Readonly<Record<string, string>> = {
  'capital-locked': '수도를 정했어요 (상대에게는 아직 비공개)',
  'capitals-revealed': '양쪽 수도가 동시에 공개됐어요',
  'commitment-allocated': '행동력을 구역에 배분했어요',
  'commitment-locked': '커밋을 잠갔어요',
  'commitments-revealed': '양쪽 커밋이 동시에 공개됐어요',
  'turn-opened': '새 턴이 열렸어요',
  'movement-planned': '행군 명령을 세웠어요',
  'detachment-moved': '야전군이 이동했어요',
  'detachment-split': '야전군을 나눴어요',
  'detachments-merged': '야전군을 합쳤어요',
  'posture-transferred': '태세를 바꿔 병력을 옮겼어요',
  'recruitment-allocated': '모병 주문을 넣었어요',
  'recruitment-resolved': '모병이 처리됐어요',
  recruited: '병력을 모았어요',
  'cohort-affiliated': '신병이 부대에 배속됐어요',
  'cohort-activated': '신병이 전투 가용이 됐어요',
  'upkeep-resolved': '피로와 보급을 정산했어요',
  'front-resolved': '전선이 해결됐어요',
  'battle-resolved': '전투가 끝났어요',
  'sector-captured': '구역을 점령했어요',
  'sector-integrated': '점령지가 편입됐어요',
  'shield-dissolved': '수비대가 해체됐어요',
  'realm-recomputed': '국력을 다시 계산했어요',
  'match-ended': '매치가 끝났어요',
  'intent-rejected': '거절됐어요',
  'preview-refused': '미리보기가 막았어요',
};

/**
 * Korean labels for the battle card's ground, over the exact value domains
 * `domain/battle.ts` declares (`BattleTerrain`, `BattleFortification`,
 * `BattleCrossing`) and `world/schema.ts`'s `ChokeClass`.
 *
 * Labels only, and **no multipliers**: the M5 ladders are private constants with
 * one owner, so printing their numbers here would be a second home for a dial,
 * and the composed power reading is what ticket 09's EVAL BAR is for. The card
 * tells a player *what ground it was*, which is public (fog ruling ① for the
 * wall, terrain throughout), and lets the ladder stay where it lives.
 */
const TERRAIN_LABEL: Readonly<Record<string, string>> = {
  plains: '평지',
  forestHills: '숲·구릉',
  mountains: '산지',
  pass: '관문',
  legendaryNaturalSite: '천험의 요지',
};

const FORTIFICATION_LABEL: Readonly<Record<string, string>> = {
  none: '축성 없음',
  fieldWorks: '야전 축성',
  townWalls: '읍성',
  fortress: '요새',
  legendaryFortress: '천하의 요새',
};

const CROSSING_LABEL: Readonly<Record<string, string>> = {
  none: '도하 없음',
  riverUncontested: '강 건넘 (무저항)',
  riverOpposed: '강 건넘 (저항)',
  straitUncontested: '해협 건넘 (무저항)',
  straitOpposed: '해협 건넘 (저항)',
};

const DEFENSE_METHOD_LABEL: Readonly<Record<string, string>> = {
  STRONGHOLD: '거점 방어',
  DELAYING: '지연 방어',
};

export function App() {
  const [seed, setSeed] = useState('duel-0001');
  const [viewer, setViewer] = useState<ActorId>('realm-a');
  const [focused, setFocused] = useState<SectorId | null>(null);
  const [detachmentChoice, setDetachmentChoice] = useState('');
  const [forcedMarch, setForcedMarch] = useState(false);
  const [splitMen, setSplitMen] = useState('1');
  const [recruitSectorChoice, setRecruitSectorChoice] = useState<SectorId | ''>('');
  const [recruitPosture, setRecruitPosture] = useState<RecruitmentPosture>('field');
  const [log, setLog] = useState<GameEvent[]>([]);
  // Bumped on every accepted submission, so the view is re-read from the
  // Runtime rather than mirrored in component state. The Runtime stays the only
  // owner of truth; this is just a cache-invalidation tick.
  const [tick, setTick] = useState(0);

  // A new match is a new `Runtime` — the terminal phase deliberately has no exit
  // (see `MatchPhase`), so restarting cannot be a submission; it has to build
  // another one. This counter is what lets that happen on the **same** seed:
  // without it the memo would hand back the ended match and "다시" would do nothing,
  // which is exactly the replay a player wants most after losing one.
  const [generation, setGeneration] = useState(0);
  const runtime = useMemo(
    () => Runtime.open({ world: CRADLE_R1, seed, actors: ACTORS }),
    [seed, generation],
  );
  const view = useMemo(() => runtime.view(viewer), [runtime, viewer, tick]);

  // Interaction state belongs to this component, so a new match resets it here; the
  // Runtime resets its own by being a new one. Done in the handler rather than
  // inside the memo: a memo that wrote state would fire twice under StrictMode and
  // is a render-phase side effect either way.
  const resetInteraction = useCallback(() => {
    setLog([]);
    setTick(0);
    setFocused(null);
    setDetachmentChoice('');
    setForcedMarch(false);
    setSplitMen('1');
    setRecruitSectorChoice('');
    setRecruitPosture('field');
  }, []);

  const changeSeed = useCallback((next: string) => {
    setSeed(next);
    resetInteraction();
  }, [resetInteraction]);

  const startNewMatch = useCallback(() => {
    setGeneration((n) => n + 1);
    resetInteraction();
  }, [resetInteraction]);

  const myRealm = view.realms.find((r) => r.actor === viewer);
  const choosing = view.phase === 'capital-selection' && !view.committed.includes(viewer);
  const selectable = choosing ? (myRealm?.sectors ?? []) : [];
  const ownedSectors = myRealm?.sectors ?? [];
  // Keep transient choices local, but derive valid fallbacks during render when
  // a viewer switch or Runtime mutation makes a stored choice stale.
  const selectedDetachmentId = view.detachments.some((detachment) => detachment.id === detachmentChoice)
    ? detachmentChoice
    : (view.detachments[0]?.id ?? '');
  const recruitSector = recruitSectorChoice !== '' && ownedSectors.includes(recruitSectorChoice)
    ? recruitSectorChoice
    : (ownedSectors[0] ?? '');

  // Every player action goes through one door: preview first, submit only what
  // preview admits, and let the Runtime own the outcome. A second copy of this for
  // each intent kind is how the shell would start deciding legality for itself.
  const submitting = useCallback(
    (intent: Intent) => {
      const card = preview(view, intent);
      if (!card.admissible) {
        setLog((l) => [...l, { type: 'preview-refused', turn: view.turn, detail: { reason: card.reason ?? '' } }]);
        return;
      }
      // `runtime.submit` is a mutation and must run OUTSIDE the state updater.
      // React StrictMode double-invokes updaters in development to surface
      // impurity, so a submit called inside one is sent twice: the first attempt
      // succeeds and the second is rejected as a repeat, and the rejection is
      // what the player is left looking at. It survives only in `dev:game` —
      // StrictMode does not double-invoke in a production build, which is why the
      // Playwright suite (which drives the built bundle) never saw it.
      const events = runtime.submit(intent);
      setLog((l) => [...l, ...events]);
      setTick((t) => t + 1);
    },
    [runtime, view],
  );

  const allocateChips = useCallback(
    (sector: SectorId, chips: number) =>
      submitting({ kind: 'allocate-commitment', actor: viewer, sector, chips }),
    [submitting, viewer],
  );

  const moveSelected = useCallback(() => {
    if (selectedDetachmentId === '' || focused === null) return;
    submitting({
      kind: 'move-detachment',
      actor: viewer,
      detachmentId: selectedDetachmentId,
      destinationHex: musterHexOf(view.board, focused),
      forcedMarch,
    });
  }, [focused, forcedMarch, selectedDetachmentId, submitting, view.board, viewer]);

  const splitSelected = useCallback(() => {
    if (selectedDetachmentId === '') return;
    submitting({
      kind: 'split-detachment',
      actor: viewer,
      detachmentId: selectedDetachmentId,
      men: Number(splitMen),
    });
  }, [selectedDetachmentId, splitMen, submitting, viewer]);

  const mergeSelected = useCallback(() => {
    const selected = view.detachments.find((detachment) => detachment.id === selectedDetachmentId);
    if (selected === undefined) return;
    const detachmentIds = view.detachments
      .filter((detachment) =>
        detachment.position.q === selected.position.q && detachment.position.r === selected.position.r)
      .map((detachment) => detachment.id);
    submitting({ kind: 'merge-detachments', actor: viewer, detachmentIds });
  }, [selectedDetachmentId, submitting, view.detachments, viewer]);

  const allocateRecruitment = useCallback(
    (sectorId: SectorId, posture: RecruitmentPosture, commit: number) => submitting({
      kind: 'allocate-recruitment',
      actor: viewer,
      requestId: GREYBOX_RECRUIT_ID,
      sectorId,
      posture,
      commit,
    }),
    [submitting, viewer],
  );

  const lockTurn = useCallback(() => submitting({ kind: 'lock-commitment', actor: viewer }), [submitting, viewer]);

  const pick = useCallback(
    (sector: SectorId) => submitting({ kind: 'choose-capital', actor: viewer, sector }),
    [submitting, viewer],
  );

  // Whose seat is owed a move, read off the projection rather than tracked here:
  // `committed` is the Runtime's own answer to "who is done this beat", and it
  // means capital-locked in the opening beat and commitment-locked afterwards.
  // Deriving instead of storing is why the hand-off cannot drift out of step
  // with the match.
  const owing = view.actors.filter((actor) => !view.committed.includes(actor));
  const seatDone = view.committed.includes(viewer);
  const nextSeat = owing.find((actor) => actor !== viewer) ?? null;
  // A hand-off is offered only when this seat has nothing left to do and another
  // seat does. It moves the chair, never the match — no intent is submitted.
  const handOff = useCallback(() => {
    if (nextSeat === null) return;
    setViewer(nextSeat);
    setFocused(null);
  }, [nextSeat]);

  // Battles are read back out of the log rather than stored a second time: the
  // log already holds every event the Runtime published, and a parallel copy is
  // how the two would come to disagree about what happened.
  const battles = useMemo(
    () => log.filter((event) => event.type === 'battle-resolved').reverse(),
    [log],
  );

  return (
    <main className="shell">
      <header>
        <h1>Terrain Game — L3 viewer</h1>
        <p className="note">
          {view.world.worldId}@{view.world.revision} · {view.board.regions.length} regions ·{' '}
          {Object.keys(view.board.sectors).length} sectors · turn {view.turn} · {view.phase}
        </p>
      </header>

      <section className="controls">
        <label>
          seed <input value={seed} onChange={(e) => changeSeed(e.target.value)} spellCheck={false} />
        </label>
        <label>
          조종 중{' '}
          <select data-testid="viewer" value={viewer} onChange={(e) => setViewer(e.target.value as ActorId)}>
            {ACTORS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
        <span className="hint">wheel to zoom · drag to pan</span>
      </section>

      <SeatBar
        view={view}
        viewer={viewer}
        seatDone={seatDone}
        nextSeat={nextSeat}
        owing={owing}
        onHandOff={handOff}
      />

      {view.outcome !== null && (
        <VictoryScreen outcome={view.outcome} viewer={viewer} onNewMatch={startNewMatch} />
      )}

      {view.phase === 'capital-selection' && (
        <p className="prompt" data-testid="prompt">
          {choosing
            ? '수도를 골라주세요 — click any sector your realm owns.'
            : `Locked. Waiting for ${view.actors.filter((a) => !view.committed.includes(a)).join(', ')}.`}
        </p>
      )}

      {view.phase === 'decision' && (
        <TurnStrip
          view={view}
          viewer={viewer}
          focused={focused}
          selectedDetachmentId={selectedDetachmentId}
          forcedMarch={forcedMarch}
          splitMen={splitMen}
          recruitSector={recruitSector}
          recruitPosture={recruitPosture}
          onAllocate={allocateChips}
          onSelectDetachment={setDetachmentChoice}
          onForcedMarch={setForcedMarch}
          onSplitMen={setSplitMen}
          onMarch={moveSelected}
          onSplit={splitSelected}
          onMerge={mergeSelected}
          onRecruitSector={setRecruitSectorChoice}
          onRecruitPosture={setRecruitPosture}
          onRecruit={allocateRecruitment}
          onLock={lockTurn}
        />
      )}

      <MapBoard
        view={view}
        selectable={selectable}
        focused={focused}
        onFocus={setFocused}
        onPick={pick}
      />

      {battles.length > 0 && (
        <section data-testid="battles">
          <h2>전투</h2>
          {/* Newest first: the card a player is looking for is the one that just
              resolved, and older ones stay readable underneath as the match's
              military history rather than being replaced. */}
          {battles.map((battle, i) => (
            <BattleCard key={`${battle.turn}-${i}`} detail={battle.detail ?? {}} />
          ))}
        </section>
      )}

      <section className="readout">
        <div>
          <h2>Realms</h2>
          <table data-testid="realms">
            <tbody>
              {view.realms.map((r) => (
                <tr key={r.actor} className={r.actor === viewer ? 'self' : ''}>
                  <td>{r.actor}</td>
                  <td>{r.regions.join(' ')}</td>
                  <td>{r.sectors.length} sectors (control)</td>
                  <td>pop {r.population.toFixed(1)}</td>
                  <td data-testid={`yield-${r.actor}`}>수입 {r.yield.toFixed(2)}</td>
                  <td data-testid={`limit-${r.actor}`}>상한 {r.forceLimit.toLocaleString('en-US')}</td>
                  <td>{view.capitals[r.actor] ?? (view.committed.includes(r.actor) ? 'locked (hidden)' : '—')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h2>Focus</h2>
          <pre data-testid="focus">{focused ? describeSector(view, focused) : 'hover a sector'}</pre>
        </div>
      </section>

      <section>
        <h2>Events</h2>
        <pre data-testid="events">
          {log.map((e, i) => {
            // The raw type stays first and unaltered: it is the contract the
            // tests read, and it is the only part of this line that is authored
            // by the Runtime rather than by the shell.
            const gloss = EVENT_GLOSS[e.type];
            const reason = e.detail?.reason ? `: ${String(e.detail.reason)}` : '';
            return `${i + 1}. ${e.type}${reason}${gloss ? `  — ${gloss}` : ''}`;
          }).join('\n')}
        </pre>
      </section>
    </main>
  );
}

/**
 * One resolved battle, read causally rather than chronologically.
 *
 * A battle is a single deterministic judgment, not a sequence of rounds, so there
 * is no process to replay — what a player needs instead is *why it came out that
 * way*. The card puts the ground first and the two commitments second, because
 * that is the order the model works in: terrain and walls belong to the
 * defender, and commitment is the lever each side pulls on top of them. "I poured
 * more and still lost" becomes legible the moment the mountain and the wall are
 * on the same card.
 *
 * Everything here is already viewer-safe. `submit()` names the battle's public
 * fields one by one and drops exact pre-battle strength and the composed power
 * product on purpose (they are ticket 08's bands and ticket 09's EVAL BAR), so
 * this card cannot show a strength ratio and does not try to.
 */
function BattleCard({ detail }: { detail: Readonly<Record<string, unknown>> }) {
  const str = (key: string): string | null =>
    typeof detail[key] === 'string' ? (detail[key] as string) : null;
  const label = (table: Readonly<Record<string, string>>, key: string): string | null => {
    const raw = str(key);
    return raw === null ? null : (table[raw] ?? raw);
  };
  // `winner` names the ROLE, not the realm — 'ATTACKER' | 'DEFENDER' | 'NEITHER'
  // — and the third value is a real outcome rather than a missing one: a Delaying
  // defence below the breakthrough ratio buys a turn without either side winning.
  // Reading it as an actor id reports both sides as losers, which is what the
  // first draft of this card did.
  const winner = str('winner');
  const side = (role: 'attacker' | 'defender') => {
    const commitments = detail.commitments as Record<string, unknown> | undefined;
    const casualties = detail.casualties as Record<string, unknown> | undefined;
    const routed = detail.routed as Record<string, unknown> | undefined;
    const num = (from: Record<string, unknown> | undefined): number | null =>
      typeof from?.[role] === 'number' ? (from[role] as number) : null;
    return {
      actor: str(role),
      commit: num(commitments),
      dead: num(casualties),
      routed: routed?.[role] === true,
      result: winner === 'NEITHER'
        ? '결판 없음'
        : winner === role.toUpperCase() ? '승리' : '패배',
    };
  };

  const attacker = side('attacker');
  const defender = side('defender');
  const fell = detail.sectorFalls === true;
  // The ground, in the order it is priced: what it is, what had to be crossed to
  // reach it, what was built on it, and how it was held.
  const ground = [
    label(TERRAIN_LABEL, 'terrain'),
    label(CROSSING_LABEL, 'crossing'),
    label(FORTIFICATION_LABEL, 'fortification'),
    label(DEFENSE_METHOD_LABEL, 'defenseMethod'),
  ].filter((part): part is string => part !== null);

  const row = (role: string, s: ReturnType<typeof side>) => (
    <tr>
      <td>{s.actor}</td>
      <td>{role}</td>
      <td>{s.commit === null ? '—' : `행동력 ${s.commit}`}</td>
      <td>
        {s.result}
        {s.routed ? ' · 궤주' : ''}
      </td>
      <td>{s.dead === null ? '—' : `전사 ${Math.round(s.dead).toLocaleString('en-US')}`}</td>
    </tr>
  );

  return (
    <article className="battle-card">
      <h3>
        {str('sector') ?? '—'}
        {' '}
        <span className="hint">{fell ? '구역이 넘어갔어요' : '구역을 지켰어요'}</span>
      </h3>
      <p className="battle-ground">{ground.join(' · ')}</p>
      <table>
        <tbody>
          {row('공격', attacker)}
          {row('방어', defender)}
        </tbody>
      </table>
      {/* `fortificationDamage` is Delaying's erosion clock — a magnitude, not a
          flag. Reporting it as a boolean loses the whole point of the mechanic,
          which is that a wall wears down across repeated defences. */}
      <p className="hint">
        {typeof detail.fortificationDamage === 'number' && detail.fortificationDamage > 0
          ? `성벽 침식 ${(detail.fortificationDamage as number).toFixed(2)}`
          : '성벽 온전'}
        {' · '}
        {detail.routeDisrupted === true ? '보급로 차단' : '보급로 온전'}
      </p>
    </article>
  );
}

/**
 * Whose seat this is, what the seat owes, and the hand-off.
 *
 * The one thing hot-seat play needs and this shell had nowhere: a player who has
 * locked realm-a is *also* realm-b, and nothing said so. Three lines, in the
 * order a player needs them — who am I, what beat is this, what do I do now —
 * then the hand-off as a button rather than as knowledge about a dropdown.
 *
 * It derives every word from the projection and submits nothing. Deliberately
 * not automatic: the seat changing under the player is how a hot-seat game
 * leaks, and saying "hand over" out loud is the beat a demo wants anyway.
 */
function SeatBar({
  view,
  viewer,
  seatDone,
  nextSeat,
  owing,
  onHandOff,
}: {
  view: MatchView;
  viewer: ActorId;
  seatDone: boolean;
  nextSeat: ActorId | null;
  owing: readonly ActorId[];
  onHandOff: () => void;
}) {
  const over = view.outcome !== null;
  const beat = over
    ? '매치 종료'
    : view.phase === 'capital-selection'
      ? '수도 선택'
      : '커밋';

  // What this seat owes, right now. The waiting case names the other seat because
  // that is the whole point: the player is both of them.
  const step = over
    ? '판이 멈췄어요. 아래에서 새 매치를 시작할 수 있어요.'
    : !seatDone
      ? view.phase === 'capital-selection'
        ? '수도를 고르세요 — 내 땅(밝은 구역) 아무 곳이나 클릭.'
        : '행동력을 구역에 배분하고 커밋을 잠그세요.'
      : nextSeat !== null
        ? `이 좌석은 끝났어요. ${nextSeat} 차례예요 — 아래 버튼으로 넘기세요.`
        : owing.length === 0
          ? '양쪽 다 잠갔어요. 공개가 해결되면 다음 턴이 열려요.'
          : `${owing.join(', ')} 대기 중.`;

  return (
    <section className="seatbar" data-testid="seatbar">
      <div className="seatbar-head">
        <span className="seat-label">조종 중</span>
        <strong className={`seat-badge seat-${viewer}`} data-testid="seat-actor">{viewer}</strong>
        <span className="hint">턴 {view.turn} · {beat}</span>
      </div>
      <p className="seatbar-step" data-testid="seat-step">{step}</p>
      {/* Naming the invasion is the difference between a loop that turns and a
          loop that turns forever without a war: pouring chips and locking is a
          complete legal turn, so a player told only to do that never marches, never
          meets the enemy, and never sees a battle at all. */}
      {!over && !seatDone && view.phase === 'decision' && (
        <p className="hint" data-testid="seat-aside">
          적 구역을 골라 야전군을 행군시키면, 그 구역에서 전투가 벌어져요.
        </p>
      )}
      {!over && nextSeat !== null && seatDone && (
        <button type="button" className="handoff" data-testid="hand-off" onClick={onHandOff}>
          ▶ {nextSeat}에게 좌석 넘기기
        </button>
      )}
    </section>
  );
}

/**
 * A grey-box probe for ticket 03's loop — **not** the commit-first shell.
 *
 * Ticket 04 owns how the game is actually operated, against gate 07's sealed
 * interaction skeleton (three zones, a commit bar, information summoned rather than
 * displayed). This strip exists only so the turn cycle ticket 03 built is visible to
 * a human rather than only to tests: allocate chips to a sector, lock, watch the
 * reveal land in the event log, and see turn N+1 open. It is meant to be deleted.
 *
 * Ticket 05 added two rows to the same probe rather than a second surface: the
 * realm's own economy, and a draft order priced by the same rule that will
 * resolve it. Both belong to the commit bar gate 07 sealed, so ticket 04 inherits
 * *what* they say while replacing *how* they look.
 *
 * The viewer dropdown makes this shell hotseat by construction, and the event log
 * is shared across both seats — a development affordance, not a two-client
 * surface. Secrecy is enforced where it is load-bearing: the projection hands a
 * viewer only their own stack, and the log renders event *types*, never contents.
 */
function TurnStrip({
  view,
  viewer,
  focused,
  selectedDetachmentId,
  forcedMarch,
  splitMen,
  recruitSector,
  recruitPosture,
  onAllocate,
  onSelectDetachment,
  onForcedMarch,
  onSplitMen,
  onMarch,
  onSplit,
  onMerge,
  onRecruitSector,
  onRecruitPosture,
  onRecruit,
  onLock,
}: {
  view: MatchView;
  viewer: ActorId;
  focused: SectorId | null;
  selectedDetachmentId: string;
  forcedMarch: boolean;
  splitMen: string;
  recruitSector: SectorId | '';
  recruitPosture: RecruitmentPosture;
  onAllocate: (sector: SectorId, chips: number) => void;
  onSelectDetachment: (id: string) => void;
  onForcedMarch: (forced: boolean) => void;
  onSplitMen: (men: string) => void;
  onMarch: () => void;
  onSplit: () => void;
  onMerge: () => void;
  onRecruitSector: (sector: SectorId | '') => void;
  onRecruitPosture: (posture: RecruitmentPosture) => void;
  onRecruit: (sector: SectorId, posture: RecruitmentPosture, commit: number) => void;
  onLock: () => void;
}) {
  const locked = view.committed.includes(viewer);
  const waitingOn = view.actors.filter((actor) => !view.committed.includes(actor));
  const economy = view.economy;
  const ownedSectors = view.realms.find((realm) => realm.actor === viewer)?.sectors ?? [];
  const selectedDetachment = view.detachments.find((detachment) => detachment.id === selectedDetachmentId);
  const mergeableIds = selectedDetachment === undefined
    ? []
    : view.detachments
        .filter((detachment) =>
          detachment.position.q === selectedDetachment.position.q &&
          detachment.position.r === selectedDetachment.position.r)
        .map((detachment) => detachment.id);
  // Chips are poured onto sectors now (ADR 0046 item 4), and every sector is a legal
  // target — so a probe has to *choose* which to offer rather than enumerate a
  // border list. Three sources, because each is a thing a player is already looking
  // at: the sectors of the borders this realm touches, whatever is focused on the
  // map (the only way to reach the interior, which is the point of the re-key), and
  // anything already committed, so a pour is always visible and always clearable.
  // Ticket 04's commit-first shell replaces this whole affordance.
  const commitTargets = [...new Set([
    ...view.fronts.filter((front) => isPartyTo(front, viewer)).flatMap((front) => front.sectors),
    ...(focused === null ? [] : [focused]),
    ...Object.keys(view.commitment.allocations).filter((key) => key in view.board.sectors),
  ])].sort();
  const recruitmentOrder = view.recruitmentOrders.find((order) => order.requestId === GREYBOX_RECRUIT_ID);
  const recruitChips = recruitmentOrder?.commit ?? 0;
  // The same sited request the background tier will resolve, priced before lock.
  const recruitmentCard = recruitSector === ''
    ? null
    : preview(view, {
        kind: 'allocate-recruitment',
        actor: viewer,
        requestId: GREYBOX_RECRUIT_ID,
        sectorId: recruitSector,
        posture: recruitPosture,
        commit: recruitChips,
      }).recruitment;
  const draft = recruitmentCard?.fulfillment;

  return (
    <section className="prompt" data-testid="turn-strip">
      <p>
        턴 {view.turn} · 행동력 {view.commitment.remaining}/{view.commitment.budget} 남음
        {locked ? ` · 잠금 완료, ${waitingOn.join(', ')} 대기 중` : ' · 구역에 커밋하고 잠그세요'}
      </p>
      <table data-testid="commit-sectors">
        <tbody>
          {commitTargets.map((sector) => {
            const chips = view.commitment.allocations[sector] ?? 0;
            return (
              <tr key={sector}>
                <td>{sector}</td>
                <td data-testid={`chips-${sector}`}>{chips}</td>
                <td>
                  <button type="button" disabled={locked} onClick={() => onAllocate(sector, chips + 1)}>
                    +1
                  </button>
                  <button type="button" disabled={locked || chips === 0} onClick={() => onAllocate(sector, 0)}>
                    clear
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {economy && (
        <p data-testid="economy">
          국고 {economy.treasury.toFixed(2)} (+{economy.income.toFixed(2)}/턴) · 야전군{' '}
          {economy.field.toLocaleString('en-US')}/{economy.forceLimit.toLocaleString('en-US')} · 수비대{' '}
          {economy.garrison.toLocaleString('en-US')} · 명부 {economy.register.toLocaleString('en-US')} · 동원 강도{' '}
          {(economy.mobilization * 100).toFixed(1)}%
        </p>
      )}
      <table data-testid="detachments">
        <tbody>
          {view.detachments.map((detachment) => (
            <tr key={detachment.id}>
              <td>{detachment.id}</td>
              <td>
                {formatHex(detachment.position)} →{' '}
                {detachment.destination === null ? '—' : formatHex(detachment.destination)} ·{' '}
                {detachment.turnsRemaining}턴
              </td>
              <td>{detachment.readyMen.toLocaleString('en-US')}명 준비</td>
              <td>
                {detachment.pendingMen.toLocaleString('en-US')}명 다음 전투 가용
                {detachment.pendingReadyOnTurn === null ? '' : ` (턴 ${detachment.pendingReadyOnTurn})`}
              </td>
              <td>피로 {detachment.fatigue}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="operation-controls">
        <label>
          detachment{' '}
          <select
            data-testid="detachment-select"
            value={selectedDetachmentId}
            onChange={(event) => onSelectDetachment(event.target.value)}
          >
            {view.detachments.map((detachment) => (
              <option key={detachment.id} value={detachment.id}>{detachment.id}</option>
            ))}
          </select>
        </label>
        <label>
          <input
            data-testid="forced-march"
            type="checkbox"
            checked={forcedMarch}
            onChange={(event) => onForcedMarch(event.target.checked)}
          />{' '}
          forced march
        </label>
        <button
          type="button"
          data-testid="march-focused"
          disabled={locked || selectedDetachmentId === '' || focused === null}
          onClick={onMarch}
        >
          focused sector로 행군
        </button>
        <label>
          split men{' '}
          <input
            data-testid="split-men"
            type="number"
            min="1"
            step="1"
            value={splitMen}
            onChange={(event) => onSplitMen(event.target.value)}
          />
        </label>
        <button type="button" data-testid="split-selected" disabled={locked || selectedDetachmentId === ''} onClick={onSplit}>
          split selected
        </button>
        <button type="button" data-testid="merge-selected" disabled={locked || mergeableIds.length < 2} onClick={onMerge}>
          merge selected
        </button>
      </div>
      <table data-testid="garrisons">
        <tbody>
          {view.garrisons.map((garrison) => (
            <tr key={garrison.sectorId}>
              <td>{garrison.sectorId}</td>
              <td>{garrison.readyMen.toLocaleString('en-US')}명 준비</td>
              <td>{garrison.pendingMen.toLocaleString('en-US')}명 다음 전투 가용</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p data-testid="mobilization-signals">
        {view.mobilizationSignals.length === 0
          ? '상대 동원 징후 —'
          : view.mobilizationSignals.map((signal) =>
              `${signal.actor} · ${signal.sectorId} · 턴 ${signal.observedTurn} · ${signal.band}`).join(' | ')}
      </p>
      <table data-testid="orders">
        <tbody>
          <tr>
            <td>
              <label>
                모병 위치{' '}
                <select
                  data-testid="recruit-sector"
                  value={recruitSector}
                  disabled={locked}
                  onChange={(event) => onRecruitSector(event.target.value as SectorId)}
                >
                  {ownedSectors.map((sector) => <option key={sector} value={sector}>{sector}</option>)}
                </select>
              </label>
              <label>
                태세{' '}
                <select
                  data-testid="recruit-posture"
                  value={recruitPosture}
                  disabled={locked}
                  onChange={(event) => onRecruitPosture(event.target.value as RecruitmentPosture)}
                >
                  <option value="field">field</option>
                  <option value="garrison">garrison</option>
                </select>
              </label>
            </td>
            <td data-testid="chips-recruit">{recruitChips}</td>
            <td data-testid="draft-preview">
              {draft && draft.men > 0
                ? `${recruitSector} · +${draft.men.toLocaleString('en-US')}명 · ${recruitmentCard!.batch.bill.toFixed(2)} 생산${
                    draft.limitedBy.length > 0 ? ` (${draft.limitedBy.join('+')} 한계)` : ''
                  }`
                : `${recruitSector || '—'} · —`}
            </td>
            <td>
              <button
                type="button"
                data-testid="recruit-plus"
                disabled={locked || recruitSector === ''}
                onClick={() => recruitSector !== '' && onRecruit(recruitSector, recruitPosture, recruitChips + 1)}
              >
                +1
              </button>
              <button
                type="button"
                disabled={locked || recruitChips === 0 || recruitSector === ''}
                onClick={() => recruitSector !== '' && onRecruit(recruitSector, recruitPosture, 0)}
              >
                clear
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <button type="button" data-testid="lock" disabled={locked} onClick={onLock}>
        커밋 잠그기
      </button>
    </section>
  );
}

/**
 * The match is over — who won, and why play stopped (ticket 07 acceptance item 8).
 *
 * It states the *cause*, not only the result, because there is exactly one cause and
 * naming it is what makes the ending legible: a capital fell (ADR 0042). No score, no
 * margin and no breakdown — there is nothing else to report, and inventing a summary
 * line here is how a scorecard grows back.
 *
 * Greybox, like the rest of this shell: ticket 04 owns how the game is actually
 * presented, and mistaking this for that design is the error the file header warns of.
 */
function VictoryScreen({
  outcome,
  viewer,
  onNewMatch,
}: {
  outcome: NonNullable<MatchView['outcome']>;
  viewer: ActorId;
  onNewMatch: () => void;
}) {
  const won = outcome.winner === viewer;
  return (
    <section className="prompt" data-testid="victory">
      <h2>{won ? '승리' : '패배'}</h2>
      <p>
        <strong data-testid="victory-winner">{outcome.winner}</strong>
        {' '}wins — <code>{outcome.capital}</code>, {outcome.loser}의 수도가 turn{' '}
        {outcome.turn}에 함락됐어요. 그래서 판이 멈췄어요.
      </p>
      <button type="button" data-testid="new-match" onClick={onNewMatch}>
        새 매치
      </button>
    </section>
  );
}

function formatHex(position: { readonly q: number; readonly r: number }): string {
  return `${position.q},${position.r}`;
}

function describeSector(view: ReturnType<Runtime['view']>, sectorId: SectorId): string {
  const sector = view.board.sectors[sectorId];
  if (!sector) return sectorId;
  const region = view.board.regions.find((r) => r.id === sector.regionId);
  const owner = view.realms.find((r) => r.sectors.includes(sectorId))?.actor ?? 'unowned';
  const terrain = [...new Set(sector.mapUnits.map((u) => u.terrainLayer))].join(', ');
  return [
    `${sectorId}  (${region?.name ?? sector.regionId})`,
    `owner    ${owner}`,
    `terrain  ${terrain}`,
    `pop      ${sector.populationValue.toFixed(2)}`,
    `econ     ${sector.economyValue.toFixed(2)}`,
    `hexes    ${sector.mapUnits.length}`,
    `adjacent ${(view.board.sectorAdjacency[sectorId] ?? []).join(' ') || '(none inside its region)'}`,
  ].join('\n');
}
