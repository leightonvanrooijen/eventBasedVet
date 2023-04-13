import { isVersioningIncremental } from "./isVersioningIncremental"
import { mockChangeEvent } from "./changeEvent.mock"
import { assertThat } from "mismatched"

describe("isVersioningIncremental", () => {
  it("returns true if the versioning is incremental", () => {
    const isIncremental = isVersioningIncremental(1, [mockChangeEvent({ version: 2 }), mockChangeEvent({ version: 3 })])

    assertThat(isIncremental).is(true)
  })
  it("returns false if the versioning is NOT incremental", () => {
    const isIncremental = isVersioningIncremental(2, [mockChangeEvent({ version: 2 })])

    assertThat(isIncremental).is(false)
  })
})
