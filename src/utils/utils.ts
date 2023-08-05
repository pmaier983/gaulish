import { DIRECTIONS } from "./../components/constants"
import { createId } from "@paralleldrive/cuid2"
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
    return `/${TileType.toLocaleLowerCase()}.webp`
  } else {
    throw new Error("Invalid Tile type_id passed into Tile")
  }
}

export const getPathFromString = (path: string) => {
  // TODO: consider using Zod validation here?
  if (path.length === 0) throw new Error("Received an empty string as the path")
  const pathArray = JSON.parse(path.replaceAll("'", `"`)) as string[]
  if (!pathArray) throw new Error("Something went wrong when parsing the path")
  if (pathArray.length < 2)
    throw new Error("Received an array of path length less then 2")
  return pathArray
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
