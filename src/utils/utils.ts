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
