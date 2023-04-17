import { faker } from "@faker-js/faker"
import { consumedGoodMocks } from "./consumedGoodMock"
import { makeMocks } from "../../packages/test/makeMocks"
import { Procedure } from "./procedure"

export const procedureMock = (overrides?: Partial<Procedure>): Procedure => {
  return {
    id: faker.datatype.uuid(),
    name: faker.animal.cat(),
    goodsConsumed: consumedGoodMocks(2),
    type: "procedure",
    status: faker.helpers.arrayElement(["active", "complete"]),
    appointmentId: faker.datatype.uuid(),
    animalId: faker.datatype.uuid(),
    ...overrides,
  }
}

export const procedureMocks = makeMocks(procedureMock)
