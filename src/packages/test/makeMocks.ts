export const makeMocks =
  <T extends Record<string, any>>(mockFn: (overwrite?: Partial<T>) => T) =>
  (number: number, overwrites?: Partial<T>[]) => {
    const numToLoop = new Array(number).fill(0)
    return numToLoop.map((_, index) => {
      if (overwrites?.[index]) {
        return mockFn(overwrites[index])
      }
      return mockFn()
    })
  }
