import { faker } from "@faker-js/faker"
import { ProcedureProduct } from "./procedureProduct"

export const procedureProductMock = (overrides: Partial<ProcedureProduct>): ProcedureProduct => {
  return {
    id: faker.datatype.uuid(),
    name: faker.commerce.productName(),
    ...overrides,
  }
}
