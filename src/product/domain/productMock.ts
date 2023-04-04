import { faker } from "@faker-js/faker"
import { makeMocks } from "../../packages/test/makeMocks"
import { Product } from "./product"

export const productMock = (overrides?: Partial<Product>): Product => {
  return {
    id: faker.datatype.uuid(),
    name: faker.commerce.productName(),
    price: faker.datatype.float({ min: 0, max: 1500, precision: 2 }),
    ...overrides,
  }
}

export const productMocks = makeMocks(productMock)
