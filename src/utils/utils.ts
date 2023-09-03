import { DIRECTIONS } from "./../components/constants"
import { createId } from "@paralleldrive/cuid2"
import { type Path, type Npc } from "schema"
import { TILE_TYPE_ID_TO_TYPE } from "~/components/constants"

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

export const getTileImageString = (typeId: number) => {
  if (typeId === 1 || typeId === 2 || typeId === 3 || typeId === 4) {
    const TileType = TILE_TYPE_ID_TO_TYPE[typeId]
    if (!TileType)
      throw Error("Invalid Tile type_id passed into TILE_TYPE_ID_TO_TYPE")
    return `/${TileType.toLocaleLowerCase()}.webp`
  } else {
    throw new Error("Invalid Tile type_id passed into Tile")
  }
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
