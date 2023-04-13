import { mockChangeEvents } from "./changeEvent.mock"
import { getCurrentVersion } from "./getCurrentVersion"
import { assertThat } from "mismatched"

describe("getCurrentVersion", () => {
  it("returns the version of the last event in the array", () => {
    const events = mockChangeEvents(2, [{ version: 1 }, { version: 2 }])

    const version = getCurrentVersion(events)

    assertThat(version).is(2)
  })
})
