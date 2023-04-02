import { Procedure } from "./procedure"
import { faker } from "@faker-js/faker"
import { consumedGoodMocks } from "./consumedGoodMock"

export const procedureMock = (overrides?: Partial<Procedure>): Procedure => {
  return {
    id: faker.datatype.uuid(),
    name: faker.animal.cat(),
    goodsConsumed: consumedGoodMocks(2),
    type: "procedure",
    status: faker.helpers.arrayElement(["active", "complete"]),
    ...overrides,
  }
}
