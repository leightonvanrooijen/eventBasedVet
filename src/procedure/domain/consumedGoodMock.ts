import { ConsumedGood } from "./procedure"
import { faker } from "@faker-js/faker"
import { makeMocks } from "../../packages/test/makeMocks"

export const consumedGoodMock = (overrides?: Partial<ConsumedGood>): ConsumedGood => {
  return {
    quantity: faker.datatype.number({ min: 1, max: 100 }),
    typeOfGood: "product",
    goodId: faker.datatype.uuid(),
    ...overrides,
  }
}

export const consumedGoodMocks = makeMocks(consumedGoodMock)
