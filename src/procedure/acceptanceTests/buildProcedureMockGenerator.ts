import { DataStore } from "../../packages/db/testDB"
import { EventDb } from "../../packages/eventSourcing/testEventDb"
import { ProcedureEvents } from "../repo/events/procedureEvents"
import { ProcedureBeganEvent } from "../repo/events/procedureEvents"
import { procedureBeganEventMock } from "../repo/events/procedureEventMocks"

import { procedureGoodMock } from "../externalInEvents/procedureGoodMock"
import { ProcedureGood } from "../externalInEvents/procedureExternalEventHandler"

export type ProcedureMockGenerator = ReturnType<typeof buildProcedureMockGenerator>
export const buildProcedureMockGenerator = ({
  procedureDb,
  procedureGoodDb,
}: {
  procedureDb: EventDb<ProcedureEvents>
  procedureGoodDb: DataStore<ProcedureGood>
}) => {
  return {
    createProduct: async (overrides?: Partial<ProcedureGood>) => {
      const mockProduct = procedureGoodMock(overrides)
      await procedureGoodDb.create(mockProduct)
    },
    beginProcedure: async (overrides?: Partial<ProcedureBeganEvent>) => {
      const createdEvent = procedureBeganEventMock(overrides)
      await procedureDb.saveEvents([createdEvent])
    },
  }
}
