import { DataStore } from "../db/testDB"
import { ChangeEvent } from "../eventSourcing/changeEvent.types"

export type IdempotencyEventFilter = (events: ChangeEvent<any>[]) => Promise<ChangeEvent<any>[]>

// TODO create strategies abstraction - hashing functions etc
export const buildEventIdempotencyFilter = (db: DataStore<{ eventId: string }>): IdempotencyEventFilter => {
  return async (events: ChangeEvent<any>[]): Promise<ChangeEvent<any>[]> => {
    const eventsPassed = []
    for await (const event of events) {
      const eventInDb = await db.get(event.eventId)
      if (!eventInDb) {
        eventsPassed.push(event)
        await db.create({ eventId: event.eventId })
      }
    }

    return eventsPassed
  }
}
