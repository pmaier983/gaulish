export const createArraySquare = <T>({
  size,
  cell,
}: {
  size: number
  cell: T
}) => {
  const row = Array(size).fill(null)
  const squareArray = row.map((_, y) => row.map((_, x) => ({ x, y, ...cell })))
  return squareArray
}
