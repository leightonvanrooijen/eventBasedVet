// TODO swap out mock generator for this as coupling is fine here
import { ProcedureCommands } from "../commands/procedureCommands"
import { procedureMock } from "../domain/procedureMock"
import { Procedure } from "../domain/procedure"
import { EventBroker } from "../../packages/events/eventBroker.types"
import { productCreatedEventMock } from "../../product/repo/events/productEventMocks"
import { consumedGoodMock } from "../domain/consumedGoodMock"

export type ProcedureServiceHelpers = ReturnType<typeof buildProcedureServiceHelpers>
export const buildProcedureServiceHelpers = ({
  procedureCommands,
  externalEventBroker,
}: {
  procedureCommands: ProcedureCommands
  externalEventBroker: EventBroker
}) => {
  const createProcedure = async (overrides?: Partial<Procedure>) => {
    const procedure = procedureMock(overrides)
    await procedureCommands.create({
      id: procedure.id,
      animalId: procedure.animalId,
      name: procedure.name,
      appointmentId: procedure.appointmentId,
    })

    return procedure
  }

  return {
    consumeGood: async (procedureId: string) => {
      const productCreatedEvent = productCreatedEventMock()
      await externalEventBroker.process([productCreatedEvent])

      const consumedGood = consumedGoodMock({ goodId: productCreatedEvent.aggregateId })
      await procedureCommands.consumeGood(procedureId, consumedGood)
    },
    createProcedure,
    setUpPreformingProcedure: async (overrides?: Partial<Procedure>) => {
      const procedure = await createProcedure(overrides)
      await procedureCommands.begin({ procedureId: procedure.id })

      return procedure.id
    },
  }
}
