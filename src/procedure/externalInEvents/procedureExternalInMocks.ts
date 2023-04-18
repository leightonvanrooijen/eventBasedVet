import { faker } from "@faker-js/faker"
import { ProcedureAnimal, ProcedureGood } from "./procedureExternalEventHandler"

export const procedureGoodMock = (overrides?: Partial<ProcedureGood>): ProcedureGood => {
  return {
    id: faker.datatype.uuid(),
    name: faker.commerce.productName(),
    type: "product",
    ...overrides,
  }
}

export const procedureAnimalMock = (overrides?: Partial<ProcedureAnimal>): ProcedureAnimal => {
  return {
    id: faker.datatype.uuid(),
    name: faker.animal.dog(),
    type: "cat",
    ownerId: faker.datatype.uuid(),
    ...overrides,
  }
}
