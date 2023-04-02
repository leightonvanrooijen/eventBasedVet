import { Product } from "./procedure"
import { faker } from "@faker-js/faker"

export const productMock = (overrides?: Partial<Product>): Product => {
  return {
    id: faker.datatype.uuid(),
    name: faker.music.songName(),
    type: "product",
    ...overrides,
  }
}
