/**
 * Map geometry — pure, and computed from a projection.
 *
 * The rule that governs this layer is a boundary, not a style: a renderer
 * **consumes viewer-safe projection data only**. Everything here takes a
 * `MatchView` and returns numbers; it can no more reach truth than the player
 * can, which is what makes it safe to test in isolation and to hand to a browser.
 *
 * The hex layout is **frozen** (terrain-cradle TC-⑪): orientation and resolution
 * are seed-reauthoring tier. The projection below is pointy-top axial, matching
 * the generator that authored the hexes — if these two ever disagree, the map
 * renders as a torn sheet, so the agreement is asserted in a test rather than
 * assumed.
 */

import { hexKey, HEX_NEIGHBOURS } from '../world/schema.js';
import type { MatchView } from '../runtime/types.js';
import type { MapUnit, SectorId, TerrainLayer } from '../world/schema.js';

export interface Point {
  readonly x: number;
  readonly y: number;
}

export interface Bounds {
  readonly minX: number;
  readonly minY: number;
  readonly maxX: number;
  readonly maxY: number;
}

/**
 * Axial hex centre, pointy-top. Must match the authoring generator exactly:
 * `x = R·√3·(q + r/2)`, `y = R·1.5·r`.
 */
export function hexCenter(unit: Pick<MapUnit, 'q' | 'r'>, hexR: number): Point {
  return {
    x: hexR * Math.sqrt(3) * (unit.q + unit.r / 2),
    y: hexR * 1.5 * unit.r,
  };
}

/** The six corners of a pointy-top hex, starting at the upper-right shoulder. */
export function hexCorners(center: Point, hexR: number): readonly Point[] {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i - 30);
    return {
      x: center.x + hexR * Math.cos(angle),
      y: center.y + hexR * Math.sin(angle),
    };
  });
}

/** An SVG `points` attribute for one hex. */
export function hexPolygon(unit: Pick<MapUnit, 'q' | 'r'>, hexR: number): string {
  return hexCorners(hexCenter(unit, hexR), hexR)
    .map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(' ');
}

/** Centroid of a sector's hexes — where its label and its route ends sit. */
export function sectorCenter(view: MatchView, sectorId: SectorId): Point {
  const sector = view.board.sectors[sectorId];
  if (!sector || sector.mapUnits.length === 0) return { x: 0, y: 0 };

  let x = 0;
  let y = 0;
  for (const unit of sector.mapUnits) {
    const c = hexCenter(unit, view.board.meta.hexR);
    x += c.x;
    y += c.y;
  }
  return { x: x / sector.mapUnits.length, y: y / sector.mapUnits.length };
}

/** The drawing extent, with a margin so hex corners and labels are not clipped. */
export function boardBounds(view: MatchView, margin = 40): Bounds {
  const hexR = view.board.meta.hexR;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const sector of Object.values(view.board.sectors)) {
    for (const unit of sector.mapUnits) {
      const c = hexCenter(unit, hexR);
      minX = Math.min(minX, c.x - hexR);
      minY = Math.min(minY, c.y - hexR);
      maxX = Math.max(maxX, c.x + hexR);
      maxY = Math.max(maxY, c.y + hexR);
    }
  }

  if (!Number.isFinite(minX)) return { minX: 0, minY: 0, maxX: 1, maxY: 1 };
  return { minX: minX - margin, minY: minY - margin, maxX: maxX + margin, maxY: maxY + margin };
}

/** Which actor holds a sector, or `null` where no one does. */
export function ownerOf(view: MatchView, sectorId: SectorId): string | null {
  for (const realm of view.realms) {
    if (realm.sectors.includes(sectorId)) return realm.actor;
  }
  return null;
}

/** One drawable hex edge on a realm's outer boundary. */
export interface BorderSegment {
  readonly actor: string;
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
}

/** How far a realm's outline sits inside its own hex, as a fraction of the radius. */
const BORDER_INSET = 0.1;

/**
 * Which hex edge faces which neighbour direction, by index into `hexCorners`.
 *
 * The mapping is translation- and scale-invariant, so it is solved once against
 * a unit hex at the origin rather than re-searched for every hex on every frame.
 * Solved rather than hand-written: if the corner order in `hexCorners` ever
 * changes, this follows it instead of silently pointing at the wrong edge.
 */
