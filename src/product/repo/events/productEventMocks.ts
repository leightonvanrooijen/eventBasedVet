import { ProductCreatedEvent, ProductCreatedEventType } from "./productEvents"
import { productMock } from "../../domain/productMock"
import { faker } from "@faker-js/faker"

export const productCreatedEventMock = (overrides?: Partial<ProductCreatedEvent>): ProductCreatedEvent => {
  const product = productMock()
  return {
    eventId: faker.datatype.uuid(),
    type: ProductCreatedEventType,
    aggregateId: product.id,
    date: Date.now().toString(),
    data: {
      id: product.id,
      name: product.name,
      price: product.price,
    },
    ...overrides,
  }
}
