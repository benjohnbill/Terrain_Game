/**
 * Canonical field-army movement over the authored world.
 *
 * Hex adjacency supplies the ordinary ground graph. Authored sector edges are
 * unioned into it so a declared door remains traversable even when its endpoint
 * sectors do not happen to touch in the frozen hex layout (ADR 0043, WM-④).
 */

import { menOf, type Detachment } from './force.js';
import { hexKey, HEX_NEIGHBOURS } from '../world/schema.js';
import type {
  HexPosition,
  SectorId,
  TerrainLayer,
  WorldArtifact,
} from '../world/schema.js';

export const MARCH_SPEED = 3;
export const FORCED_MARCH_EXTRA_CAP = 2;
export const MARCH_FATIGUE_PER_HEX = 1;
export const FORCED_MARCH_PREMIUM = 3;

export interface MovementArc {
  readonly to: string;
  readonly cost: number;
}

export interface MovementNode {
  readonly position: HexPosition;
  readonly sectorId: SectorId;
  readonly arcs: readonly MovementArc[];
}

export interface MovementGraph {
  readonly nodes: Readonly<Record<string, MovementNode>>;
}

type PositionedDetachment = Pick<Detachment, 'id' | 'position'>;

interface QueueEntry {
  readonly key: string;
  readonly cost: number;
  readonly path: readonly string[];
}

/** Uniform until the authored terrain revision supplies a real cost table. */
export function terrainMovementCost(_layer: TerrainLayer): number {
  return 1;
}

function comparePosition(a: HexPosition, b: HexPosition): number {
  return a.q - b.q || a.r - b.r;
}

function axialDistance(a: HexPosition, b: HexPosition): number {
  const dq = a.q - b.q;
  const dr = a.r - b.r;
  return (Math.abs(dq) + Math.abs(dr) + Math.abs(dq + dr)) / 2;
}

function comparePath(
  graph: MovementGraph,
  a: readonly string[],
  b: readonly string[],
): number {
  const length = Math.min(a.length, b.length);
  for (let index = 0; index < length; index += 1) {
    const compared = comparePosition(
      graph.nodes[a[index]!]!.position,
      graph.nodes[b[index]!]!.position,
    );
    if (compared !== 0) return compared;
  }
  return a.length - b.length;
}

function compareQueue(graph: MovementGraph, a: QueueEntry, b: QueueEntry): number {
  return a.cost - b.cost || comparePosition(
    graph.nodes[a.key]!.position,
    graph.nodes[b.key]!.position,
  );
}

/** Hex adjacency union every authored sector edge, with canonical arc order. */
export function buildMovementGraph(world: WorldArtifact): MovementGraph {
  const nodeInputs = Object.values(world.sectors)
    .flatMap((sector) => sector.mapUnits.map((unit) => ({
      key: hexKey(unit.q, unit.r),
      position: { q: unit.q, r: unit.r },
      sectorId: sector.id,
      terrainLayer: unit.terrainLayer,
    })))
    .sort((a, b) => comparePosition(a.position, b.position));
  const inputByKey = new Map(nodeInputs.map((input) => [input.key, input]));
  const arcsByKey = new Map<string, Map<string, number>>(
    nodeInputs.map((input) => [input.key, new Map<string, number>()]),
  );

  const addArc = (from: string, to: string, cost: number): void => {
    const arcs = arcsByKey.get(from);
    if (arcs === undefined) return;
    const existing = arcs.get(to);
    if (existing === undefined || cost < existing) arcs.set(to, cost);
  };

  for (const input of nodeInputs) {
    for (const [dq, dr] of HEX_NEIGHBOURS) {
      const neighbourKey = hexKey(input.position.q + dq, input.position.r + dr);
      const neighbour = inputByKey.get(neighbourKey);
      if (neighbour === undefined) continue;
      addArc(input.key, neighbourKey, terrainMovementCost(neighbour.terrainLayer));
    }
  }

  for (const edge of world.edges) {
    const sideA = world.sectors[edge.a]?.mapUnits;
    const sideB = world.sectors[edge.b]?.mapUnits;
    if (sideA === undefined || sideB === undefined || sideA.length === 0 || sideB.length === 0) {
      continue;
    }
    const pairs = sideA.flatMap((a) => sideB.map((b) => ({ a, b, distance: axialDistance(a, b) })));
    if (pairs.some((pair) => pair.distance === 1)) continue;
    pairs.sort((left, right) =>
      left.distance - right.distance ||
      left.a.q - right.a.q ||
      left.a.r - right.a.r ||
      left.b.q - right.b.q ||
      left.b.r - right.b.r);
    const pair = pairs[0]!;
    const a = hexKey(pair.a.q, pair.a.r);
    const b = hexKey(pair.b.q, pair.b.r);
    addArc(a, b, 1);
    addArc(b, a, 1);
  }

  const nodes: Record<string, MovementNode> = {};
  for (const input of nodeInputs) {
    const arcs = [...arcsByKey.get(input.key)!.entries()]
      .map(([to, cost]) => ({ to, cost }))
      .sort((a, b) => comparePosition(inputByKey.get(a.to)!.position, inputByKey.get(b.to)!.position));
    nodes[input.key] = {
      position: input.position,
      sectorId: input.sectorId,
      arcs,
    };
  }
  return { nodes };
}

