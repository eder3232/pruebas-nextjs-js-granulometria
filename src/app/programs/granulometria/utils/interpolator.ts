export function interp(
  xi: number,
  xj: number,
  yi: number,
  yj: number,
  x: number
) {
  let y = yi + ((x - xi) * (yj - yi)) / (xj - xi)
  return y
}
