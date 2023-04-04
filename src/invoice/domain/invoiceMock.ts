import { faker } from "@faker-js/faker"
import { Invoice, InvoiceOffer, InvoiceOrder } from "./invoice"
import { InvoiceProduct } from "./product"
import { makeMocks } from "../../packages/test/makeMocks"

export const invoiceProductMock = (overrides?: Partial<InvoiceProduct>): InvoiceProduct => {
  return {
    id: faker.datatype.uuid(),
    name: faker.commerce.productName(),
    price: faker.datatype.float({ min: 0, max: 1500, precision: 2 }),
    ...overrides,
  }
}

export const invoiceProductMocks = makeMocks(invoiceProductMock)

export const invoiceOfferMock = (overrides?: Partial<InvoiceOffer>): InvoiceOffer => {
  const goodMock = invoiceProductMock()

  return {
    goodOffered: goodMock,
    typeOfGood: "product",
    price: goodMock.price,
    quantity: faker.datatype.number({ min: 1, max: 100 }),
    businessFunction: "sell", // | "lease",
  }
}

export const invoiceOfferMocks = makeMocks(invoiceOfferMock)

export const invoiceOrdersMock = (overrides?: Partial<InvoiceOrder>): InvoiceOrder => {
  return {
    type: "procedure",
    aggregateId: faker.datatype.uuid(),
    name: faker.commerce.productName(),
    offers: invoiceOfferMocks(3),
    ...overrides,
  }
}

export const invoiceOrdersMocks = makeMocks(invoiceOrdersMock)

export const invoiceMock = (overrides?: Partial<Invoice>): Invoice => {
  return {
    id: faker.datatype.uuid(),
    orders: invoiceOrdersMocks(2),
    ...overrides,
  }
}
