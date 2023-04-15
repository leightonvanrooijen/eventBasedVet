import { ProductCreatedEvent, ProductCreatedEventType } from "./productEvents"
import { productMock } from "../domain/productMock"

export const productCreatedEventMock = (overrides?: Partial<ProductCreatedEvent>): ProductCreatedEvent => {
  const product = productMock()
  return {
    eventId: 1,
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
