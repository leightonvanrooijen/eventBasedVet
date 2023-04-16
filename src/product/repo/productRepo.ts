import { ChangeEvent } from "../../packages/eventSourcing/changeEvent.types"
import { EventDb } from "../../packages/eventSourcing/testEventDb"
import { ProductEventsMaker } from "./events/productEvents"
import { EventBroker } from "../../packages/events/eventBroker.types"
import { Product } from "../domain/product"

export type ProductRepo = ReturnType<typeof buildProductRepo>

type ProductEvent = ChangeEvent<any>
export const buildProductRepo = ({
  db,
  productEvents,
  externalEventBroker,
}: {
  db: EventDb<ProductEvent>
  productEvents: ProductEventsMaker
  externalEventBroker: EventBroker
}) => {
  return {
    saveCreated: async (product: Product): Promise<void> => {
      const event = productEvents.created(product)
      await db.saveEvents([event])
      await externalEventBroker.process([event])
    },
    get: async (aggregateId: string): Promise<ProductEvent[]> => {
      return db.getEvents(aggregateId)
    },
  }
}
