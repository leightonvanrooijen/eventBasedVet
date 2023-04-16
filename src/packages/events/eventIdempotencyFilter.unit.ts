import { buildEventIdempotencyFilter } from "./eventIdempotencyFilter"
import { TestDB } from "../db/testDB"
import { mockChangeEvents } from "../eventSourcing/changeEvent.mock"
import { assertThat } from "mismatched"

describe("buildEventIdempotencyFilter", () => {
  it("filters events that already exist in the data store", async () => {
    const mockEvents = mockChangeEvents(5)

    const db = new TestDB([mockEvents[2]], "eventId")
    const filter = buildEventIdempotencyFilter(db)

    const filteredEvents = await filter(mockEvents)

    assertThat(filteredEvents.length).is(4)
  })
})
