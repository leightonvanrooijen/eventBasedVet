import { ChangeEvent } from "./changeEvent.types"
import { EventBroker } from "../events/eventBroker.types"
import { buildEventBroker } from "../events/eventBroker"
import { isVersioningIncremental } from "./isVersioningIncremental"
import { getCurrentEventId } from "./getCurrentEventId"

export type EventDb<Event extends Record<string, any>> = {
  saveEvents(events: Event[]): Promise<void>
  getEvents(id: string): Promise<Event[]>
}

export type EventStore<Event extends ChangeEvent<any>> = Record<string, Event[]>

const afterSave = () => {}

export const buildTestEventDb = <Event extends ChangeEvent<any>>({
  eventBroker = buildEventBroker(),
  store = {},
}: {
  eventBroker?: EventBroker
  store?: EventStore<Event>
} = {}): EventDb<Event> => {
  return {
    saveEvents: async (events) => {
      const id = events[0].aggregateId

      const currentVersion = getCurrentEventId(store[id])
      if (!isVersioningIncremental(currentVersion, events))
        throw new Error(`Event versions must be incremental ${currentVersion} ${events[0].eventId}`)

      if (!aggregateExistsInStore(store, id)) {
        store[id] = events
        await eventBroker.processEvents(events)
        return
      }

      store[id] = [...store[id], ...events]
      await eventBroker.processEvents(events)

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
