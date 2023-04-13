import { ChangeEvent } from "./changeEvent.types"
import { EventBus } from "../events/eventBus.types"
import { buildTestEventBus } from "../events/eventBus"
import { isVersioningIncremental } from "./isVersioningIncremental"
import { getCurrentVersion } from "./getCurrentVersion"

export type EventDb<Event extends Record<string, any>> = {
  saveEvents(events: Event[]): Promise<void>
  getEvents(id: string): Promise<Event[]>
}

export type EventStore<Event extends ChangeEvent<any>> = Record<string, Event[]>

const afterSave = () => {}

export const buildTestEventDb = <Event extends ChangeEvent<any>>({
  eventBus = buildTestEventBus(),
  store = {},
}: {
  eventBus?: EventBus
  store?: EventStore<Event>
} = {}): EventDb<Event> => {
  return {
    saveEvents: async (events) => {
      const id = events[0].aggregateId

      const currentVersion = getCurrentVersion(store[id])
      if (!isVersioningIncremental(currentVersion, events))
        throw new Error(`Event versions must be incremental ${currentVersion} ${events[0].version}`)

      if (!aggregateExistsInStore(store, id)) {
        store[id] = events
        await eventBus.processEvents(events)
        return
      }

      store[id] = [...store[id], ...events]
      await eventBus.processEvents(events)

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