/** The rendered sector centroid's nearest member hex, with q/r tie-breaking. */
export function musterHexOf(world: WorldArtifact, sectorId: SectorId): HexPosition {
  const sector = world.sectors[sectorId];
  if (sector === undefined || sector.mapUnits.length === 0) {
    throw new Error(`Sector "${sectorId}" has no authored hex.`);
  }
  const hexR = world.meta.hexR;
  const centres = sector.mapUnits.map((unit) => ({
    position: { q: unit.q, r: unit.r },
    x: hexR * Math.sqrt(3) * (unit.q + unit.r / 2),
    y: hexR * 1.5 * unit.r,
  }));
  const centroid = centres.reduce(
    (sum, centre) => ({ x: sum.x + centre.x, y: sum.y + centre.y }),
    { x: 0, y: 0 },
  );
  centroid.x /= centres.length;
  centroid.y /= centres.length;
  centres.sort((a, b) => {
    const distanceA = (a.x - centroid.x) ** 2 + (a.y - centroid.y) ** 2;
    const distanceB = (b.x - centroid.x) ** 2 + (b.y - centroid.y) ** 2;
    return distanceA - distanceB || comparePosition(a.position, b.position);
  });
  return { ...centres[0]!.position };
}

/** Minimum-cost route, including both the origin and destination. */
export function minimumCostRoute(
  graph: MovementGraph,
  from: HexPosition,
  to: HexPosition,
): readonly HexPosition[] | null {
  const start = hexKey(from.q, from.r);
  const destination = hexKey(to.q, to.r);
  if (graph.nodes[start] === undefined || graph.nodes[destination] === undefined) return null;

  const distances = new Map<string, number>([[start, 0]]);
  const paths = new Map<string, readonly string[]>([[start, [start]]]);
  const queue: QueueEntry[] = [{ key: start, cost: 0, path: [start] }];

  while (queue.length > 0) {
    queue.sort((a, b) => compareQueue(graph, a, b));
    const current = queue.shift()!;
    const bestCost = distances.get(current.key);
    const bestPath = paths.get(current.key);
    if (bestCost !== current.cost || bestPath === undefined || comparePath(graph, current.path, bestPath) !== 0) {
      continue;
    }
    if (current.key === destination) {
      return current.path.map((key) => ({ ...graph.nodes[key]!.position }));
    }

    for (const arc of graph.nodes[current.key]!.arcs) {
      const candidateCost = current.cost + arc.cost;
      const candidatePath = [...current.path, arc.to];
      const knownCost = distances.get(arc.to);
      const knownPath = paths.get(arc.to);
      if (
        knownCost === undefined ||
        candidateCost < knownCost ||
        (candidateCost === knownCost && knownPath !== undefined && comparePath(graph, candidatePath, knownPath) < 0)
      ) {
        distances.set(arc.to, candidateCost);
        paths.set(arc.to, candidatePath);
        queue.push({ key: arc.to, cost: candidateCost, path: candidatePath });
      }
    }
  }

  return null;
}

function routeArc(graph: MovementGraph, from: HexPosition, to: HexPosition): MovementArc {
  const node = graph.nodes[hexKey(from.q, from.r)];
  const arc = node?.arcs.find((candidate) => candidate.to === hexKey(to.q, to.r));
  if (arc === undefined) {
    throw new Error(`Movement order contains a non-authored arc from ${hexKey(from.q, from.r)} to ${hexKey(to.q, to.r)}.`);
  }
  return arc;
}

