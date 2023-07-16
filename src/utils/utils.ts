import { TILE_TYPE_ID_TO_TYPE } from "~/components/constants"

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
