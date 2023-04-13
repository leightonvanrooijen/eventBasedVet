import { Hydration } from "./procedureHydrator"

export const hydrationMock = <T extends Record<string, any>>(
  aggregate: T = {} as T,
  overrides?: Partial<Hydration<T>>,
): Hydration<T> => {
  return {
    version: 0,
    aggregate,
    ...overrides,
  }
}
