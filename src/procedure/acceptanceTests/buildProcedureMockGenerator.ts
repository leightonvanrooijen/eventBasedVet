import { DataStore } from "../../packages/db/testDB"
import { ProcedureProduct } from "../domain/product/procedureProduct"
import { EventDb } from "../../packages/eventSourcing/testEventDb"
import { ProcedureEvents } from "../events/procedureEvents"
import { procedureProductMock } from "../domain/product/procedureProductMock"
import { ProcedureBeganEvent } from "../events/procedureEvents"
import { procedureBeganEventMock } from "../events/procedureEventMocks"

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
    beginProcedure: async (overrides?: Partial<ProcedureBeganEvent>) => {
      const createdEvent = procedureBeganEventMock(overrides)
      await procedureDb.saveEvents([createdEvent])
    },
  }
}
