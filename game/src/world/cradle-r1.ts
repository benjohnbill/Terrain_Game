/**
 * GENERATED — do not edit by hand.
 *
 * Baked by `game/tools/bake-world.js` from the terrain-cradle generator
 * (`mockup/combat-calc/map-gen.js`, C-loop iteration 2 — the authoritative map
 * source, per terrain-cradle RULINGS and INDEX and capital INDEX). The generator
 * is a workshop tool; gate 06 D1 bakes its **output** here so that world
 * identity is frozen content rather than a per-boot computation.
 *
 * Editing this file by hand breaks the content-integrity stamp and the loader
 * will refuse it (gate 06 D5 tier 1). To change the world, change the generator
 * or the authoring inputs, bump `revision`, and re-bake.
 *
 * This revision: 10 regions · 56 sectors ·
 * 17 edges (5 of them open, carrying a native
 * `Infinity` cap) · 292 hexes.
 */

import type { WorldArtifact } from './schema.js';

export const CRADLE_R1: WorldArtifact = {
  schemaVersion: 1,
  worldId: "terrain-cradle",
  revision: "r1",
  regions: [
    {
      id: "r1",
      name: "중원",
      sizeClass: "plains",
      sectorIds: ["r1_s0", "r1_s1", "r1_s2", "r1_s3"]
    },
    {
      id: "r2",
      name: "하북",
      sizeClass: "plains",
      sectorIds: ["r2_s0", "r2_s1", "r2_s2", "r2_s3", "r2_s4"]
    },
    {
      id: "r3",
      name: "초원",
      sizeClass: "steppe",
      sectorIds: ["r3_s0", "r3_s1", "r3_s2", "r3_s3", "r3_s4", "r3_s5", "r3_s6", "r3_s7"]
    },
    {
      id: "r4",
      name: "동북",
      sizeClass: "steppe",
      sectorIds: ["r4_s0", "r4_s1", "r4_s2", "r4_s3", "r4_s4", "r4_s5"]
    },
    {
      id: "r5",
      name: "서역",
      sizeClass: "desert",
      sectorIds: ["r5_s0", "r5_s1", "r5_s2", "r5_s3", "r5_s4", "r5_s5", "r5_s6", "r5_s7", "r5_s8", "r5_s9"]
    },
    {
      id: "r6",
      name: "관중",
      sizeClass: "mountain",
      sectorIds: ["r6_s0", "r6_s1", "r6_s2", "r6_s3", "r6_s4", "r6_s5"]
    },
    {
      id: "r7",
      name: "한경",
      sizeClass: "river-valley",
      sectorIds: ["r7_s0", "r7_s1", "r7_s2", "r7_s3", "r7_s4"]
    },
    {
      id: "r8",
      name: "촉",
      sizeClass: "plains",
      sectorIds: ["r8_s0", "r8_s1", "r8_s2"]
    },
    {
      id: "r9",
      name: "강남",
      sizeClass: "plains",
      sectorIds: ["r9_s0", "r9_s1", "r9_s2", "r9_s3", "r9_s4"]
    },
    {
      id: "r10",
      name: "동남해",
      sizeClass: "plains",
      sectorIds: ["r10_s0", "r10_s1", "r10_s2", "r10_s3"]
    }
  ],
  sectors: {
    r1_s0: {
      id: "r1_s0",
      regionId: "r1",
      economyValue: 1.7,
      populationValue: 1.3333333333333333,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 6, r: 13, terrainLayer: "plains" },
        { q: 7, r: 13, terrainLayer: "plains" },
        { q: 7, r: 12, terrainLayer: "plains" },
        { q: 8, r: 11, terrainLayer: "plains" },
        { q: 9, r: 10, terrainLayer: "plains" }
      ]
    },
    r1_s1: {
      id: "r1_s1",
      regionId: "r1",
      economyValue: 1.7,
      populationValue: 1.3333333333333333,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 9, r: 14, terrainLayer: "plains" },
        { q: 8, r: 14, terrainLayer: "plains" },
        { q: 10, r: 13, terrainLayer: "plains" },
        { q: 9, r: 13, terrainLayer: "plains" },
        { q: 8, r: 13, terrainLayer: "plains" }
      ]
    },
    r1_s2: {
      id: "r1_s2",
      regionId: "r1",
      economyValue: 1.7,
      populationValue: 1.3333333333333333,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 11, r: 12, terrainLayer: "plains" },
        { q: 11, r: 11, terrainLayer: "plains" },
        { q: 10, r: 11, terrainLayer: "plains" },
        { q: 10, r: 10, terrainLayer: "plains" }
      ]
    },
    r1_s3: {
      id: "r1_s3",
      regionId: "r1",
      economyValue: 2.4,
      populationValue: 2,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 9, r: 11, terrainLayer: "plains" },
        { q: 9, r: 12, terrainLayer: "plains" },
        { q: 8, r: 12, terrainLayer: "plains" },
        { q: 10, r: 12, terrainLayer: "plains" }
      ]
    },
    r2_s0: {
      id: "r2_s0",
      regionId: "r2",
      economyValue: 1.15,
      populationValue: 1,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 10, r: 3, terrainLayer: "plains" },
        { q: 9, r: 4, terrainLayer: "plains" },
        { q: 9, r: 5, terrainLayer: "plains" },
        { q: 9, r: 6, terrainLayer: "plains" },
        { q: 8, r: 7, terrainLayer: "plains" }
      ]
    },
    r2_s1: {
      id: "r2_s1",
      regionId: "r2",
      economyValue: 1.15,
      populationValue: 1,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 4, r: 10, terrainLayer: "plains" },
        { q: 5, r: 10, terrainLayer: "plains" },
        { q: 5, r: 9, terrainLayer: "plains" },
        { q: 5, r: 8, terrainLayer: "plains" },
        { q: 6, r: 9, terrainLayer: "plains" }
      ]
    },
    r2_s2: {
      id: "r2_s2",
      regionId: "r2",
      economyValue: 1.15,
      populationValue: 1,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 6, r: 8, terrainLayer: "plains" },
        { q: 7, r: 8, terrainLayer: "plains" },
        { q: 7, r: 9, terrainLayer: "plains" },
        { q: 6, r: 10, terrainLayer: "plains" }
      ]
    },
    r2_s3: {
      id: "r2_s3",
      regionId: "r2",
      economyValue: 2.3,
      populationValue: 2,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 7, r: 11, terrainLayer: "plains" },
        { q: 7, r: 10, terrainLayer: "plains" },
        { q: 8, r: 10, terrainLayer: "plains" },
        { q: 6, r: 11, terrainLayer: "plains" },
        { q: 9, r: 9, terrainLayer: "plains" }
      ]
    },
    r2_s4: {
      id: "r2_s4",
      regionId: "r2",
      economyValue: 1.15,
      populationValue: 1,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 10, r: 7, terrainLayer: "plains" },
        { q: 9, r: 7, terrainLayer: "plains" },
        { q: 9, r: 8, terrainLayer: "plains" },
        { q: 8, r: 9, terrainLayer: "plains" },
        { q: 8, r: 8, terrainLayer: "plains" }
      ]
    },
    r3_s0: {
      id: "r3_s0",
      regionId: "r3",
      economyValue: 0.59,
      populationValue: 0.75,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 18, r: 2, terrainLayer: "steppe" },
        { q: 17, r: 2, terrainLayer: "steppe" },
        { q: 17, r: 3, terrainLayer: "steppe" },
        { q: 16, r: 3, terrainLayer: "steppe" },
        { q: 17, r: 1, terrainLayer: "steppe" }
      ]
    },
    r3_s1: {
      id: "r3_s1",
      regionId: "r3",
      economyValue: 0.59,
      populationValue: 0.75,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 10, r: 2, terrainLayer: "steppe" },
        { q: 11, r: 2, terrainLayer: "steppe" },
        { q: 11, r: 3, terrainLayer: "steppe" },
        { q: 12, r: 1, terrainLayer: "steppe" },
        { q: 12, r: 2, terrainLayer: "steppe" }
      ]
    },
    r3_s2: {
      id: "r3_s2",
      regionId: "r3",
      economyValue: 0.59,
      populationValue: 0.75,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 16, r: 0, terrainLayer: "steppe" },
        { q: 16, r: 1, terrainLayer: "steppe" },
        { q: 15, r: 1, terrainLayer: "steppe" },
        { q: 16, r: 2, terrainLayer: "steppe" },
        { q: 15, r: 0, terrainLayer: "steppe" },
        { q: 14, r: 2, terrainLayer: "steppe" },
        { q: 15, r: 2, terrainLayer: "steppe" }
      ]
    },
    r3_s3: {
      id: "r3_s3",
      regionId: "r3",
      economyValue: 0.59,
      populationValue: 0.75,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 14, r: 0, terrainLayer: "steppe" },
        { q: 13, r: 1, terrainLayer: "steppe" },
        { q: 14, r: 1, terrainLayer: "steppe" },
        { q: 13, r: 2, terrainLayer: "steppe" },
        { q: 12, r: 3, terrainLayer: "steppe" },
        { q: 13, r: 3, terrainLayer: "steppe" }
      ]
    },
    r3_s4: {
      id: "r3_s4",
      regionId: "r3",
      economyValue: 0.59,
      populationValue: 0.75,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 16, r: 4, terrainLayer: "steppe" },
        { q: 15, r: 5, terrainLayer: "steppe" },
        { q: 15, r: 4, terrainLayer: "steppe" },
        { q: 14, r: 5, terrainLayer: "steppe" },
        { q: 15, r: 3, terrainLayer: "steppe" },
        { q: 14, r: 6, terrainLayer: "steppe" },
        { q: 14, r: 3, terrainLayer: "steppe" }
      ]
    },
    r3_s5: {
      id: "r3_s5",
      regionId: "r3",
      economyValue: 0.59,
      populationValue: 0.75,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 10, r: 4, terrainLayer: "steppe" },
        { q: 11, r: 4, terrainLayer: "steppe" },
        { q: 10, r: 5, terrainLayer: "steppe" },
        { q: 12, r: 4, terrainLayer: "steppe" },
        { q: 10, r: 6, terrainLayer: "steppe" }
      ]
    },
    r3_s6: {
      id: "r3_s6",
      regionId: "r3",
      economyValue: 0.59,
      populationValue: 0.75,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 13, r: 5, terrainLayer: "steppe" },
        { q: 12, r: 5, terrainLayer: "steppe" },
        { q: 14, r: 4, terrainLayer: "steppe" },
        { q: 13, r: 4, terrainLayer: "steppe" },
        { q: 11, r: 5, terrainLayer: "steppe" }
      ]
    },
    r3_s7: {
      id: "r3_s7",
      regionId: "r3",
      economyValue: 2.4,
      populationValue: 0.75,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 11, r: 6, terrainLayer: "steppe" },
        { q: 12, r: 6, terrainLayer: "steppe" },
        { q: 13, r: 6, terrainLayer: "steppe" }
      ]
    },
    r4_s0: {
      id: "r4_s0",
      regionId: "r4",
      economyValue: 0.82,
      populationValue: 0.9,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 22, r: 6, terrainLayer: "highland" },
        { q: 23, r: 4, terrainLayer: "highland" },
        { q: 22, r: 5, terrainLayer: "highland" },
        { q: 21, r: 6, terrainLayer: "highland" },
        { q: 22, r: 4, terrainLayer: "highland" },
        { q: 21, r: 5, terrainLayer: "highland" }
      ]
    },
    r4_s1: {
      id: "r4_s1",
      regionId: "r4",
      economyValue: 0.82,
      populationValue: 0.9,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 16, r: 5, terrainLayer: "highland" },
        { q: 17, r: 5, terrainLayer: "highland" },
        { q: 17, r: 4, terrainLayer: "highland" },
        { q: 17, r: 6, terrainLayer: "highland" },
        { q: 18, r: 4, terrainLayer: "highland" },
        { q: 18, r: 5, terrainLayer: "highland" },
        { q: 18, r: 3, terrainLayer: "highland" }
      ]
    },
    r4_s2: {
      id: "r4_s2",
      regionId: "r4",
      economyValue: 1.5,
      populationValue: 1.5,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 21, r: 7, terrainLayer: "highland" },
        { q: 20, r: 7, terrainLayer: "highland" },
        { q: 19, r: 8, terrainLayer: "highland" },
        { q: 19, r: 7, terrainLayer: "highland" },
        { q: 20, r: 6, terrainLayer: "highland" },
        { q: 18, r: 8, terrainLayer: "highland" }
      ]
    },
    r4_s3: {
      id: "r4_s3",
      regionId: "r4",
      economyValue: 0.82,
      populationValue: 0.9,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 22, r: 3, terrainLayer: "highland" },
        { q: 21, r: 4, terrainLayer: "highland" },
        { q: 21, r: 3, terrainLayer: "highland" },
        { q: 20, r: 4, terrainLayer: "highland" }
      ]
    },
    r4_s4: {
      id: "r4_s4",
      regionId: "r4",
      economyValue: 0.82,
      populationValue: 0.9,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 21, r: 2, terrainLayer: "highland" },
        { q: 20, r: 3, terrainLayer: "highland" },
        { q: 19, r: 3, terrainLayer: "highland" },
        { q: 19, r: 4, terrainLayer: "highland" },
        { q: 19, r: 5, terrainLayer: "highland" }
      ]
    },
    r4_s5: {
      id: "r4_s5",
      regionId: "r4",
      economyValue: 0.82,
      populationValue: 0.9,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 17, r: 8, terrainLayer: "highland" },
        { q: 18, r: 7, terrainLayer: "highland" },
        { q: 17, r: 7, terrainLayer: "highland" },
        { q: 18, r: 6, terrainLayer: "highland" },
        { q: 19, r: 6, terrainLayer: "highland" },
        { q: 20, r: 5, terrainLayer: "highland" }
      ]
    },
    r5_s0: {
      id: "r5_s0",
      regionId: "r5",
      economyValue: 0.27,
      populationValue: 0.5,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: -3, r: 8, terrainLayer: "desert" },
        { q: -4, r: 10, terrainLayer: "desert" },
        { q: -3, r: 9, terrainLayer: "desert" },
        { q: -2, r: 8, terrainLayer: "desert" },
        { q: -3, r: 10, terrainLayer: "desert" },
        { q: -2, r: 7, terrainLayer: "desert" }
      ]
    },
    r5_s1: {
      id: "r5_s1",
      regionId: "r5",
      economyValue: 0.27,
      populationValue: 0.5,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: -3, r: 11, terrainLayer: "desert" },
        { q: -2, r: 10, terrainLayer: "desert" },
        { q: -2, r: 11, terrainLayer: "desert" },
        { q: -2, r: 9, terrainLayer: "desert" }
      ]
    },
    r5_s2: {
      id: "r5_s2",
      regionId: "r5",
      economyValue: 2.4,
      populationValue: 1.5,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 1, r: 5, terrainLayer: "oasis" },
        { q: -1, r: 6, terrainLayer: "oasis" },
        { q: 0, r: 6, terrainLayer: "oasis" },
        { q: -1, r: 7, terrainLayer: "oasis" },
        { q: 1, r: 6, terrainLayer: "oasis" }
      ]
    },
    r5_s3: {
      id: "r5_s3",
      regionId: "r5",
      economyValue: 0.27,
      populationValue: 0.5,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 3, r: 4, terrainLayer: "desert" },
        { q: 2, r: 5, terrainLayer: "desert" },
        { q: 3, r: 5, terrainLayer: "desert" },
        { q: 2, r: 6, terrainLayer: "desert" }
      ]
    },
    r5_s4: {
      id: "r5_s4",
      regionId: "r5",
      economyValue: 0.27,
      populationValue: 0.5,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 1, r: 12, terrainLayer: "desert" },
        { q: 0, r: 12, terrainLayer: "desert" },
        { q: 1, r: 11, terrainLayer: "desert" },
        { q: 0, r: 11, terrainLayer: "desert" },
        { q: 2, r: 10, terrainLayer: "desert" },
        { q: 1, r: 10, terrainLayer: "desert" }
      ]
    },
    r5_s5: {
      id: "r5_s5",
      regionId: "r5",
      economyValue: 0.27,
      populationValue: 0.5,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 5, r: 5, terrainLayer: "desert" },
        { q: 5, r: 6, terrainLayer: "desert" },
        { q: 4, r: 6, terrainLayer: "desert" },
        { q: 4, r: 5, terrainLayer: "desert" },
        { q: 3, r: 6, terrainLayer: "desert" },
        { q: 4, r: 7, terrainLayer: "desert" }
      ]
    },
    r5_s6: {
      id: "r5_s6",
      regionId: "r5",
      economyValue: 0.27,
      populationValue: 0.5,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 5, r: 7, terrainLayer: "desert" },
        { q: 4, r: 8, terrainLayer: "desert" },
        { q: 3, r: 8, terrainLayer: "desert" },
        { q: 3, r: 9, terrainLayer: "desert" },
        { q: 3, r: 7, terrainLayer: "desert" },
        { q: 2, r: 7, terrainLayer: "desert" },
        { q: 2, r: 8, terrainLayer: "desert" }
      ]
    },
    r5_s7: {
      id: "r5_s7",
      regionId: "r5",
      economyValue: 0.27,
      populationValue: 0.5,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: -2, r: 12, terrainLayer: "desert" },
        { q: -1, r: 12, terrainLayer: "desert" },
        { q: -1, r: 11, terrainLayer: "desert" },
        { q: -1, r: 10, terrainLayer: "desert" },
        { q: 0, r: 10, terrainLayer: "desert" },
        { q: -1, r: 9, terrainLayer: "desert" }
      ]
    },
    r5_s8: {
      id: "r5_s8",
      regionId: "r5",
      economyValue: 0.27,
      populationValue: 0.5,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 3, r: 10, terrainLayer: "desert" },
        { q: 4, r: 9, terrainLayer: "desert" },
        { q: 2, r: 11, terrainLayer: "desert" }
      ]
    },
    r5_s9: {
      id: "r5_s9",
      regionId: "r5",
      economyValue: 0.27,
      populationValue: 0.5,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: -1, r: 8, terrainLayer: "desert" },
        { q: 0, r: 7, terrainLayer: "desert" },
        { q: 0, r: 8, terrainLayer: "desert" },
        { q: 0, r: 9, terrainLayer: "desert" },
        { q: 1, r: 7, terrainLayer: "desert" },
        { q: 1, r: 8, terrainLayer: "desert" },
        { q: 1, r: 9, terrainLayer: "desert" },
        { q: 2, r: 9, terrainLayer: "desert" }
      ]
    },
    r6_s0: {
      id: "r6_s0",
      regionId: "r6",
      economyValue: 0.5,
      populationValue: 0.5,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 0, r: 13, terrainLayer: "mountain" },
        { q: 1, r: 13, terrainLayer: "mountain" },
        { q: 1, r: 14, terrainLayer: "mountain" },
        { q: 2, r: 13, terrainLayer: "mountain" },
        { q: 2, r: 14, terrainLayer: "mountain" }
      ]
    },
    r6_s1: {
      id: "r6_s1",
      regionId: "r6",
      economyValue: 1.02,
      populationValue: 0.9666666666666667,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 1, r: 16, terrainLayer: "plains" },
        { q: 1, r: 17, terrainLayer: "plains" },
        { q: 1, r: 15, terrainLayer: "plains" },
        { q: 2, r: 15, terrainLayer: "plains" }
      ]
    },
    r6_s2: {
      id: "r6_s2",
      regionId: "r6",
      economyValue: 1.02,
      populationValue: 0.9666666666666667,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 2, r: 17, terrainLayer: "plains" },
        { q: 3, r: 16, terrainLayer: "plains" },
        { q: 3, r: 15, terrainLayer: "plains" },
        { q: 4, r: 15, terrainLayer: "plains" },
        { q: 2, r: 16, terrainLayer: "plains" },
        { q: 3, r: 14, terrainLayer: "plains" }
      ]
    },
    r6_s3: {
      id: "r6_s3",
      regionId: "r6",
      economyValue: 0.5,
      populationValue: 0.5,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 3, r: 11, terrainLayer: "mountain" },
        { q: 3, r: 12, terrainLayer: "mountain" },
        { q: 4, r: 11, terrainLayer: "mountain" },
        { q: 3, r: 13, terrainLayer: "mountain" },
        { q: 2, r: 12, terrainLayer: "mountain" },
        { q: 5, r: 11, terrainLayer: "mountain" }
      ]
    },
    r6_s4: {
      id: "r6_s4",
      regionId: "r6",
      economyValue: 1.02,
      populationValue: 0.9666666666666667,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 0, r: 15, terrainLayer: "plains" },
        { q: 0, r: 14, terrainLayer: "plains" },
        { q: 0, r: 16, terrainLayer: "plains" }
      ]
    },
    r6_s5: {
      id: "r6_s5",
      regionId: "r6",
      economyValue: 2.3,
      populationValue: 2.1,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 6, r: 12, terrainLayer: "mountain" },
        { q: 5, r: 13, terrainLayer: "mountain" },
        { q: 5, r: 12, terrainLayer: "mountain" },
        { q: 4, r: 13, terrainLayer: "mountain" },
        { q: 5, r: 14, terrainLayer: "mountain" },
        { q: 4, r: 14, terrainLayer: "mountain" },
        { q: 4, r: 12, terrainLayer: "mountain" }
      ]
    },
    r7_s0: {
      id: "r7_s0",
      regionId: "r7",
      economyValue: 1.15,
      populationValue: 1,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 16, r: 6, terrainLayer: "river-valley" },
        { q: 15, r: 6, terrainLayer: "river-valley" },
        { q: 15, r: 7, terrainLayer: "river-valley" },
        { q: 16, r: 7, terrainLayer: "river-valley" },
        { q: 15, r: 8, terrainLayer: "river-valley" },
        { q: 14, r: 7, terrainLayer: "river-valley" }
      ]
    },
    r7_s1: {
      id: "r7_s1",
      regionId: "r7",
      economyValue: 1.15,
      populationValue: 1,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 16, r: 9, terrainLayer: "river-valley" },
        { q: 15, r: 9, terrainLayer: "river-valley" },
        { q: 15, r: 10, terrainLayer: "river-valley" },
        { q: 16, r: 8, terrainLayer: "river-valley" },
        { q: 14, r: 10, terrainLayer: "river-valley" }
      ]
    },
    r7_s2: {
      id: "r7_s2",
      regionId: "r7",
      economyValue: 1.15,
      populationValue: 1,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 12, r: 7, terrainLayer: "river-valley" },
        { q: 13, r: 7, terrainLayer: "river-valley" },
        { q: 12, r: 8, terrainLayer: "river-valley" },
        { q: 13, r: 8, terrainLayer: "river-valley" },
        { q: 14, r: 8, terrainLayer: "river-valley" }
      ]
    },
    r7_s3: {
      id: "r7_s3",
      regionId: "r7",
      economyValue: 1.15,
      populationValue: 1,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 14, r: 11, terrainLayer: "river-valley" },
        { q: 13, r: 11, terrainLayer: "river-valley" },
        { q: 13, r: 10, terrainLayer: "river-valley" },
        { q: 14, r: 9, terrainLayer: "river-valley" },
        { q: 13, r: 9, terrainLayer: "river-valley" }
      ]
    },
    r7_s4: {
      id: "r7_s4",
      regionId: "r7",
      economyValue: 2.3,
      populationValue: 2,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 11, r: 10, terrainLayer: "river-valley" },
        { q: 12, r: 10, terrainLayer: "river-valley" },
        { q: 12, r: 9, terrainLayer: "river-valley" },
        { q: 11, r: 9, terrainLayer: "river-valley" },
        { q: 12, r: 11, terrainLayer: "river-valley" }
      ]
    },
    r8_s0: {
      id: "r8_s0",
      regionId: "r8",
      economyValue: 1.92,
      populationValue: 2,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 3, r: 17, terrainLayer: "plains" },
        { q: 4, r: 16, terrainLayer: "plains" },
        { q: 4, r: 17, terrainLayer: "plains" },
        { q: 5, r: 16, terrainLayer: "plains" },
        { q: 5, r: 17, terrainLayer: "plains" }
      ]
    },
    r8_s1: {
      id: "r8_s1",
      regionId: "r8",
      economyValue: 1.92,
      populationValue: 2,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 6, r: 17, terrainLayer: "plains" },
        { q: 7, r: 17, terrainLayer: "plains" },
        { q: 5, r: 18, terrainLayer: "plains" },
        { q: 7, r: 16, terrainLayer: "plains" },
        { q: 6, r: 16, terrainLayer: "plains" }
      ]
    },
    r8_s2: {
      id: "r8_s2",
      regionId: "r8",
      economyValue: 1.92,
      populationValue: 2,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 8, r: 15, terrainLayer: "plains" },
        { q: 7, r: 15, terrainLayer: "plains" },
        { q: 7, r: 14, terrainLayer: "plains" },
        { q: 6, r: 15, terrainLayer: "plains" },
        { q: 6, r: 14, terrainLayer: "plains" },
        { q: 5, r: 15, terrainLayer: "plains" }
      ]
    },
    r9_s0: {
      id: "r9_s0",
      regionId: "r9",
      economyValue: 0.92,
      populationValue: 1,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 13, r: 16, terrainLayer: "plains" },
        { q: 14, r: 14, terrainLayer: "plains" },
        { q: 13, r: 15, terrainLayer: "plains" },
        { q: 13, r: 14, terrainLayer: "plains" },
        { q: 12, r: 15, terrainLayer: "plains" }
      ]
    },
    r9_s1: {
      id: "r9_s1",
      regionId: "r9",
      economyValue: 0.92,
      populationValue: 1,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 11, r: 17, terrainLayer: "plains" },
        { q: 11, r: 16, terrainLayer: "plains" },
        { q: 10, r: 17, terrainLayer: "plains" },
        { q: 10, r: 16, terrainLayer: "plains" },
        { q: 12, r: 16, terrainLayer: "plains" }
      ]
    },
    r9_s2: {
      id: "r9_s2",
      regionId: "r9",
      economyValue: 0.92,
      populationValue: 1,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 14, r: 12, terrainLayer: "plains" },
        { q: 13, r: 12, terrainLayer: "plains" },
        { q: 13, r: 13, terrainLayer: "plains" },
        { q: 14, r: 13, terrainLayer: "plains" },
        { q: 12, r: 13, terrainLayer: "plains" },
        { q: 12, r: 12, terrainLayer: "plains" }
      ]
    },
    r9_s3: {
      id: "r9_s3",
      regionId: "r9",
      economyValue: 0.92,
      populationValue: 1,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 8, r: 17, terrainLayer: "plains" },
        { q: 9, r: 17, terrainLayer: "plains" },
        { q: 9, r: 16, terrainLayer: "plains" },
        { q: 10, r: 15, terrainLayer: "plains" },
        { q: 11, r: 15, terrainLayer: "plains" },
        { q: 12, r: 14, terrainLayer: "plains" }
      ]
    },
    r9_s4: {
      id: "r9_s4",
      regionId: "r9",
      economyValue: 1.84,
      populationValue: 2,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 11, r: 13, terrainLayer: "plains" },
        { q: 10, r: 14, terrainLayer: "plains" },
        { q: 11, r: 14, terrainLayer: "plains" },
        { q: 9, r: 15, terrainLayer: "plains" },
        { q: 8, r: 16, terrainLayer: "plains" }
      ]
    },
    r10_s0: {
      id: "r10_s0",
      regionId: "r10",
      economyValue: 0.923,
      populationValue: 1.2,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 20, r: 15, terrainLayer: "plains" },
        { q: 21, r: 13, terrainLayer: "plains" },
        { q: 20, r: 14, terrainLayer: "plains" },
        { q: 19, r: 15, terrainLayer: "plains" },
        { q: 20, r: 13, terrainLayer: "plains" },
        { q: 19, r: 14, terrainLayer: "plains" }
      ]
    },
    r10_s1: {
      id: "r10_s1",
      regionId: "r10",
      economyValue: 0.923,
      populationValue: 1.2,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 17, r: 16, terrainLayer: "plains" },
        { q: 18, r: 16, terrainLayer: "plains" },
        { q: 18, r: 15, terrainLayer: "plains" }
      ]
    },
    r10_s2: {
      id: "r10_s2",
      regionId: "r10",
      economyValue: 0.923,
      populationValue: 1.2,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 20, r: 12, terrainLayer: "plains" },
        { q: 19, r: 13, terrainLayer: "plains" },
        { q: 19, r: 12, terrainLayer: "plains" },
        { q: 18, r: 14, terrainLayer: "plains" },
        { q: 18, r: 13, terrainLayer: "plains" }
      ]
    },
    r10_s3: {
      id: "r10_s3",
      regionId: "r10",
      economyValue: 1.85,
      populationValue: 2.4,
      usableEconomy: 1,
      usablePop: 1,
      fortTier: "none",
      garrison: 0,
      mapUnits: [
        { q: 16, r: 15, terrainLayer: "plains" },
        { q: 17, r: 13, terrainLayer: "plains" },
        { q: 17, r: 14, terrainLayer: "plains" },
        { q: 17, r: 15, terrainLayer: "plains" }
      ]
    }
  },
  edges: [
    {
      a: "r1_s0",
      b: "r2_s3",
      choke: { class: "open", cap: Infinity, removalPath: "n/a (open border)" },
      frontageHexes: 5
    },
    {
      a: "r1_s2",
      b: "r7_s4",
      choke: { class: "open", cap: Infinity, removalPath: "n/a (open border)" },
      frontageHexes: 7
    },
    {
      a: "r1_s1",
      b: "r9_s4",
      choke: { class: "river", cap: 1000, removalPath: "bridgehead or upstream crossing" },
      frontageHexes: 6
    },
    {
      a: "r1_s0",
      b: "r6_s5",
      choke: { class: "pass", cap: 1000, removalPath: "side-path bypass or road-build" },
      frontageHexes: 4
    },
    {
      a: "r1_s1",
      b: "r8_s2",
      choke: { class: "pass", cap: 1000, removalPath: "side-path bypass or road-build" },
      frontageHexes: 8
    },
    {
      a: "r2_s0",
      b: "r3_s5",
      choke: { class: "forest", cap: 1500, removalPath: "clearing or road-build" },
      frontageHexes: 12
    },
    {
      a: "r2_s1",
      b: "r5_s8",
      choke: { class: "hills", cap: 1300, removalPath: "ridge road" },
      frontageHexes: 6
    },
    {
      a: "r2_s1",
      b: "r6_s3",
      choke: { class: "pass", cap: 1000, removalPath: "side-path bypass or road-build" },
      frontageHexes: 9
    },
    {
      a: "r3_s0",
      b: "r4_s1",
      choke: { class: "open", cap: Infinity, removalPath: "n/a (open border)" },
      frontageHexes: 6
    },
    {
      a: "r3_s4",
      b: "r7_s0",
      choke: { class: "open", cap: Infinity, removalPath: "n/a (open border)" },
      frontageHexes: 7
    },
    {
      a: "r4_s1",
      b: "r7_s0",
      choke: { class: "river", cap: 1000, removalPath: "bridgehead or upstream crossing" },
      frontageHexes: 9
    },
    {
      a: "r5_s4",
      b: "r6_s0",
      choke: { class: "pass", cap: 1000, removalPath: "side-path bypass or road-build" },
      frontageHexes: 7
    },
    {
      a: "r6_s2",
      b: "r8_s0",
      choke: { class: "open", cap: Infinity, removalPath: "n/a (open border)" },
      frontageHexes: 7
    },
    {
      a: "r7_s3",
      b: "r9_s2",
      choke: { class: "river", cap: 1000, removalPath: "bridgehead or upstream crossing" },
      frontageHexes: 5
    },
    {
      a: "r8_s1",
      b: "r9_s4",
      choke: { class: "pass", cap: 1000, removalPath: "side-path bypass or road-build" },
      frontageHexes: 5
    },
    {
      a: "r9_s0",
      b: "r10_s3",
      choke: { class: "strait", cap: 500, removalPath: "port staging or sea control" },
      frontageHexes: 0
    },
    {
      a: "r4_s2",
      b: "r10_s3",
      choke: { class: "strait", cap: 800, removalPath: "port staging or sea control" },
      frontageHexes: 0
    }
  ],
  sectorAdjacency: {
    r1_s0: ["r1_s1", "r1_s2", "r1_s3"],
    r1_s1: ["r1_s0", "r1_s2", "r1_s3"],
    r1_s2: ["r1_s0", "r1_s1", "r1_s3"],
    r1_s3: ["r1_s0", "r1_s1", "r1_s2"],
    r2_s0: ["r2_s2", "r2_s4"],
    r2_s1: ["r2_s2"],
    r2_s2: ["r2_s0", "r2_s1", "r2_s3", "r2_s4"],
    r2_s3: ["r2_s2", "r2_s4"],
    r2_s4: ["r2_s0", "r2_s2", "r2_s3"],
    r3_s0: ["r3_s2", "r3_s4"],
    r3_s1: ["r3_s3", "r3_s5"],
    r3_s2: ["r3_s0", "r3_s3", "r3_s4"],
    r3_s3: ["r3_s1", "r3_s2", "r3_s4", "r3_s5", "r3_s6"],
    r3_s4: ["r3_s0", "r3_s2", "r3_s3", "r3_s6", "r3_s7"],
    r3_s5: ["r3_s1", "r3_s3", "r3_s6", "r3_s7"],
    r3_s6: ["r3_s3", "r3_s4", "r3_s5", "r3_s7"],
    r3_s7: ["r3_s4", "r3_s5", "r3_s6"],
    r4_s0: ["r4_s2", "r4_s3", "r4_s5"],
    r4_s1: ["r4_s4", "r4_s5"],
    r4_s2: ["r4_s0", "r4_s5"],
    r4_s3: ["r4_s0", "r4_s4", "r4_s5"],
    r4_s4: ["r4_s1", "r4_s3", "r4_s5"],
    r4_s5: ["r4_s0", "r4_s1", "r4_s2", "r4_s3", "r4_s4"],
    r5_s0: ["r5_s1", "r5_s2", "r5_s9"],
    r5_s1: ["r5_s0", "r5_s7", "r5_s9"],
    r5_s2: ["r5_s0", "r5_s3", "r5_s9"],
    r5_s3: ["r5_s2", "r5_s5", "r5_s6", "r5_s9"],
    r5_s4: ["r5_s6", "r5_s7", "r5_s8", "r5_s9"],
    r5_s5: ["r5_s3", "r5_s6"],
    r5_s6: ["r5_s3", "r5_s4", "r5_s5", "r5_s8", "r5_s9"],
    r5_s7: ["r5_s1", "r5_s4", "r5_s9"],
    r5_s8: ["r5_s4", "r5_s6"],
    r5_s9: ["r5_s0", "r5_s1", "r5_s2", "r5_s3", "r5_s4", "r5_s6", "r5_s7"],
    r6_s0: ["r6_s1", "r6_s2", "r6_s3", "r6_s4"],
    r6_s1: ["r6_s0", "r6_s2", "r6_s4"],
    r6_s2: ["r6_s0", "r6_s1", "r6_s3", "r6_s5"],
    r6_s3: ["r6_s0", "r6_s2", "r6_s5"],
    r6_s4: ["r6_s0", "r6_s1"],
    r6_s5: ["r6_s2", "r6_s3"],
    r7_s0: ["r7_s1", "r7_s2", "r7_s3"],
    r7_s1: ["r7_s0", "r7_s3"],
    r7_s2: ["r7_s0", "r7_s3", "r7_s4"],
    r7_s3: ["r7_s0", "r7_s1", "r7_s2", "r7_s4"],
    r7_s4: ["r7_s2", "r7_s3"],
    r8_s0: ["r8_s1", "r8_s2"],
    r8_s1: ["r8_s0", "r8_s2"],
    r8_s2: ["r8_s0", "r8_s1"],
    r9_s0: ["r9_s1", "r9_s2", "r9_s3"],
    r9_s1: ["r9_s0", "r9_s3"],
    r9_s2: ["r9_s0", "r9_s3", "r9_s4"],
    r9_s3: ["r9_s0", "r9_s1", "r9_s2", "r9_s4"],
    r9_s4: ["r9_s2", "r9_s3"],
    r10_s0: ["r10_s1", "r10_s2"],
    r10_s1: ["r10_s0", "r10_s2", "r10_s3"],
    r10_s2: ["r10_s0", "r10_s1", "r10_s3"],
    r10_s3: ["r10_s1", "r10_s2"]
  },
  meta: {
    hexR: 25,
    regionCenters: {
      r1: { x: 643.5049875342702, y: 452.0833333333333 },
      r2: { x: 496.16038758483484, y: 306.25 },
      r3: { x: 653.0435748304747, y: 115.98837209302326 },
      r4: { x: 951.9911607777475, y: 193.01470588235293 },
      r5: { x: 213.75081557043185, y: 311.59090909090907 },
      r6: { x: 412.0604743813056, y: 517.741935483871 },
      r7: { x: 779.4228634059947, y: 323.0769230769231 },
      r8: { x: 591.3329710215619, y: 597.65625 },
      r9: { x: 807.4885014916015, y: 551.3888888888889 },
      r10: { x: 1104.1823898251594, y: 525 }
    },
    capitals: { r5: "r5_s2", r3: "r3_s7", r4: "r4_s2" },
    cities: {
      r2: "r2_s3",
      r7: "r7_s4",
      r9: "r9_s4",
      r6: "r6_s5",
      r10: "r10_s3",
      r1: "r1_s3"
    },
    pairClass: {
      "r1|r2": "open",
      "r1|r7": "open",
      "r1|r9": "river",
      "r1|r6": "pass",
      "r1|r8": "pass",
      "r2|r3": "forest",
      "r2|r5": "hills",
      "r2|r6": "pass",
      "r3|r4": "open",
      "r3|r7": "open",
      "r4|r7": "river",
      "r5|r6": "pass",
      "r6|r8": "open",
      "r7|r9": "river",
      "r8|r9": "pass",
      "r9|r10": "strait",
      "r4|r10": "strait"
    },
    frontage: {
      "r1|r2": 5,
      "r1|r7": 7,
      "r1|r9": 6,
      "r1|r6": 4,
      "r1|r8": 8,
      "r2|r3": 12,
      "r2|r5": 6,
      "r2|r6": 9,
      "r3|r4": 6,
      "r3|r7": 7,
      "r4|r7": 9,
      "r5|r6": 7,
      "r6|r8": 7,
      "r7|r9": 5,
      "r8|r9": 5,
      "r9|r10": 0,
      "r4|r10": 0
    },
    partialRivers: {
      "r3|r7": ["15,5|15,6", "14,6|15,6", "14,6|14,7"]
    },
    rangeHexes: [
      { q: 6, r: 1, x: 281.45825622994255, y: 37.5 },
      { q: 7, r: 1, x: 324.7595264191645, y: 37.5 },
      { q: 6, r: 2, x: 303.1088913245535, y: 75 },
      { q: 7, r: 2, x: 346.41016151377545, y: 75 },
      { q: 6, r: 3, x: 324.7595264191645, y: 112.5 },
      { q: 7, r: 3, x: 368.0607966083864, y: 112.5 },
      { q: 6, r: 4, x: 346.41016151377545, y: 150 },
      { q: 7, r: 4, x: 389.7114317029974, y: 150 },
      { q: 6, r: 5, x: 368.0607966083864, y: 187.5 },
      { q: 7, r: 5, x: 411.36206679760835, y: 187.5 },
      { q: 6, r: 6, x: 389.7114317029974, y: 225 },
      { q: 7, r: 6, x: 433.0127018922193, y: 225 },
      { q: 8, r: 6, x: 476.31397208144125, y: 225 },
      { q: 7, r: 7, x: 454.6633369868303, y: 262.5 },
      { q: 11, r: 7, x: 627.868417743718, y: 262.5 },
      { q: 10, r: 8, x: 606.217782649107, y: 300 },
      { q: 11, r: 8, x: 649.519052838329, y: 300 },
      { q: 10, r: 9, x: 627.868417743718, y: 337.5 },
      { q: 6, r: 7, x: 411.36206679760835, y: 262.5 },
      { q: 3, r: 3, x: 194.8557158514987, y: 112.5 },
      { q: 4, r: 3, x: 238.15698604072062, y: 112.5 },
      { q: 1, r: 4, x: 129.9038105676658, y: 150 },
      { q: 2, r: 4, x: 173.20508075688772, y: 150 },
      { q: 4, r: 4, x: 259.8076211353316, y: 150 },
      { q: 5, r: 4, x: 303.1088913245535, y: 150 },
      { q: -1, r: 5, x: 64.9519052838329, y: 187.5 },
      { q: 0, r: 5, x: 108.25317547305482, y: 187.5 },
      { q: -2, r: 6, x: 43.30127018922193, y: 225 },
      { q: -3, r: 7, x: 21.650635094610966, y: 262.5 },
      { q: -4, r: 8, x: 0, y: 300 },
      { q: -4, r: 9, x: 21.650635094610966, y: 337.5 },
      { q: -5, r: 10, x: 0, y: 375 },
      { q: -5, r: 11, x: 21.650635094610966, y: 412.5 },
      { q: -4, r: 11, x: 64.9519052838329, y: 412.5 },
      { q: -4, r: 12, x: 86.60254037844386, y: 450 },
      { q: -3, r: 12, x: 129.9038105676658, y: 450 },
      { q: -3, r: 13, x: 151.55444566227675, y: 487.5 },
      { q: -2, r: 13, x: 194.8557158514987, y: 487.5 },
      { q: -1, r: 13, x: 238.15698604072062, y: 487.5 },
      { q: -1, r: 14, x: 259.8076211353316, y: 525 },
      { q: -1, r: 15, x: 281.45825622994255, y: 562.5 },
      { q: -1, r: 16, x: 303.1088913245535, y: 600 },
      { q: -1, r: 17, x: 324.7595264191645, y: 637.5 },
      { q: 0, r: 17, x: 368.0607966083864, y: 637.5 },
      { q: 0, r: 18, x: 389.7114317029974, y: 675 },
      { q: 1, r: 18, x: 433.0127018922193, y: 675 },
      { q: 2, r: 18, x: 476.31397208144125, y: 675 },
      { q: 3, r: 18, x: 519.6152422706632, y: 675 },
      { q: 4, r: 18, x: 562.9165124598851, y: 675 },
      { q: 6, r: 18, x: 649.519052838329, y: 675 },
      { q: 4, r: 19, x: 584.567147554496, y: 712.5 },
      { q: 5, r: 19, x: 627.868417743718, y: 712.5 }
    ],
    massif: {
      hexes: [
        { q: 11, r: 7, x: 627.868417743718, y: 262.5 },
        { q: 10, r: 8, x: 606.217782649107, y: 300 },
        { q: 11, r: 8, x: 649.519052838329, y: 300 },
        { q: 10, r: 9, x: 627.868417743718, y: 337.5 }
      ],
      cx: 640,
      cy: 300,
      label: "태산"
    }
  },
  contentHash: "113f7635"
};
