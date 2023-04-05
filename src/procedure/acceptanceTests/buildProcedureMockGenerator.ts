import { DataStore } from "../../packages/db/testDB"
import { ProcedureProduct } from "../domain/product/procedureProduct"
import { EventDb } from "../../packages/eventSourcing/testEventDb"
import { ProcedureCreatedEvent, ProcedureEvents } from "../events/procedureEvents"
import { procedureProductMock } from "../domain/product/procedureProductMock"
import { procedureCreatedEventMock } from "../events/procedureEventMocks"

export type ProcedureMockGenerator = ReturnType<typeof buildProcedureMockGenerator>
export const buildProcedureMockGenerator = ({
  procedureDb,
  procedureProductDb,
}: {
  procedureDb: EventDb<ProcedureEvents>
  procedureProductDb: DataStore<ProcedureProduct>
}) => {
  return {
    createProduct: async (overrides?: Partial<ProcedureProduct>) => {
      const mockProduct = procedureProductMock(overrides)
      await procedureProductDb.create(mockProduct)
    },
    createProcedure: async (overrides?: Partial<ProcedureCreatedEvent>) => {
      const createdEvent = procedureCreatedEventMock(overrides)
      await procedureDb.saveEvents([createdEvent])
    },
  }
}
