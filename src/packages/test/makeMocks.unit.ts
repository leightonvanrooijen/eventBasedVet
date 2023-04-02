import { makeMocks } from "./makeMocks"

describe("makeMocks", () => {
  it("should call the mock function the amount of times specified and return the results in an array", () => {
    const fakeReturn = { name: "john" }
    const fakeFn = () => fakeReturn
    const fakes = makeMocks(fakeFn)(2)

    expect(fakes).toEqual([fakeReturn, fakeReturn])
  })
  it("should pass the overwrite to the mock function if they match positions in the arrays", () => {
    const fakeReturn = { name: "john" }
    const overwrite = { name: "kim" }
    const fakeFn = jest.fn(() => fakeReturn)

    makeMocks(fakeFn)(2, [overwrite])

    expect(fakeFn).toHaveBeenCalledWith(overwrite)
  })
})
