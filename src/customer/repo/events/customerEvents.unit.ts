import { buildCustomerEvents, ExternalCustomerCreatedEventType } from "./customerEvents"
import { faker } from "@faker-js/faker"
import { customerMock } from "../../domain/customerMock"
import { assertThat, match } from "mismatched"

describe("buildExternalCustomerEvents", () => {
  describe("created", () => {
    it("returns a external customer externalCreated event", () => {
      const id = faker.datatype.uuid()
      const externalEvents = buildCustomerEvents({ uuid: () => id })
      const data = customerMock()

      const event = externalEvents.externalCreated(data)

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
