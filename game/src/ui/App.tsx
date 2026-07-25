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
import type { ActorId, GameEvent, SectorId } from '../runtime/types.js';
import { MapBoard } from './MapBoard.js';

const ACTORS: readonly ActorId[] = ['realm-a', 'realm-b'];

export function App() {
  const [seed, setSeed] = useState('duel-0001');
  const [viewer, setViewer] = useState<ActorId>('realm-a');
  const [focused, setFocused] = useState<SectorId | null>(null);
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
  const choosing = view.phase === 'capital-selection' && !view.capitalLocked.includes(viewer);
  const selectable = choosing ? (myRealm?.sectors ?? []) : [];

  const pick = useCallback(
    (sector: SectorId) => {
      const card = preview(view, { kind: 'choose-capital', actor: viewer, sector });
      if (!card.admissible) {
        setLog((l) => [...l, { type: 'preview-refused', turn: view.turn, detail: { reason: card.reason ?? '' } }]);
        return;
      }
      setLog((l) => [...l, ...runtime.submit({ kind: 'choose-capital', actor: viewer, sector })]);
      setTick((t) => t + 1);
    },
    [runtime, view, viewer],
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
          <select value={viewer} onChange={(e) => setViewer(e.target.value as ActorId)}>
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
            : 'Locked. Waiting for the other realm to commit.'}
        </p>
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
                  <td>{r.sectors.length} sectors</td>
                  <td>pop {r.population.toFixed(1)}</td>
                  <td>econ {r.economy.toFixed(2)}</td>
                  <td>{view.capitals[r.actor] ?? (view.capitalLocked.includes(r.actor) ? 'locked (hidden)' : '—')}</td>
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
