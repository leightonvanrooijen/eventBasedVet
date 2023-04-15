import { ProductActions } from "../domain/product"
import { ProductRepo } from "../repo/productRepo"
import { ProductEventsMaker } from "../events/productEvents"
import { EventBroker } from "../../packages/events/eventBroker.types"

export type ProductCommands = ReturnType<typeof buildProductCommands>
export const buildProductCommands = ({
  productActions,
  productRepo,
  productEvents,
  externaleventBroker,
}: {
  productActions: ProductActions
  productRepo: ProductRepo
  productEvents: ProductEventsMaker
  externaleventBroker: EventBroker
}) => {
  return {
    create: async (input: { name: string; price: number }) => {
      const product = productActions.create(input)
      const event = productEvents.created(product)
      await productRepo.save([event])
      await externaleventBroker.processEvents([event])
    },
  }
}
