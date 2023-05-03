import { ChangeEvent } from "./changeEvent.types"
import { EventBroker } from "../events/eventBroker.types"
import { buildEventBroker } from "../events/eventBroker"

export type EventDb<Event extends Record<string, any>> = {
  saveEvents(events: Event[]): Promise<void>
  getEvents(id: string): Promise<Event[]>
}

export type EventStore<Event extends ChangeEvent<any>> = Record<string, Event[]>

export const buildTestEventDb = <Event extends ChangeEvent<any>>({
  eventBroker = buildEventBroker(),
  store = {},
}: {
  eventBroker?: EventBroker
  store?: EventStore<Event>
} = {}): EventDb<Event> => {
  return {
    saveEvents: async (events) => {
      const aggregateId = events[0].aggregateId

      if (!aggregateExistsInStore(store, aggregateId)) {
        store[aggregateId] = events
        await eventBroker.process(events)
        return
      }

      store[aggregateId] = [...store[aggregateId], ...events]
      await eventBroker.process(events)

      return
    },
    getEvents: async (id) => {
      if (!store[id]) return []

      return store[id]
    },
  }
}

function aggregateExistsInStore(store: EventStore<any>, id: string) {
  return Boolean(store[id])
}
