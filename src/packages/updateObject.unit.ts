import { updateObject } from "./updateObject"

describe("updateObject", () => {
  it("should return a new object with updates applied", () => {
    const initial = { a: 1, b: "b", c: true, d: 2 }
    const update = { b: "b", a: 1, c: true }

    const updated = updateObject(initial, update)

    expect(updated).toEqual({ a: 1, b: "b", c: true, d: 2 })
  })
  it("should update nested objects", () => {
    const initial = { a: 1, b: { e: "s", c: { d: 2 } } }
    const update = { b: { c: { d: 4 } } }

    const updated = updateObject(initial, update)

    expect(updated).toEqual({ a: 1, b: { e: "s", c: { d: 4 } } })
  })
  it("should skip any keys that do not exist on the initial object", () => {
    const initial = { a: 1 }
    const update = { a: 1, b: 2 }

    const updated = updateObject(initial, update)

    expect(updated).toEqual({ a: 1 })
  })
  it("should overwrite arrays", () => {
    const initial = { a: [1, 2, 3] }
    const update = { a: [1] }

    const updated = updateObject(initial, update)

    expect(updated).toEqual({ a: [1] })
  })
})
