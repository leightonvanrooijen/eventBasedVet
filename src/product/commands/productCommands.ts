import { ProductActions } from "../domain/product"
import { ProductRepo } from "../repo/productRepo"
import { ProductEventsMaker } from "../events/productEvents"
import { EventBroker } from "../../packages/events/eventBroker.types"

export type ProductCommands = ReturnType<typeof buildProductCommands>
export const buildProductCommands = ({
  productActions,
  productRepo,
  productEvents,
  externalEventBroker,
}: {
  productActions: ProductActions
  productRepo: ProductRepo
  productEvents: ProductEventsMaker
  externalEventBroker: EventBroker
}) => {
  return {
    create: async (input: { name: string; price: number }) => {
      const product = productActions.create(input)
      const event = productEvents.created(product)
      await productRepo.save([event])
      await externalEventBroker.process([event])
    },
  }
}
