import { invoiceMock, invoiceOrdersMock } from "./invoiceMock"
import { buildInvoiceActions, makeInvoice } from "./invoice"
import { assertException, assertThat, match } from "mismatched"
import { faker } from "@faker-js/faker"

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
    it("must have an customerId", () => {
      const fakeInvoice = invoiceMock({ customerId: "" })

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
        const customerId = "123"
        const invoiceActions = buildInvoiceActions(() => id)
        const order = invoiceOrdersMock()

        const invoice = invoiceActions.create(order, customerId)

        assertThat(invoice).is({
          id,
          customerId,
          orders: [order],
        })
      })
    })
    describe("addOrder", () => {
      it("adds an order to the invoice", () => {
        const invoiceActions = buildInvoiceActions(faker.datatype.uuid)
        const order = invoiceOrdersMock()
        const mockInvoice = invoiceMock()

        const invoice = invoiceActions.addOrder(mockInvoice, order)

        assertThat(invoice.orders).is(match.array.contains(order))
      })
      it("throws if the order is already on the invoice", () => {
        const invoiceActions = buildInvoiceActions(faker.datatype.uuid)
        const order = invoiceOrdersMock()
        const mockInvoice = invoiceMock({ orders: [order] })

        const invoice = () => invoiceActions.addOrder(mockInvoice, order)

        assertException(invoice)
      })
    })
  })
})
