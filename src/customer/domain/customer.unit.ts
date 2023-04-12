import { buildCustomerActions, CustomerTypes, makeCustomer } from "./customer"
import { customerMock } from "./customerMock"
import { assertThat } from "mismatched"

describe("customer", () => {
  describe("makeCustomer", () => {
    it("returns a customer", () => {
      const input = customerMock()
      const customer = makeCustomer({ ...input })

      assertThat(customer).is({
        id: input.id,
        name: input.name,
        type: input.type,
        customerId: input.customerId,
      })
    })

    it("must have a name", () => {
      const input = customerMock()
      const customer = () => makeCustomer({ ...input, name: "" })

      assertThat(customer).throws()
    })
    it("must have a id", () => {
      const input = customerMock()
      const customer = () => makeCustomer({ ...input, id: "" })

      assertThat(customer).throws()
    })
    it("must have a type", () => {
      const input = customerMock()
      const customer = () => makeCustomer({ ...input, type: "" as CustomerTypes })

      assertThat(customer).throws()
    })
    it("must have a customer Id", () => {
      const input = customerMock()
      const customer = () => makeCustomer({ ...input, customerId: "" })

      assertThat(customer).throws()
    })
  })
  describe("buildCustomerActions", () => {
    describe("create", () => {
      it("creates a customer", () => {
        const customerActions = buildCustomerActions({ uuid: () => "123" })
        const input = customerMock()

        const customer = customerActions.create(input)

        assertThat(customer).is({
          id: "123",
          name: input.name,
          customerId: input.customerId,
          type: input.type,
        })
      })
    })
  })
})
