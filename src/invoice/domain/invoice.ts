import { InvoiceProduct } from "./product"
import { Uuid } from "../../packages/uuid/uuid.types"

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
  orders: InvoiceOrder[]
}
export const makeInvoice = ({ id, orders }: Invoice): Invoice => {
  if (!id) throw new Error("An Invoice must contain an ID")
  if (!Array.isArray(orders)) throw new Error("An Invoice order must be an array")

  return {
    id,
    orders,
  }
}

export type InvoiceActions = ReturnType<typeof buildInvoiceActions>
export const buildInvoiceActions = ({ uuid }: { uuid: Uuid }) => {
  return {
    create: (order: InvoiceOrder) => {
      return makeInvoice({ id: uuid(), orders: [order] })
    },
  }
}
