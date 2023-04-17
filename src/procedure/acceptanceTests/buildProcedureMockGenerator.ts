import { DataStore } from "../../packages/db/testDB"
import { ProcedureProduct } from "../externalInEvents/procedureProduct"
import { EventDb } from "../../packages/eventSourcing/testEventDb"
import { ProcedureEvents } from "../repo/events/procedureEvents"
import { procedureProductMock } from "../externalInEvents/procedureProductMock"
import { ProcedureBeganEvent } from "../repo/events/procedureEvents"
import { procedureBeganEventMock } from "../repo/events/procedureEventMocks"

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
