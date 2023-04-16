import { ChangeEvent } from "../../packages/eventSourcing/changeEvent.types"
import { Product } from "../domain/product"
import { faker } from "@faker-js/faker"

export const ProductCreatedEventType = "productCreatedEvent"
export type ProductCreatedEvent = ChangeEvent<Product>

export type ProductEvents = ProductCreatedEvent
export type ProductEventsMaker = ReturnType<typeof buildProductEvents>
export const buildProductEvents = () => {
  return {
    created: (product: Product): ProductCreatedEvent => {
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
      }
    },
  }
}
