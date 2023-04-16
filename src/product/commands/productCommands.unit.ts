import { buildProductCommands } from "./productCommands"
import { Thespian } from "thespian"
import { ProductActions } from "../domain/product"
import { ProductRepo } from "../repo/productRepo"
import { productMock } from "../domain/productMock"

describe("buildProductCommands", () => {
  describe("create", () => {
    it("creates a product", async () => {
      const thespian = new Thespian()
      const productActions = thespian.mock<ProductActions>()
      const productRepo = thespian.mock<ProductRepo>()
      const commands = buildProductCommands({ productActions: productActions.object, productRepo: productRepo.object })

      const product = productMock()

      productActions.setup((f) => f.create(product)).returns(() => product)
      productRepo.setup((f) => f.saveCreated(product))

      await commands.create(product)
    })
  })
})
