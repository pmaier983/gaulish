import {
  type Path,
  type Tile,
  type City,
  type Npc,
  type CargoTypes,
  type CityCargo,
} from "schema"
import {
  SHIP_TYPES,
  SHIP_TYPE_TO_SHIP_PROPERTIES,
} from "~/components/constants"

export const DEFAULT_CITY_CARGO: { [key in CargoTypes]: CityCargo } = {
  WHEAT: {
    amplitude: 2,
    midline: 5,
    type: "WHEAT",
    isSelling: true,
  },
  WOOL: {
    amplitude: 3,
    midline: 10,
    type: "WOOL",
    isSelling: true,
  },
  STONE: {
    amplitude: 5,
    midline: 15,
    type: "STONE",
    isSelling: true,
  },
  WOOD: {
    amplitude: 5,
    midline: 20,
    type: "WOOD",
    isSelling: true,
  },
}

export const DEFAULT_CITIES: City[] = [
  {
    name: "Lumbridge",
    xyTileId: "1:3",
    id: 1,
    cityCargo: [
      DEFAULT_CITY_CARGO["WHEAT"],
      DEFAULT_CITY_CARGO["WOOD"],
      DEFAULT_CITY_CARGO["STONE"],
      { ...DEFAULT_CITY_CARGO["WOOL"], isSelling: false },
    ],
  },
  {
    name: "Varrock",
    xyTileId: "5:5",
    id: 2,
    cityCargo: [
      DEFAULT_CITY_CARGO["WOOL"],
      DEFAULT_CITY_CARGO["WOOD"],
      DEFAULT_CITY_CARGO["STONE"],
      { ...DEFAULT_CITY_CARGO["WHEAT"], isSelling: false },
    ],
  },
]

export const DEFAULT_PATHS: Omit<Path, "createdAt">[] = [
  {
    id: "randomUUID1",
    pathArray: [
      "4:1",
      "3:1",
      "3:2",
      "3:3",
      "2:3",
      "2:4",
      "2:5",
      "3:5",
      "4:5",
      "4:4",
      "5:4",
      "5:3",
      "5:2",
      "5:1",
    ],
  },
  {
    id: "randomUUID2",
    pathArray: ["0:4", "1:4", "2:4", "2:5", "2:6", "1:6", "0:6", "0:5"],
  },
]

export const DEFAULT_NPCS: Npc[] = [
  {
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    id: 1,
    pathId: "randomUUID1",
    ...SHIP_TYPE_TO_SHIP_PROPERTIES[SHIP_TYPES.PLANK]!,
    name: "Drunk Pirate",
  },
  {
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    id: 2,
    pathId: "randomUUID2",
    ...SHIP_TYPE_TO_SHIP_PROPERTIES[SHIP_TYPES.RAFT]!,
    name: "Two Drunk Pirate's",
  },
]

export const DEFAULT_MAP: Omit<Tile, "id">[] = [
  { x: 0, y: 0, type: "MOUNTAIN", xyTileId: "0:0" },
  { x: 1, y: 0, type: "FOREST", xyTileId: "1:0" },
  { x: 2, y: 0, type: "GRASSLAND", xyTileId: "2:0" },
  { x: 3, y: 0, type: "MOUNTAIN", xyTileId: "3:0" },
  { x: 4, y: 0, type: "MOUNTAIN", xyTileId: "4:0" },
  { x: 5, y: 0, type: "MOUNTAIN", xyTileId: "5:0" },
  { x: 6, y: 0, type: "GRASSLAND", xyTileId: "6:0" },
  { x: 0, y: 1, type: "FOREST", xyTileId: "0:1" },
  { x: 1, y: 1, type: "FOREST", xyTileId: "1:1" },
  { x: 2, y: 1, type: "GRASSLAND", xyTileId: "2:1" },
  { x: 3, y: 1, type: "MOUNTAIN", xyTileId: "3:1" },
  { x: 4, y: 1, type: "MOUNTAIN", xyTileId: "4:1" },
  { x: 5, y: 1, type: "MOUNTAIN", xyTileId: "5:1" },
  { x: 6, y: 1, type: "MOUNTAIN", xyTileId: "6:1" },
  { x: 0, y: 2, type: "GRASSLAND", xyTileId: "0:2" },
  { x: 1, y: 2, type: "GRASSLAND", xyTileId: "1:2" },
  { x: 2, y: 2, type: "GRASSLAND", xyTileId: "2:2" },
  { x: 3, y: 2, type: "MOUNTAIN", xyTileId: "3:2" },
  { x: 4, y: 2, type: "MOUNTAIN", xyTileId: "4:2" },
  { x: 5, y: 2, type: "MOUNTAIN", xyTileId: "5:2" },
  { x: 6, y: 2, type: "MOUNTAIN", xyTileId: "6:2" },
  { x: 0, y: 3, type: "MOUNTAIN", xyTileId: "0:3" },
  { x: 1, y: 3, type: "GRASSLAND", xyTileId: "1:3" },
  { x: 2, y: 3, type: "MOUNTAIN", xyTileId: "2:3" },
  { x: 3, y: 3, type: "MOUNTAIN", xyTileId: "3:3" },
  { x: 4, y: 3, type: "MOUNTAIN", xyTileId: "4:3" },
  { x: 5, y: 3, type: "MOUNTAIN", xyTileId: "5:3" },
  { x: 6, y: 3, type: "MOUNTAIN", xyTileId: "6:3" },
  { x: 0, y: 4, type: "MOUNTAIN", xyTileId: "0:4" },
  { x: 1, y: 4, type: "MOUNTAIN", xyTileId: "1:4" },
  { x: 2, y: 4, type: "MOUNTAIN", xyTileId: "2:4" },
  { x: 3, y: 4, type: "MOUNTAIN", xyTileId: "3:4" },
  { x: 4, y: 4, type: "MOUNTAIN", xyTileId: "4:4" },
  { x: 5, y: 4, type: "MOUNTAIN", xyTileId: "5:4" },
  { x: 6, y: 4, type: "GRASSLAND", xyTileId: "6:4" },
  { x: 0, y: 5, type: "MOUNTAIN", xyTileId: "0:5" },
  { x: 1, y: 5, type: "GRASSLAND", xyTileId: "1:5" },
  { x: 2, y: 5, type: "MOUNTAIN", xyTileId: "2:5" },
  { x: 3, y: 5, type: "MOUNTAIN", xyTileId: "3:5" },
  { x: 4, y: 5, type: "MOUNTAIN", xyTileId: "4:5" },
  { x: 5, y: 5, type: "GRASSLAND", xyTileId: "5:5" },
  { x: 6, y: 5, type: "FOREST", xyTileId: "6:5" },
  { x: 0, y: 6, type: "MOUNTAIN", xyTileId: "0:6" },
  { x: 1, y: 6, type: "MOUNTAIN", xyTileId: "1:6" },
  { x: 2, y: 6, type: "MOUNTAIN", xyTileId: "2:6" },
  { x: 3, y: 6, type: "MOUNTAIN", xyTileId: "3:6" },
  { x: 4, y: 6, type: "MOUNTAIN", xyTileId: "4:6" },
  { x: 5, y: 6, type: "MOUNTAIN", xyTileId: "5:6" },
  { x: 6, y: 6, type: "MOUNTAIN", xyTileId: "6:6" },
]
