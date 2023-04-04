import { invoiceMock, invoiceOrdersMock } from "./invoiceMock"
import { buildInvoiceActions, makeInvoice } from "./invoice"
import { assertThat } from "mismatched"

describe("invoice", () => {
  describe("makeInvoice", () => {
    it("returns a invoice", () => {
      const fakeInvoice = invoiceMock()

      const invoice = makeInvoice(fakeInvoice)

      expect(invoice).toEqual(fakeInvoice)
    })
    it("must have an ID", () => {
      const fakeInvoice = invoiceMock({ id: "" })

      const invoice = () => makeInvoice(fakeInvoice)

      expect(invoice).toThrow()
    })
    it("orders must be an array (allowed to be empty)", () => {
      const fakeInvoice = invoiceMock({ orders: undefined })

      const invoice = () => makeInvoice(fakeInvoice)

      expect(invoice).toThrow()
    })
  })
  describe("buildInvoiceActions", () => {
    describe("create", () => {
      it("creates an invoice", () => {
        const id = "123"
        const invoiceActions = buildInvoiceActions({ uuid: () => id })
        const order = invoiceOrdersMock()

        const invoice = invoiceActions.create(order)

        assertThat(invoice).is({
          id,
          orders: [order],
        })
      })
    })
  })
})
