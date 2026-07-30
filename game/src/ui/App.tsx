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
 */

import { useCallback, useMemo, useState } from 'react';
import { Runtime } from '../runtime/runtime.js';
import { CRADLE_R1 } from '../world/index.js';
import { preview } from '../preview/preview.js';
import { musterHexOf } from '../domain/movement.js';
import type { RecruitmentPosture } from '../domain/recruitment.js';
import type { ActorId, GameEvent, Intent, MatchView, SectorId } from '../runtime/types.js';
import { MapBoard } from './MapBoard.js';

const ACTORS: readonly ActorId[] = ['realm-a', 'realm-b'];
const GREYBOX_RECRUIT_ID = 'greybox-recruit';

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

  const runtime = useMemo(() => Runtime.open({ world: CRADLE_R1, seed, actors: ACTORS }), [seed]);
  const view = useMemo(() => runtime.view(viewer), [runtime, viewer, tick]);

  // A new seed is a new match, so its log and focus go with it. Done in the
  // handler rather than inside the memo: a memo that wrote state would fire
  // twice under StrictMode and is a render-phase side effect either way.
  const changeSeed = useCallback((next: string) => {
    setSeed(next);
    setLog([]);
    setTick(0);
    setFocused(null);
  }, []);

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
      setLog((l) => [...l, ...runtime.submit(intent)]);
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
          viewing{' '}
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
          {log.map((e, i) => `${i + 1}. ${e.type}${e.detail?.reason ? `: ${String(e.detail.reason)}` : ''}`).join('\n')}
        </pre>
      </section>
    </main>
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
    ...view.fronts.filter((front) => front.owners.includes(viewer)).flatMap((front) => front.sectors),
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
