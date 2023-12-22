import { createId } from "@paralleldrive/cuid2"
import { type Path, type Npc, type City, type Cargo } from "schema"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import {
  OPPOSITE_DIRECTIONS,
  type Direction,
  type TileType,
} from "~/components/constants"
import { type ShipComposite, type CityObject } from "~/state/gamestateStore"
import { DIRECTIONS } from "~/components/constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ABLY_CLIENT_ID = createId()

export const createArraySquare = <T>({
  size,
  tile,
}: {
  size: number
  tile: T
}) => {
  const row = Array(size).fill(null)
  const squareArray = row.map((_, y) => row.map((_, x) => ({ x, y, ...tile })))
  return squareArray
}

export const getTileImageString = (tileType: TileType) => {
  return `/assets/tiles/${tileType.toLocaleLowerCase()}.webp`
}

export const getXYFromXYTileId = (xyTileId: string) => {
  const [xString, yString] = xyTileId.split(":")
  if (!xString || !yString)
    throw new Error("Invalid tile string passed into getXYFromTileId")
  const x = parseInt(xString)
  const y = parseInt(yString)
  if (isNaN(x) || isNaN(y))
    throw new Error("Invalid tile string passed into getXYFromTileId")
  return { x, y }
}

export const getDirectionTowardsPrevTile = (
  currentTile: string,
  prevTile?: string,
) => {
  if (!prevTile) {
    throw new Error("Nonexistent prevTile passed into getDirectionFromTiles")
  }

  const [xStringPrev, yStringPrev] = prevTile.split(":")
  const [xStringCurrent, yStringCurrent] = currentTile.split(":")

  if (!xStringPrev || !yStringPrev || !xStringCurrent || !yStringCurrent) {
    throw new Error("Invalid tile string passed into getDirectionFromTiles")
  }

  const xPrev = parseInt(xStringPrev)
  const yPrev = parseInt(yStringPrev)
  const xCurrent = parseInt(xStringCurrent)
  const yCurrent = parseInt(yStringCurrent)

  if (yCurrent > yPrev) {
    return DIRECTIONS.NORTH
  }
  if (yCurrent < yPrev) {
    return DIRECTIONS.SOUTH
  }
  if (xCurrent < xPrev) {
    return DIRECTIONS.EAST
  }
  if (xCurrent > xPrev) {
    return DIRECTIONS.WEST
  }

  throw new Error("Invalid Tiles input into getDirectionFromTiles")
}

// Taken from here: https://stackoverflow.com/a/46219650/7945415
export const uniqueBy = <element>(
  array: element[],
  propertyName: keyof element,
) => {
  return array.filter(
    (e, i) => array.findIndex((a) => a[propertyName] === e[propertyName]) === i,
  )
}

export const getTilesMoved = ({
  createdAtTimeMs,
  currentTimeMs,
  speed,
}: {
  createdAtTimeMs: number
  currentTimeMs: number
  speed: number
}) => {
  const timePassed = currentTimeMs - createdAtTimeMs

  // Debugged by Yijiao He
  return Math.floor(timePassed * speed)
}

export const getNpcCurrentXYTileId = ({
  createdAtTimeMs,
  currentTimeMs,
  speed,
  pathArray,
}: {
  createdAtTimeMs: number
  currentTimeMs: number
  speed: number
  pathArray: string[]
}) => {
  const tilesMoved = getTilesMoved({ createdAtTimeMs, currentTimeMs, speed })

  const currentXyTileId = pathArray[tilesMoved % pathArray.length]

  if (!currentXyTileId)
    throw Error("Can't seem to find the appropriate tile for that npc?")

  return currentXyTileId
}

export const getShipCurrentXYTileId = ({
  ship,
  cityObject,
}: {
  ship: ShipComposite
  cityObject: CityObject
}) => {
  // if the ship has no path its at a city
  if (!ship.path) {
    const possibleCity = cityObject[ship.cityId]
    if (!possibleCity) throw Error("Ship has an invalid CityId")
    return possibleCity.xyTileId
  }

  const { createdAt, pathArray } = ship.path
  const speed = ship.speed

  const tilesMoved = getTilesMoved({
    speed,
    currentTimeMs: Date.now(),
    // Debugged by Yijiao He (with help)
    createdAtTimeMs: createdAt?.getTime() ?? 0,
  })

  // If the ship sailed past its final location, return it's city
  if (tilesMoved >= pathArray.length) {
    const possibleCity = cityObject[ship.cityId]
    if (!possibleCity) throw Error("Ship has an invalid CityId")
    return possibleCity.xyTileId
  }

  const shipXYTileId = pathArray[tilesMoved]

  if (!shipXYTileId)
    throw new Error(`The path array does not seem to contain 100% valid tiles?`)

  return shipXYTileId
}

export const hasNpcUserCollision = ({
  userStartTimeMsAtTile,
  userEndTimeMsAtTile,
  userXYTileId,
  npc,
  npcPath,
}: {
  userStartTimeMsAtTile: number
  userEndTimeMsAtTile: number
  userXYTileId: string
  npc: Npc
  npcPath: Path
}) => {
  let failsafe = 0
  let currentNpcTime = userStartTimeMsAtTile
  const msPerTile = 1 / npc.speed

  while (currentNpcTime < userEndTimeMsAtTile) {
    failsafe++
    if (failsafe > 10000) {
      throw Error("Infinite loop detected in hasNpcUserCollision")
    }

    const currentNpcTileId = getNpcCurrentXYTileId({
      createdAtTimeMs: npcPath.createdAt?.getTime() ?? 0,
      currentTimeMs: currentNpcTime,
      speed: npc.speed,
      pathArray: npcPath.pathArray,
    })

    if (currentNpcTileId === userXYTileId) {
      return true
    }

    // Check the final position of the npc
    if (currentNpcTime === userEndTimeMsAtTile) {
      return false
    }

    currentNpcTime = Math.min(currentNpcTime + msPerTile, userEndTimeMsAtTile)
  }

  return false
}

