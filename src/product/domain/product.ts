import { Uuid } from "../../packages/uuid/uuid.types"

export type Product = { id: string; name: string; price: number }
export type MakeProductInput = Product
export const makeProduct = ({ id, name, price }: MakeProductInput): Product => {
  if (!name) throw new Error("A product must have a name")

  return {
    id,
    name,
    price,
  }
}

export type ProductActions = ReturnType<typeof buildProductActions>
export const buildProductActions = ({ uuid }: { uuid: Uuid }) => {
  return {
    create: ({ name, price }: { name: string; price: number }) => {
      // Add formatting to price
      return makeProduct({ id: uuid(), name, price })
    },
  }
}
