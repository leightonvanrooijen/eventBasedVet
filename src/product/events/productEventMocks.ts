import { ProductCreatedEvent, ProductCreatedEventType } from "./productEvents"
import { productMock } from "../domain/productMock"

export const productCreatedEventMock = (overrides?: Partial<ProductCreatedEvent>): ProductCreatedEvent => {
  const product = productMock()
  return {
    version: 1,
    type: ProductCreatedEventType,
    aggregateId: product.id,
    date: Date.now().toString(),
    data: {
      name: product.name,
      price: product.price,
    },
    ...overrides,
  }
}