export const getCargoSum = (cargo: Cargo) => {
  return Object.entries(cargo).reduce((acc, [cargoType, cargoAmount]) => {
    // Skip id
    if (typeof cargoAmount === "string") {
      return acc
    }
    // Skip gold
    if (cargoType === "gold") {
      return acc
    }
    return acc + cargoAmount
  }, 0)
}

// TODO: turn into a bfs algorithm that scans an area
export const getDiamondAroundXYTileId = ({
  tileListObject,
  xyTileId,
  tileRadius,
}: {
  tileListObject: { [key: string]: unknown }
  xyTileId: string
  tileRadius: number
}) => {
  if (!tileListObject.hasOwnProperty(xyTileId)) {
    throw Error("Invalid xyTileId passed into getDiamondAroundXYTileId")
  }

  const { x, y } = getXYFromXYTileId(xyTileId)

  const visibleTiles = []

  for (let xIndex = x - tileRadius; xIndex <= x + tileRadius; xIndex++) {
    for (let yIndex = y - tileRadius; yIndex <= y + tileRadius; yIndex++) {
      const currentXYTileId = `${xIndex}:${yIndex}`

      // Written by Yijiao He
      if (tileListObject.hasOwnProperty(currentXYTileId)) {
        const xDistance = Math.abs(x - xIndex)
        const yDistance = Math.abs(y - yIndex)
        if (xDistance + yDistance <= tileRadius) {
          visibleTiles.push(currentXYTileId)
        }
      }
    }
  }

  return visibleTiles
}

interface GetNewKnownTilesInput {
  centralXYTileId: string
  visibilityStrength: number
  tileListObject: { [xyTileId: string]: unknown }
  knownTiles: string[]
}

export const getNewKnownTiles = ({
  centralXYTileId,
  visibilityStrength,
  tileListObject,
  knownTiles,
}: GetNewKnownTilesInput) => {
  const knownTilesObject = knownTiles.reduce<{ [key: string]: boolean }>(
    (acc, xyTileId) => {
      acc[xyTileId] = true
      return acc
    },
    {},
  )

  const possibleNewKnownTiles = getDiamondAroundXYTileId({
    xyTileId: centralXYTileId,
    tileListObject,
    tileRadius: visibilityStrength,
  })

  const newKnownTiles = possibleNewKnownTiles.filter(
    (xyTileId) => !knownTilesObject.hasOwnProperty(xyTileId),
  )

  return newKnownTiles
}

export interface CitySummary {
  id: number
  name: string
  shipCount: number
  gold: number
  cargo: {
    currentCargo: number
    cargoCapacity: number
  }
}

export const getCitySummaries = (
  cities: City[],
  ships: ShipComposite[],
): CitySummary[] => {
  const cityIdToShipObject = ships.reduce<{ [key: string]: ShipComposite[] }>(
    (acc, ship) => {
      const currentShip = acc[ship.cityId]
      if (currentShip) {
        acc[ship.cityId] = [...currentShip, ship]
      } else {
        acc[ship.cityId] = [ship]
      }
      return acc
    },
    {},
  )

  return cities.map((city) => {
    const shipsAtCity = cityIdToShipObject[city.id] ?? []

    return {
      id: city.id,
      name: city.name,
      shipCount: shipsAtCity.length,
      gold: shipsAtCity.reduce((acc, ship) => acc + ship.cargo.gold, 0),
      cargo: {
        currentCargo: shipsAtCity.reduce(
          (acc, ship) => acc + getCargoSum(ship.cargo),
          0,
        ),
        cargoCapacity: shipsAtCity.reduce(
          (acc, ship) => acc + ship.cargoCapacity,
          0,
        ),
      },
    }
  })
}

// Thank you Tommy Ettinger
// https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
export const getRandomNumberWithSeed = (seed: number) => {
  let t = (seed += 0x6d2b79f5)
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

export interface SelectedShipPath {
  previousTileId?: string
  directionLinesToDraw: Direction[]
  index: number
}

export type SelectedShipPathObject = {
  [xyTileId: string]: SelectedShipPath
}

// TODO: possible move to another utils file?
export const generateSelectedShipPathObject = (shipPathArray: string[]) => {
  const shipPathObject = shipPathArray.reduce<SelectedShipPathObject>(
    (acc, curTileId, i) => {
      // For the First Tile
      if (i === 0) {
        acc[curTileId] = {
          index: i,
          directionLinesToDraw: [],
        }
        return acc
      }

      const prevTileId = shipPathArray[i - 1]

      const directionTowardsPrevTile = getDirectionTowardsPrevTile(
        curTileId,
        prevTileId,
      )

      // If we have already passed over this tile
      if (acc[curTileId]) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const currentTile = acc[curTileId]!

        acc[curTileId] = {
          ...currentTile,
          directionLinesToDraw: [
            ...currentTile.directionLinesToDraw,
            directionTowardsPrevTile,
          ],
        }
      } else {
        // If we have never seen this tile before!
        acc[curTileId] = {
          index: i,
          previousTileId: prevTileId,
          directionLinesToDraw: [directionTowardsPrevTile],
        }
      }

      // We also need to update the previous tile to include the direction to point towards
      if (prevTileId) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const prevTile = acc[prevTileId]!

        acc[prevTileId] = {
          ...prevTile,
          directionLinesToDraw: [
            ...prevTile.directionLinesToDraw,
            OPPOSITE_DIRECTIONS[directionTowardsPrevTile],
          ],
        }
      }

      return acc
    },
    {},
  )

  return shipPathObject
}
