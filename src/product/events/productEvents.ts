import { ChangeEvent } from "../../packages/eventSourcing/changeEvent.types"
import { Product } from "../domain/product"

export const ProductCreatedEventType = "productCreatedEvent"
export type ProductCreatedEvent = ChangeEvent<{ name: string; price: number }>

export type ProductEvents = ProductCreatedEvent
export type ProductEventsMaker = ReturnType<typeof buildProductEvents>
export const buildProductEvents = () => {
  return {
    created: (product: Product): ProductCreatedEvent => {
      return {
        version: 1,
        type: ProductCreatedEventType,
        aggregateId: product.id,
        date: Date.now().toString(),
        data: {
          name: product.name,
          price: product.price,
        },
      }
    },
  }
}
