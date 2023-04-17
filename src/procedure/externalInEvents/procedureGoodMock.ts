import { ProcedureGood } from "./procedureGood"
import { faker } from "@faker-js/faker"

export const procedureGoodMock = (overrides?: Partial<ProcedureGood>): ProcedureGood => {
  return {
    id: faker.datatype.uuid(),
    name: faker.commerce.productName(),
    type: "product",
    ...overrides,
  }
}
