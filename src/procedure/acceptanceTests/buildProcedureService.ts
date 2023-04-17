import { TestDB } from "../../packages/db/testDB"
import { ProcedureProduct } from "../externalInEvents/procedureProduct"
import { buildProcedureProductRepo } from "../repo/procedureProductRepo"
import { buildProcedureExternalEventHandler } from "../externalInEvents/procedureExternalEventHandler"
import { buildProcedureEventChecker, buildProcedureEvents, ProcedureEvents } from "../repo/events/procedureEvents"
import { buildProcedureActions, makeProcedure } from "../domain/procedure"
import { buildProcedureHydrator } from "../repo/events/procedureHydrator"
import { buildTestEventDb } from "../../packages/eventSourcing/testEventDb"
import { buildProcedureRepo } from "../repo/procedureRepo"
import { buildProcedureCommands } from "../commands/procedureCommands"
import { v4 } from "uuid"
import { EventBroker } from "../../packages/events/eventBroker.types"
import { buildEventBroker } from "../../packages/events/eventBroker"

export const buildProcedureService = ({ externalEventBroker }: { externalEventBroker: EventBroker }) => {
  const internalEventBroker = buildEventBroker()

  const procedureProductDb = new TestDB<ProcedureProduct>([], "id")
  const procedureProductRepo = buildProcedureProductRepo({ db: procedureProductDb })
  const procedureExternalEventHandler = buildProcedureExternalEventHandler({
    procedureProductRepo,
    idempotencyEventFilter: (events) => Promise.resolve(events),
  })

  const procedureEvents = buildProcedureEvents({ uuid: v4 })
  const procedureEventsChecker = buildProcedureEventChecker()
  const procedureActions = buildProcedureActions({ uuid: v4, makeProcedure })
  const procedureProjector = buildProcedureHydrator({ procedureActions, procedureEventsChecker })
  const procedureDb = buildTestEventDb<ProcedureEvents>({ eventBroker: internalEventBroker })
  const procedureRepo = buildProcedureRepo({
    db: procedureDb,
    procedureHydrator: procedureProjector,
    externalEventBroker,
    procedureEvents,
  })

  const procedureCommands = buildProcedureCommands({
    procedureProductRepo,
    procedureRepo,
    procedureActions,
  })

  externalEventBroker.registerHandler(procedureExternalEventHandler)

  return { procedureCommands, internalEventBroker, procedureProductDb, procedureDb }
}
