import { DeepPartial } from "./deepPartial"

export const updateObject = <T extends Record<string, any>>(initial: T, update: DeepPartial<T>) => {
  return Object.keys(update).reduce(
    (acc, key) => {
      if (!keyExists(initial, key) || !typesMatch(update[key], initial[key])) return acc

      if (isObject(initial[key])) {
        // @ts-ignore - covered by function input typing. However, TS can't tell that DeepPartials keys are the same hence loose typing
        acc[key] = updateObject(initial[key], update[key])
        return acc
      }

      // @ts-ignore - same as above
      acc[key] = update[key]
      return acc
    },
    { ...initial },
  )
}

function isObject(x: any) {
  return typeof x === "object" && !Array.isArray(x)
}

function keyExists(obj: Record<string, any>, key) {
  return obj.hasOwnProperty(key)
}

function typesMatch(t: any, t2: any) {
  return typeof t === typeof t2
}
