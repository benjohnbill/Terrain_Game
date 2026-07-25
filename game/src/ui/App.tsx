/**
 * The viewer shell.
 *
 * What ticket 01 has to show is narrow and worth stating plainly: a developer
 * opening the dev path sees an **initial viewer-safe projection** — proof that
 * `(worldId, revision, seed)` boots a Runtime and that what reaches the screen
 * came through the blur seam.
 *
 * The commit-first UI that the game is actually operated through is ticket 04's,
 * against gate 07's sealed interaction skeleton. Nothing here should be mistaken
 * for that design.
 */

import { useMemo, useState } from 'react';
import { Runtime } from '../runtime/runtime.js';
import { BOOT_WORLD } from '../world/index.js';
import { describeProjection } from '../renderer/index.js';
import type { ActorId, GameEvent } from '../runtime/types.js';

const ACTORS: readonly ActorId[] = ['realm-a', 'realm-b'];

export function App() {
  // Interaction state — the seed box, the chosen viewer — lives out here, in
  // the shell, never inside the Runtime.
  const [seed, setSeed] = useState('duel-0001');
  const [viewer, setViewer] = useState<ActorId>('realm-a');
  const [events, setEvents] = useState<GameEvent[]>([]);

  const runtime = useMemo(() => Runtime.open({ world: BOOT_WORLD, seed, actors: ACTORS }), [seed]);
  const view = runtime.view(viewer);

  return (
    <main className="shell">
      <h1>Terrain Game — L3 viewer</h1>
      <p className="note">
        Boot ticket. This shows the initial projection and nothing else; the board arrives with
        ticket 02 and the commit-first shell with ticket 04.
      </p>

      <section className="controls">
        <label>
          seed{' '}
          <input value={seed} onChange={(e) => setSeed(e.target.value)} spellCheck={false} />
        </label>
        <label>
          viewer{' '}
          <select value={viewer} onChange={(e) => setViewer(e.target.value as ActorId)}>
            {ACTORS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section>
        <h2>Projection</h2>
        <pre data-testid="projection">{describeProjection(view)}</pre>
      </section>

      <section>
        <h2>Submit</h2>
        <p className="note">
          No intent kind is wired yet, so every submission is rejected by name — which is the
          point: the door and its guards exist, and they say why.
        </p>
        <button
          type="button"
          onClick={() => setEvents(runtime.submit({ kind: 'noop', actor: viewer }))}
        >
          submit a noop as {viewer}
        </button>
        <button
          type="button"
          onClick={() =>
            setEvents(
              runtime.submit({ kind: 'noop', actor: viewer === 'realm-a' ? 'realm-b' : 'realm-a' }),
            )
          }
        >
          submit out of turn
        </button>
        <pre data-testid="events">{events.map((e) => `${e.type}: ${String(e.detail?.reason ?? '')}`).join('\n')}</pre>
      </section>
    </main>
  );
}
