import { buildExternalCustomerEvents, ExternalCustomerCreatedEventType } from "./externalCustomerEvents"
import { faker } from "@faker-js/faker"
import { customerMock } from "../domain/customerMock"
import { assertThat, match } from "mismatched"

describe("buildExternalCustomerEvents", () => {
  describe("created", () => {
    it("returns a external customer created event", () => {
      const id = faker.datatype.uuid()
      const externalEvents = buildExternalCustomerEvents({ uuid: () => id })
      const data = customerMock()

      const event = externalEvents.created(data)

      assertThat(event).is({
        eventId: id,
        type: ExternalCustomerCreatedEventType,
        aggregateId: data.id,
        data,
        date: match.any(),
      })
    })
  })
})
