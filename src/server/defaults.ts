import { type Path, type Npc, type Tile, type City } from "schema"

export const DEFAULT_CITIES: City[] = [
  { level: 1, name: "Lumbridge", tileId: 23, id: 1 },
  { level: 1, name: "Varrock", tileId: 41, id: 2 },
]

export const DEFAULT_PATHS: Omit<Path, "createdAt">[] = [
  {
    id: 1,
    path: "['4:1', '3:1', '3:2', '3:3', '2:3', '2:4', '2:5', '3:5', '4:5', '4:4', '5:4', '5:3', '5:2', '5:1']",
  },
  {
    id: 2,
    path: "['0:4', '1:4', '2:4', '2:5', '2:6', '1:6', '0:6', '0:5']",
  },
]

export const DEFAULT_NPCS: Omit<Npc, "id">[] = [
  { pathId: 1, shipTypeId: 0 },
  { pathId: 2, shipTypeId: 1 },
]

export const DEFAULT_MAP: Tile[] = [
  { x: 0, y: 0, type_id: 3, id: 1 },
  { x: 1, y: 0, type_id: 1, id: 2 },
  { x: 2, y: 0, type_id: 2, id: 3 },
  { x: 3, y: 0, type_id: 4, id: 4 },
  { x: 4, y: 0, type_id: 4, id: 5 },
  { x: 5, y: 0, type_id: 4, id: 6 },
  { x: 6, y: 0, type_id: 2, id: 7 },
  { x: 0, y: 1, type_id: 1, id: 8 },
  { x: 1, y: 1, type_id: 1, id: 9 },
  { x: 2, y: 1, type_id: 2, id: 10 },
  { x: 3, y: 1, type_id: 4, id: 11 },
  { x: 4, y: 1, type_id: 4, id: 12 },
  { x: 5, y: 1, type_id: 4, id: 13 },
  { x: 6, y: 1, type_id: 4, id: 14 },
  { x: 0, y: 2, type_id: 2, id: 15 },
  { x: 1, y: 2, type_id: 2, id: 16 },
  { x: 2, y: 2, type_id: 2, id: 17 },
  { x: 3, y: 2, type_id: 4, id: 18 },
  { x: 4, y: 2, type_id: 3, id: 19 },
  { x: 5, y: 2, type_id: 4, id: 20 },
  { x: 6, y: 2, type_id: 4, id: 21 },
  { x: 0, y: 3, type_id: 4, id: 22 },
  { x: 1, y: 3, type_id: 2, id: 23 },
  { x: 2, y: 3, type_id: 4, id: 24 },
  { x: 3, y: 3, type_id: 4, id: 25 },
  { x: 4, y: 3, type_id: 3, id: 26 },
  { x: 5, y: 3, type_id: 4, id: 27 },
  { x: 6, y: 3, type_id: 4, id: 28 },
  { x: 0, y: 4, type_id: 4, id: 29 },
  { x: 1, y: 4, type_id: 4, id: 30 },
  { x: 2, y: 4, type_id: 4, id: 31 },
  { x: 3, y: 4, type_id: 3, id: 32 },
  { x: 4, y: 4, type_id: 4, id: 33 },
  { x: 5, y: 4, type_id: 4, id: 34 },
  { x: 6, y: 4, type_id: 2, id: 35 },
  { x: 0, y: 5, type_id: 4, id: 36 },
  { x: 1, y: 5, type_id: 2, id: 37 },
  { x: 2, y: 5, type_id: 4, id: 38 },
  { x: 3, y: 5, type_id: 4, id: 39 },
  { x: 4, y: 5, type_id: 4, id: 40 },
  { x: 5, y: 5, type_id: 2, id: 41 },
  { x: 6, y: 5, type_id: 1, id: 42 },
  { x: 0, y: 6, type_id: 4, id: 43 },
  { x: 1, y: 6, type_id: 4, id: 44 },
  { x: 2, y: 6, type_id: 4, id: 45 },
  { x: 3, y: 6, type_id: 4, id: 46 },
  { x: 4, y: 6, type_id: 4, id: 47 },
  { x: 5, y: 6, type_id: 4, id: 48 },
  { x: 6, y: 6, type_id: 4, id: 49 },
]
