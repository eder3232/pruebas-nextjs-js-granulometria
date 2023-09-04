const getAxisYDomain = <T>(
  from: number,
  to: number,
  ref: string,
  offset: number,
  initialData: T[]
) => {
  const refData: any[] = initialData.slice(from - 1, to)
  let [bottom, top] = [refData[0][ref], refData[0][ref]]

  refData.forEach((d) => {
    if (d[ref] > top) top = d[ref]
    if (d[ref] < bottom) bottom = d[ref]
  })

  return [(bottom | 0) - offset, (top | 0) + offset]
}