/** Consume this turn's complete route arcs and carry the untraversed suffix. */
export function advanceOneTurn(
  graph: MovementGraph,
  detachment: Detachment,
): { readonly detachment: Detachment; readonly travelled: number; readonly fatigueAdded: number } {
  const order = detachment.movement;
  if (order === null || order.route.length <= 1) {
    return {
      detachment: order === null ? detachment : { ...detachment, movement: null },
      travelled: 0,
      fatigueAdded: 0,
    };
  }

  const budget = MARCH_SPEED + (order.forcedMarch ? FORCED_MARCH_EXTRA_CAP : 0);
  let spent = 0;
  let travelled = 0;
  let fatigueAdded = 0;
  for (let index = 1; index < order.route.length; index += 1) {
    const arc = routeArc(graph, order.route[index - 1]!, order.route[index]!);
    if (spent + arc.cost > budget) break;
    spent += arc.cost;
    fatigueAdded += travelled < MARCH_SPEED
      ? MARCH_FATIGUE_PER_HEX
      : MARCH_FATIGUE_PER_HEX * FORCED_MARCH_PREMIUM;
    travelled += 1;
  }

  const position = { ...order.route[travelled]! };
  const remainingRoute = order.route.slice(travelled).map((hex) => ({ ...hex }));
  const movement = remainingRoute.length <= 1
    ? null
    : { ...order, route: remainingRoute };
  return {
    detachment: {
      ...detachment,
      position,
      ready: {
        ...detachment.ready,
        fatigue: menOf(detachment.ready.origins) === 0
          ? detachment.ready.fatigue
          : detachment.ready.fatigue + fatigueAdded,
      },
      pending: detachment.pending.map((cohort) => ({
        ...cohort,
        fatigue: cohort.fatigue + fatigueAdded,
      })),
      movement,
    },
    travelled,
    fatigueAdded,
  };
}

/** Cost-bounded reachable hexes, including the start. */
export function reachCone(
  graph: MovementGraph,
  start: HexPosition,
  turns: number,
  speed = MARCH_SPEED,
): ReadonlySet<string> {
  const startKey = hexKey(start.q, start.r);
  if (graph.nodes[startKey] === undefined || turns < 0 || speed < 0) return new Set<string>();
  const budget = turns * speed;
  const distances = new Map<string, number>([[startKey, 0]]);
  const queue: QueueEntry[] = [{ key: startKey, cost: 0, path: [startKey] }];
  while (queue.length > 0) {
    queue.sort((a, b) => compareQueue(graph, a, b));
    const current = queue.shift()!;
    if (distances.get(current.key) !== current.cost) continue;
    for (const arc of graph.nodes[current.key]!.arcs) {
      const cost = current.cost + arc.cost;
      if (cost > budget || (distances.get(arc.to) ?? Infinity) <= cost) continue;
      distances.set(arc.to, cost);
      queue.push({ key: arc.to, cost, path: [] });
    }
  }
  return new Set(distances.keys());
}

/** Shared Runtime/preview refusal rule over actor-owned detachment data. */
export function movementOrderRefusal(
  graph: MovementGraph,
  detachments: readonly PositionedDetachment[],
  detachmentId: unknown,
  destinationHex: unknown,
  forcedMarch: unknown,
): string | null {
  if (typeof detachmentId !== 'string' || detachmentId.length === 0) {
    return 'A movement order must name a detachment.';
  }
  const detachment = detachments.find((candidate) => candidate.id === detachmentId);
  if (detachment === undefined) return `Detachment "${detachmentId}" is not owned by this actor.`;
  if (
    typeof destinationHex !== 'object' || destinationHex === null ||
    typeof (destinationHex as { q?: unknown }).q !== 'number' ||
    typeof (destinationHex as { r?: unknown }).r !== 'number'
  ) {
    return 'A movement order must name a destination hex.';
  }
  if (typeof forcedMarch !== 'boolean') return 'A movement order must choose whether to force the march.';
  const destination = destinationHex as HexPosition;
  if (graph.nodes[hexKey(destination.q, destination.r)] === undefined) {
    return `Destination ${hexKey(destination.q, destination.r)} is outside the authored movement graph.`;
  }
  if (minimumCostRoute(graph, detachment.position, destination) === null) {
    return `Destination ${hexKey(destination.q, destination.r)} is unreachable from this detachment.`;
  }
  return null;
}
