import { ProductActions } from "../domain/product"
import { ProductRepo } from "../repo/productRepo"

export type ProductCommands = ReturnType<typeof buildProductCommands>
export const buildProductCommands = ({
  productActions,
  productRepo,
}: {
  productActions: ProductActions
  productRepo: ProductRepo
}) => {
  return {
    create: async (input: { name: string; price: number }) => {
      const product = productActions.create(input)
      await productRepo.saveCreated(product)
    },
  }
}
