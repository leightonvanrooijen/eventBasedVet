import { ChangeEvent } from "../../packages/eventSourcing/changeEvent.types"
import { EventDb } from "../../packages/eventSourcing/testEventDb"

export type ProductRepo = ReturnType<typeof buildProductRepo>

type ProductEvent = ChangeEvent<any>
export const buildProductRepo = ({ db }: { db: EventDb<ProductEvent> }) => {
  return {
    save: async (events: ProductEvent[]): Promise<void> => {
      return db.saveEvents(events)
    },
    get: async (aggregateId: string): Promise<ProductEvent[]> => {
      return db.getEvents(aggregateId)
    },
  }
}
