/**
 * Ticket 06c item 10 — re-measure the surge price curve now that deaths exist.
 *
 * The debt row (docs/SYNC-DEBT.md): mobilization intensity at war footing lands
 * near 0.25, so the surge curve's second band never engages. The row's own reason
 * for parking it: "the surge curve's designed trigger is register erosion from
 * deaths, and ticket 05 has no deaths in it — 429 cumulative casualties clear the
 * 42% knee at B = 5".
 *
 * Two questions, in the row's own terms:
 *   (a) does real play in this slice erode a register by 429 or more?
 *   (b) at the eroded register, does refilling the field to the land-derived
 *       ceiling put intensity above the 0.42 peace knee — is the curve live?
 *
 * Landed as a tool rather than run once, because the row is explicitly owed a
 * **re-read after 06d** takes ground: today the invader never captures the sector,
 * so the shield is re-manned and re-wiped every turn and the multi-turn erosion
 * totals are an artifact of that. Run with `node game/tools/surge-remeasure.js`
 * after `npm run build:runtime:game`.
 *
 * It reports rather than judges: nothing here is a threshold, and no acceptance
 * gate reads it (gate 10 owns every pass/fail line).
 */

const {
  CRADLE_R1, Runtime, musterHexOf, buildMovementGraph, minimumCostRoute,
  SURGE, marginalPrice, GARRISON_PER_BORDER_SECTOR,
} = await import(new URL('../dist/runtime/index.js', import.meta.url).href);

const GRAPH = buildMovementGraph(CRADLE_R1);
const ACTORS = ['realm-a', 'realm-b'];

function openAtDecision(seed) {
  const runtime = Runtime.open({ world: CRADLE_R1, seed, actors: ACTORS });
  const setup = runtime.view('observer');
  for (const actor of setup.actors) {
    runtime.submit({
      kind: 'choose-capital', actor,
      sector: setup.realms.find((realm) => realm.actor === actor).sectors[0],
    });
  }
  return runtime;
}

/** Nearest enemy front sector for this realm's opening army. */
function nearestTarget(runtime, actor) {
  const view = runtime.view(actor);
  const own = new Set(view.realms.find((realm) => realm.actor === actor).sectors);
  const army = view.detachments[0];
  let best = null;
  for (const front of view.fronts) {
    const theirs = front.sectors.find((sector) => !own.has(sector));
    if (theirs === undefined) continue;
    const route = minimumCostRoute(GRAPH, army.position, musterHexOf(CRADLE_R1, theirs));
    if (route === null) continue;
    if (best === null || route.length < best.route.length) {
      best = { front: front.key, sector: theirs, route };
    }
  }
  return { ...best, detachmentId: army.id, destination: best.route.at(-1) };
}

