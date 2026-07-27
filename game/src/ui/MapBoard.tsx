/**
 * The board, drawn as SVG.
 *
 * Gate 07 sealed SVG as the renderer, with an upgrade measurement-gated rather
 * than assumed, and sealed a **coupled continuous camera** (wheel to zoom,
 * drag to pan) as the navigation. This is the grey-box realisation of that: the
 * map's job here is to make operation and flow legible, not to be beautiful —
 * visual design is carved out of this map by user ruling and gets layered on
 * while playing.
 *
 * Two boundaries this component keeps:
 *
 *   - it reads **only** the projection it is handed, never a Runtime;
 *   - **camera, hover, and unsubmitted focus are interaction state and live
 *     here**, outside the Runtime. A pan is not a game event, and a sector the
 *     player is merely considering has not been chosen.
 */

import { useCallback, useMemo, useRef, useState } from 'react';
import type { MatchView } from '../runtime/types.js';
import type { SectorId } from '../world/schema.js';
import {
  boardBounds,
  CHOKE_STYLE,
  hexCenter,
  hexPolygon,
  ownerOf,
  realmBorderSegments,
  sectorCenter,
  TERRAIN_TINT,
} from '../renderer/index.js';

// Warm versus cool, so the two sides read apart at a glance and at any zoom.
// The wash stays light on purpose: terrain already carries colour, and a heavy
// tint would drown the thing the map is actually for. The hard boundary line
// does the work of saying whose ground this is.
const REALM_STROKE = ['#f0cf85', '#7fc0f0'] as const;
const REALM_WASH = ['rgba(240,207,133,0.14)', 'rgba(127,192,240,0.14)'] as const;

/** SVG needs map precision, not floating-point serialization noise. */
const svgCoordinate = (value: number): number => Number(value.toFixed(2));

interface Props {
  readonly view: MatchView;
  /** Sectors the viewer may currently act on. Empty outside a choice. */
  readonly selectable?: readonly SectorId[];
  readonly focused?: SectorId | null;
  readonly onFocus?: (sector: SectorId | null) => void;
  readonly onPick?: (sector: SectorId) => void;
}