const EDGE_FOR_DIRECTION: readonly number[] = (() => {
  const center = { x: 0, y: 0 };
  const corners = hexCorners(center, 1);
  return HEX_NEIGHBOURS.map(([dq, dr]) => {
    const toward = hexCenter({ q: dq, r: dr }, 1);
    const target = { x: toward.x / 2, y: toward.y / 2 };

    let best = 0;
    let bestDistance = Infinity;
    for (let i = 0; i < 6; i++) {
      const a = corners[i]!;
      const b = corners[(i + 1) % 6]!;
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const distance = (mid.x - target.x) ** 2 + (mid.y - target.y) ** 2;
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    }
    return best;
  });
})();

/**
 * The outline of each realm's territory: every hex edge whose far side is held
 * by someone else, or by no one.
 *
 * This exists because a wash alone does not answer the question the board is
 * being asked at setup — *which of these is mine?* Terrain already carries
 * colour, so tinting territory competes with it; a hard boundary line does not.
 *
 * Derived per hex edge rather than per sector, so an enclave or a salient draws
 * correctly instead of as a bounding box.
 */
export function realmBorderSegments(view: MatchView): readonly BorderSegment[] {
  const hexR = view.board.meta.hexR;

  const ownerByHex = new Map<string, string>();
  for (const realm of view.realms) {
    for (const sectorId of realm.sectors) {
      const sector = view.board.sectors[sectorId];
      if (!sector) continue;
      for (const unit of sector.mapUnits) ownerByHex.set(hexKey(unit.q, unit.r), realm.actor);
    }
  }

  const segments: BorderSegment[] = [];
  for (const realm of view.realms) {
    for (const sectorId of realm.sectors) {
      const sector = view.board.sectors[sectorId];
      if (!sector) continue;

      for (const unit of sector.mapUnits) {
        const center = hexCenter(unit, hexR);
        const corners = hexCorners(center, hexR);

        HEX_NEIGHBOURS.forEach(([dq, dr], direction) => {
          if (ownerByHex.get(hexKey(unit.q + dq, unit.r + dr)) === realm.actor) return;

          const best = EDGE_FOR_DIRECTION[direction]!;

          // Inset toward this hex's own centre. Two realms meeting along a
          // border draw the *same* hex edge, so without an inset one colour
          // simply paints over the other and the line stops telling the player
          // which side is theirs. Hugging its own ground makes a contested
          // border read as two lines — which is also what it is.
          const inset = (p: Point): Point => ({
            x: p.x + (center.x - p.x) * BORDER_INSET,
            y: p.y + (center.y - p.y) * BORDER_INSET,
          });

          const a = inset(corners[best]!);
          const b = inset(corners[(best + 1) % 6]!);
          segments.push({ actor: realm.actor, x1: a.x, y1: a.y, x2: b.x, y2: b.y });
        });
      }
    }
  }

  return segments;
}

/**
 * Terrain tint. Grey-box on purpose: this map's job is to make operation and
 * flow legible, and visual design is carved out of it by user ruling. What the
 * palette owes is that a player can tell a mountain from a plain at a glance.
 */
export const TERRAIN_TINT: Readonly<Record<TerrainLayer, string>> = Object.freeze({
  plains: '#5d6b4a',
  steppe: '#7a7448',
  highland: '#6b5f4a',
  desert: '#8a7a55',
  oasis: '#4a6b5d',
  mountain: '#5a5550',
  'river-valley': '#4a5f6b',
});

/** Route styling by choke class. An open border is drawn as no barrier at all. */
export const CHOKE_STYLE: Readonly<Record<string, { readonly dash: string; readonly width: number }>> =
  Object.freeze({
    open: { dash: '', width: 2 },
    pass: { dash: '6 4', width: 3 },
    river: { dash: '2 3', width: 3 },
    forest: { dash: '8 3', width: 3 },
    hills: { dash: '5 5', width: 3 },
    strait: { dash: '1 6', width: 2 },
  });
