import { Uuid } from "../../packages/uuid/uuid.types"
import { InvoiceProduct } from "../externalInEvents/invoiceExternalEventHandler"
import { append, lensProp, over } from "ramda"

export type InvoiceOffer = {
  goodOffered: InvoiceProduct
  typeOfGood: "product"
  price: number
  quantity: number
  businessFunction: "sell" // | "lease"
}

export type InvoiceOrder = {
  type: "procedure"
  aggregateId: string
  name: string
  offers: InvoiceOffer[]
}

export type Invoice = {
  id: string
  customerId: string
  orders: InvoiceOrder[]
}
export const makeInvoice = ({ id, orders, customerId }: Invoice): Invoice => {
  if (!id) throw new Error("An Invoice must contain an ID")
  if (!customerId) throw new Error("An Invoice must contain an customerId")
  if (!Array.isArray(orders)) throw new Error("An Invoice order must be an array")

  return {
    id,
    customerId,
    orders,
  }
}

export type InvoiceActions = ReturnType<typeof buildInvoiceActions>
export const buildInvoiceActions = (uuid: Uuid) => {
  return {
    create: (order: InvoiceOrder, customerId: string) => {
      return makeInvoice({ id: uuid(), customerId, orders: [order] })
    },
    addOrder: (invoice: Invoice, order: InvoiceOrder) => {
      const foundIndex = invoice.orders.findIndex((contained) => contained.aggregateId === order.aggregateId)

      if (foundIndex >= 0) throw new Error("Order is already on the invoice")

      return over(lensProp("orders"), append(order), invoice)
    },
  }
}
