import { buildExternalEventHandler } from "./buildExternalEventHandler"
import { buildEventIdempotencyFilter } from "./eventIdempotencyFilter"
import { TestDB } from "../db/testDB"
import { Thespian } from "thespian"
import { mockChangeEvent } from "../eventSourcing/changeEvent.mock"

let thespian: Thespian
const setUp = () => {
  const db = new TestDB<{ eventId: string }>([], "eventId")
  thespian = new Thespian()
  const eventHandler = thespian.mock<(event) => Promise<void>>()
  const externalEventHandler = buildExternalEventHandler({
    idempotencyEventFilter: buildEventIdempotencyFilter(db),
    eventHandler: eventHandler.object,
  })

  return { eventHandler, externalEventHandler }
}

afterEach(() => thespian.verify())

describe("buildExternalEventHandler", () => {
  it("calls the handler with the received events in order of the array", async () => {
    const { eventHandler, externalEventHandler } = setUp()

    const firstEvent = mockChangeEvent()
    const secondEvent = mockChangeEvent()
    const thirdEvent = mockChangeEvent()

    eventHandler.setup((f) => f(firstEvent))
    eventHandler.setup((f) => f(secondEvent))
    eventHandler.setup((f) => f(thirdEvent))

    await externalEventHandler([firstEvent, secondEvent, thirdEvent])
  })
  it("removes any events that have already been received", async () => {
    const { eventHandler, externalEventHandler } = setUp()

    const firstEvent = mockChangeEvent()
    const secondEvent = mockChangeEvent()
    const thirdEvent = mockChangeEvent()

    eventHandler.setup((f) => f(firstEvent)).times(1)
    eventHandler.setup((f) => f(secondEvent))
    eventHandler.setup((f) => f(thirdEvent))

    await externalEventHandler([firstEvent, firstEvent, secondEvent, thirdEvent, firstEvent])
  })
})
