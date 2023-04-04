import { ProductActions } from "../domain/product"
import { ProductRepo } from "../repo/productRepo"
import { ProductEventsMaker } from "../events/productEvents"
import { EventBus } from "../../packages/events/eventBus.types"

export const buildProductCommands = ({
  productActions,
  productRepo,
  productEvents,
  externalEventBus,
}: {
  productActions: ProductActions
  productRepo: ProductRepo
  productEvents: ProductEventsMaker
  externalEventBus: EventBus
}) => {
  return {
    create: async (input: { name: string; price: number }) => {
      const product = productActions.create(input)
      const event = productEvents.created(product)
      await productRepo.save([event])
      await externalEventBus.processEvents([event])
    },
  }
}
