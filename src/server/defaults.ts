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

import DEFAULT_JSON_MAP from "./defaultMap.json"

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
    xyTileId: "7:92",
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
    xyTileId: "10:93",
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
    pathArray: ["6:94", "7:94", "7:93", "8:93", "8:94", "7:94", "7:95", "6:95"],
  },
  {
    id: "randomUUID2",
    pathArray: ["6:96", "7:95", "8:94", "9:93", "10:92"],
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

// TODO: Validate instead of casting!
export const DEFAULT_MAP = DEFAULT_JSON_MAP as Omit<Tile, "id">[]
