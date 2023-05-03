import { faker } from "@faker-js/faker"
import { makeMocks } from "../../packages/test/makeMocks"
import { ConsumedGood } from "./procedure.types"

export const consumedGoodMock = (overrides?: Partial<ConsumedGood>): ConsumedGood => {
  return {
    quantity: faker.datatype.number({ min: 1, max: 100 }),
    typeOfGood: "product",
    goodId: faker.datatype.uuid(),
    businessFunction: "sell",
    ...overrides,
  }
}

export const consumedGoodMocks = makeMocks(consumedGoodMock)