export function MapBoard({ view, selectable = [], focused = null, onFocus, onPick }: Props) {
  const bounds = useMemo(() => boardBounds(view), [view.board]);
  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;

  // --- camera: interaction state, outside the Runtime ------------------------
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState<SectorId | null>(null);
  const dragging = useRef<{ x: number; y: number } | null>(null);

  const onWheel = useCallback((e: React.WheelEvent) => {
    // Continuous, not stepped — the seal calls the camera coupled and continuous.
    setZoom((z) => Math.min(6, Math.max(0.5, z * Math.exp(-e.deltaY / 600))));
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = { x: e.clientX, y: e.clientY };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const from = dragging.current;
      if (!from) return;
      const scale = width / (e.currentTarget as Element).clientWidth / zoom;
      setPan((p) => ({ x: p.x - (e.clientX - from.x) * scale, y: p.y - (e.clientY - from.y) * scale }));
      dragging.current = { x: e.clientX, y: e.clientY };
    },
    [width, zoom],
  );

  const endDrag = useCallback(() => {
    dragging.current = null;
  }, []);

  const viewBox = useMemo(() => {
    const w = width / zoom;
    const h = height / zoom;
    const cx = bounds.minX + width / 2 + pan.x;
    const cy = bounds.minY + height / 2 + pan.y;
    return `${cx - w / 2} ${cy - h / 2} ${w} ${h}`;
  }, [bounds, width, height, zoom, pan]);

  const hexR = view.board.meta.hexR;
  const realmIndex = new Map(view.realms.map((r, i) => [r.actor, i]));
  const selectableSet = new Set(selectable);
  const capitalSectors = new Map(Object.entries(view.capitals).map(([actor, s]) => [s, actor]));
  const borders = useMemo(() => realmBorderSegments(view), [view]);

  return (
    <svg
      className="board"
      viewBox={viewBox}
      role="img"
      aria-label="Match board"
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={() => {
        endDrag();
        setHovered(null);
      }}
    >
      <g data-testid="sectors">
        {Object.values(view.board.sectors).map((sector) => {
          const owner = ownerOf(view, sector.id);
          const side = owner === null ? -1 : (realmIndex.get(owner) ?? -1);
          const isSelectable = selectableSet.has(sector.id);
          const isFocused = focused === sector.id || hovered === sector.id;

          return (
            <g
              key={sector.id}
              data-sector={sector.id}
              data-region={sector.regionId}
              data-owner={owner ?? 'none'}
              className={`sector${isSelectable ? ' selectable' : ''}${isFocused ? ' focused' : ''}`}
              onPointerEnter={() => {
                setHovered(sector.id);
                onFocus?.(sector.id);
              }}
              onClick={() => {
                if (isSelectable) onPick?.(sector.id);
              }}
            >
              {sector.mapUnits.map((unit) => (
                <polygon
                  key={`${unit.q},${unit.r}`}
                  points={hexPolygon(unit, hexR)}
                  fill={TERRAIN_TINT[unit.terrainLayer]}
                  stroke="rgba(0,0,0,0.25)"
                  strokeWidth={0.5}
                />
              ))}
              {side >= 0 && (
                <g className="realm-wash">
                  {sector.mapUnits.map((unit) => (
                    <polygon
                      key={`w-${unit.q},${unit.r}`}
                      points={hexPolygon(unit, hexR)}
                      fill={REALM_WASH[side] ?? 'none'}
                      stroke="none"
                    />
                  ))}
                </g>
              )}
            </g>
          );
        })}
      </g>

      {/* Realm outlines — the answer to "which of these is mine?". */}
      <g data-testid="realm-borders" pointerEvents="none">
        {borders.map((seg, i) => (
          <line
            key={i}
            x1={seg.x1}
            y1={seg.y1}
            x2={seg.x2}
            y2={seg.y2}
            stroke={REALM_STROKE[realmIndex.get(seg.actor) ?? 0]}
            strokeWidth={3}
            strokeLinecap="round"
            data-realm={seg.actor}
          />
        ))}
      </g>

      {/* Routes: the authored borders, styled by what it costs to cross them. */}
      <g data-testid="routes">
        {view.board.edges.map((edge) => {
          const a = sectorCenter(view, edge.a);
          const b = sectorCenter(view, edge.b);
          const style = CHOKE_STYLE[edge.choke.class] ?? CHOKE_STYLE.open!;
          return (
            <line
              key={`${edge.a}|${edge.b}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="#e8e6e1"
              strokeOpacity={0.55}
              strokeWidth={style.width}
              strokeDasharray={style.dash || undefined}
              data-choke={edge.choke.class}
            />
          );
        })}
      </g>

      {/* Own formations only: opposing positions never enter this projection. */}
      <g data-testid="detachment-markers" pointerEvents="none">
        {view.detachments.map((detachment) => {
          const current = hexCenter(detachment.position, hexR);
          const destination = detachment.destination === null
            ? null
            : hexCenter(detachment.destination, hexR);
          return (
            <g key={detachment.id} data-detachment={detachment.id}>
              {destination !== null ? (
                <line
                  className="detachment-route"
                  x1={svgCoordinate(current.x)}
                  y1={svgCoordinate(current.y)}
                  x2={svgCoordinate(destination.x)}
                  y2={svgCoordinate(destination.y)}
                />
              ) : null}
              <circle
                className="detachment-marker"
                cx={svgCoordinate(current.x)}
                cy={svgCoordinate(current.y)}
                r={svgCoordinate(hexR * 0.32)}
              />
            </g>
          );
        })}
      </g>

      {/* Capitals, once this viewer may see them. */}
      <g data-testid="capitals">
        {[...capitalSectors].map(([sectorId, actor]) => {
          const c = sectorCenter(view, sectorId);
          const side = realmIndex.get(actor) ?? 0;
          return (
            <g key={sectorId} data-capital={actor}>
              <circle cx={c.x} cy={c.y} r={hexR * 0.55} fill="none" stroke={REALM_STROKE[side] ?? '#fff'} strokeWidth={3} />
              <circle cx={c.x} cy={c.y} r={hexR * 0.2} fill={REALM_STROKE[side] ?? '#fff'} />
            </g>
          );
        })}
      </g>

      <g data-testid="region-labels" pointerEvents="none">
        {view.board.regions.map((region) => {
          const center = view.board.meta.regionCenters[region.id];
          if (!center) return null;
          return (
            <text key={region.id} x={center.x} y={center.y} className="region-label">
              {region.name}
            </text>
          );
        })}
      </g>
    </svg>
  );
}