function run(seed, turns, { refillGarrisons }) {
  const runtime = openAtDecision(seed);
  const opening = Object.fromEntries(ACTORS.map((actor) => {
    const view = runtime.view(actor);
    return [actor, { register: view.economy.register, forceLimit: view.economy.forceLimit }];
  }));
  const borderSectors = Object.fromEntries(ACTORS.map((actor) => [
    actor, runtime.view(actor).garrisons.length,
  ]));

  // Both realms invade; both keep drafting toward the ceiling, so intensity is
  // measured on a realm that is actually replacing its dead.
  const targets = Object.fromEntries(ACTORS.map((actor) => [actor, nearestTarget(runtime, actor)]));
  for (const actor of ACTORS) {
    runtime.submit({
      kind: 'move-detachment', actor,
      detachmentId: targets[actor].detachmentId,
      destinationHex: targets[actor].destination,
      forcedMarch: false,
    });
  }

  const dead = Object.fromEntries(ACTORS.map((actor) => [actor, 0]));
  const rows = [];

  for (let turn = 1; turn <= turns; turn += 1) {
    for (const actor of ACTORS) {
      const view = runtime.view(actor);
      // Draft toward the ceiling, sited at the capital, priced by the curve.
      if (view.economy.forceLimit - view.economy.field > 0) {
        runtime.submit({
          kind: 'allocate-recruitment', actor, requestId: `surge-field-${turn}`,
          sectorId: view.capitals[actor], commit: 6, posture: 'field',
        });
      }
      // A player who lost a shield refills it: garrison recruitment is an ordinary
      // order (posture 'garrison'), and the shield's headroom is 900 - manned.
      const thin = refillGarrisons
        ? view.garrisons.filter((g) => g.men < GARRISON_PER_BORDER_SECTOR)
            .sort((a, b) => a.men - b.men)[0]
        : undefined;
      if (thin !== undefined) {
        runtime.submit({
          kind: 'allocate-recruitment', actor, requestId: `surge-shield-${turn}`,
          sectorId: thin.sectorId, commit: 6, posture: 'garrison',
        });
      }
      // Keep pressing the front the army is walking into.
      runtime.submit({
        kind: 'allocate-commitment', actor, front: targets[actor].front, chips: 4, detachmentIds: [],
      });
    }
    runtime.submit({ kind: 'lock-commitment', actor: ACTORS[0] });
    const closing = runtime.submit({ kind: 'lock-commitment', actor: ACTORS[1] });

    for (const event of closing) {
      if (event.type !== 'battle-resolved') continue;
      dead[event.detail.attacker] += event.detail.casualties.attacker;
      dead[event.detail.defender] += event.detail.casualties.defender;
    }

    for (const actor of ACTORS) {
      const economy = runtime.view(actor).economy;
      rows.push({
        turn, actor,
        register: economy.register,
        eroded: opening[actor].register - economy.register,
        serving: economy.serving,
        field: economy.field,
        forceLimit: economy.forceLimit,
        intensity: economy.mobilization,
        price: marginalPrice(economy.mobilization),
        dead: dead[actor],
      });
    }
  }

  return { opening, borderSectors, rows, dead };
}

const TURNS = 20;
for (const seed of ['surge-remeasure-0001', 'turn-0001', 'browser-lane-0001']) {
 for (const refillGarrisons of [false, true]) {
  const { opening, borderSectors, rows, dead } = run(seed, TURNS, { refillGarrisons });
  console.log(`\n=== seed ${seed} — ${refillGarrisons ? 'field + shield refill' : 'field refill only'} ===`);
  for (const actor of ACTORS) {
    const o = opening[actor];
    const ceilingServing = o.forceLimit + GARRISON_PER_BORDER_SECTOR * borderSectors[actor];
    const last = rows.filter((row) => row.actor === actor).at(-1);
    const atCeilingBefore = ceilingServing / o.register;
    const atCeilingAfter = ceilingServing / last.register;
    console.log(
      `${actor}: border sectors ${borderSectors[actor]}  register ${o.register} -> ${last.register}` +
      `  eroded ${last.eroded}  dead ${Math.round(dead[actor])}`);
    console.log(
      `  intensity if refilled to ceiling: ${atCeilingBefore.toFixed(4)} -> ${atCeilingAfter.toFixed(4)}` +
      `  (peace knee ${SURGE.peaceKnee})  knee cleared: ${atCeilingAfter > SURGE.peaceKnee ? 'YES' : 'no'}`);
    console.log(
      `  observed intensity turn ${last.turn}: ${last.intensity.toFixed(4)}` +
      `  price x${(last.price / SURGE.base).toFixed(3)} of base  band: ` +
      `${last.intensity <= SURGE.peaceKnee ? 'flat peace' : last.intensity <= SURGE.warKnee ? 'war ramp' : 'desperation tail'}`);
  }
  const crossed = rows.filter((row) => row.intensity > SURGE.peaceKnee);
  console.log(`  turns above the peace knee, observed: ${crossed.length}` +
    (crossed.length ? ` (first: turn ${crossed[0].turn} ${crossed[0].actor} at ${crossed[0].intensity.toFixed(4)})` : ''));
  const trail = rows.filter((r) => r.actor === ACTORS[0]);
  console.log('  realm-a trail (turn: register/serving/intensity/dead):');
  console.log('   ' + trail.map((r) =>
    `${r.turn}: ${r.register}/${r.serving}/${r.intensity.toFixed(3)}/${Math.round(r.dead)}`).join('  '));
 }
}
