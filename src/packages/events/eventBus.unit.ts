import { buildEventBus } from "./eventBus"
import { mockChangeEvents } from "../eventSourcing/changeEvent.mock"

describe("eventConsumer", () => {
  describe("registerHandler", () => {
    it("should add the handler onto the array", () => {
      const fakeHandler = (e) => Promise.resolve()
      const initialHandlers = []
      const eventConsumer = buildEventBus(initialHandlers)

      eventConsumer.registerHandler(fakeHandler)

      expect(initialHandlers).toEqual([fakeHandler])
    })
  })
  describe("process", () => {
    it("call each handler with the events", async () => {
      const fakeEvents = mockChangeEvents(2)
      const fakeHandler = jest.fn((e) => Promise.resolve())
      const fakeHandler2 = jest.fn((e) => Promise.resolve())
      const eventConsumer = buildEventBus()

      eventConsumer.registerHandler(fakeHandler)
      eventConsumer.registerHandler(fakeHandler2)
      await eventConsumer.processEvents(fakeEvents)

      expect(fakeHandler).toHaveBeenCalledWith(fakeEvents)
      expect(fakeHandler2).toHaveBeenCalledWith(fakeEvents)
    })
  })
})
