import { ChangeEvent } from "./changeEvent.types"
import { EventBus } from "../events/eventBus.types"
import { buildEventBus } from "../events/eventBus"

export type EventDb<Event extends Record<string, any>> = {
  saveEvents(events: Event[]): Promise<void>
  getEvents(id: string): Promise<Event[]>
}

export type EventStore<Event extends ChangeEvent<any>> = Record<string, Event[]>

const afterSave = () => {}

export const buildTestEventDb = <Event extends ChangeEvent<any>>({
  eventBus = buildEventBus(),
  defaultStore = {},
}: {
  eventBus?: EventBus
  defaultStore?: EventStore<Event>
} = {}): EventDb<Event> => {
  const bus = eventBus
  const store = defaultStore

  return {
    saveEvents: async (events) => {
      const id = events[0].aggregateId

      const currentVersion = getCurrentVersion(store[id])
      if (!isVersioningIncremental(currentVersion, events)) throw new Error("Event versions must be incremental")

      if (!aggregateExistsInStore(store, id)) {
        store[id] = events
        await bus.processEvents(events)
        return
      }

      store[id] = [...store[id], ...events]
      await bus.processEvents(events)
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

function isVersioningIncremental(currentVersion: number, events: ChangeEvent<any>[]) {
  let isCorrect = true
  events.forEach((event, index) => {
    if (currentVersion + index + 1 !== event.version) isCorrect = false
  })

  return isCorrect
}

function getCurrentVersion(eventsInStore: ChangeEvent<any>[]) {
  if (!eventsInStore) return 0

  const lastIndex = eventsInStore.length - 1
  return eventsInStore[lastIndex].version
}

// subjectCreated
// subjectDeleted
// subjectNameChanged

// competencyNameChanged
// competencyAdded
// competencyRemoved

// lessonNameChanged
// lessonAdded
// lessonRemoved
