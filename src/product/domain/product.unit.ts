import { productMock } from "./productMock"
import { makeProduct } from "./product"

describe("product", () => {
  describe("makeProduct", () => {
    it("returns a product", () => {
      const fakeInput = productMock()

      const product = makeProduct(fakeInput)

      expect(product).toEqual(fakeInput)
    })
    it("must have a name", () => {
      const fakeInput = productMock({ name: "" })

      const product = () => makeProduct(fakeInput)

      expect(product).toThrow()
    })
  })
})
