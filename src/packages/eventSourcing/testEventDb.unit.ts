import { buildTestEventDb } from "./testEventDb"
import { mockChangeEvents } from "./changeEvent.mock"
import { buildEventBroker } from "../events/eventBroker"
import { ChangeEvent } from "./changeEvent.types"

const setUp = (defaultStore, eventBroker = buildEventBroker()) => {
  const testEventDb = buildTestEventDb({ eventBroker, store: defaultStore })

  return { testEventDb }
}

const aggregateId = "123"
const overwrites: Partial<ChangeEvent<any>>[] = [
  { eventId: 1, aggregateId },
  { eventId: 2, aggregateId },
]

describe("buildTestEventDb", () => {
  describe("saveEvents", () => {
    it("creates and save events to the DB matching using id provided if one does not exist", async () => {
      const Db = {}
      const changeEvents = mockChangeEvents(2, overwrites)
      const { testEventDb } = setUp(Db)

      await testEventDb.saveEvents(changeEvents)

      expect(Db[aggregateId]).toEqual(changeEvents)
    })
    it("appends events to the DB matching the id provided if one exists", async () => {
      const changeEvents = mockChangeEvents(2, [
        { eventId: 1, aggregateId },
        { eventId: 2, aggregateId },
      ])
      const changeEventsToAdd = mockChangeEvents(2, [
        { eventId: 3, aggregateId },
        { eventId: 4, aggregateId },
      ])
      const Db = { [aggregateId]: changeEvents }
      const { testEventDb } = setUp(Db)

      await testEventDb.saveEvents(changeEventsToAdd)

      expect(Db[aggregateId]).toEqual([...changeEvents, ...changeEventsToAdd])
    })
    it("calls the event bus processEvents with the saved events", async () => {
      const processEvents = jest.fn()
      const changeEvents = mockChangeEvents(2, overwrites)
      const { testEventDb } = setUp({}, { registerHandler: jest.fn(), processEvents })

      await testEventDb.saveEvents(changeEvents)

      expect(processEvents).toHaveBeenCalledWith(changeEvents)
    })
    it("throws if the eventId not incremental", async () => {
      const changeEventsToAdd = mockChangeEvents(2, [
        { eventId: 3, aggregateId },
        { eventId: 4, aggregateId },
      ])
      const Db = {}
      const { testEventDb } = setUp(Db)

      const save = async () => testEventDb.saveEvents(changeEventsToAdd)

      await expect(save).rejects.toThrow()
    })
  })
  describe("getEvents", () => {
    it("returns an array of events matching the ID provided", async () => {
      const DbData = { [aggregateId]: mockChangeEvents(2, overwrites) }
      const { testEventDb } = setUp(DbData)

      const events = await testEventDb.getEvents(aggregateId)

      expect(events).toEqual(DbData[aggregateId])
    })
    it("returns an empty array if no matching ID is found", async () => {
      const { testEventDb } = setUp({})

      const events = await testEventDb.getEvents("id")

      expect(events).toEqual([])
    })
  })
})
