import { mockChangeEvents } from "./changeEvent.mock"
import { getCurrentEventId } from "./getCurrentEventId"
import { assertThat } from "mismatched"

describe("getCurrentVersion", () => {
  it("returns the eventId of the last event in the array", () => {
    const events = mockChangeEvents(2, [{ eventId: 1 }, { eventId: 2 }])

    const version = getCurrentEventId(events)

    assertThat(version).is(2)
  })
})
