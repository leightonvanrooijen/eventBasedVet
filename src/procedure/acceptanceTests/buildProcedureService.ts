import { TestDB } from "../../packages/db/testDB"
import { ProcedureProduct } from "../domain/product/procedureProduct"
import { buildProcedureProductRepo } from "../repo/procedureProductRepo"
import { buildProcedureExternalEventHandler } from "../externalEvents/procedureExternalEventHandler"
import { buildProcedureEventChecker, buildProcedureEvents, ProcedureEvents } from "../internalEvents/procedureEvents"
import { buildProcedureActions, makeProcedure } from "../domain/procedure"
import { buildProcedureHydrator } from "../internalEvents/procedureHydrator"
import { buildTestEventDb } from "../../packages/eventSourcing/testEventDb"
import { buildProcedureRepo } from "../repo/procedureRepo"
import { buildProcedureCommands } from "../commands/procedureCommands"
import { v4 } from "uuid"
import { EventBroker } from "../../packages/events/eventBroker.types"
import { buildEventBroker } from "../../packages/events/eventBroker"

export const buildProcedureService = ({ externaleventBroker }: { externaleventBroker: EventBroker }) => {
  const internaleventBroker = buildEventBroker()

  const procedureProductDb = new TestDB<ProcedureProduct>([], "id")
  const procedureProductRepo = buildProcedureProductRepo({ db: procedureProductDb })
  const procedureExternalEventHandler = buildProcedureExternalEventHandler({ procedureProductRepo })

  const procedureEvents = buildProcedureEvents()
  const procedureEventsChecker = buildProcedureEventChecker()
  const procedureActions = buildProcedureActions({ uuid: v4, makeProcedure })
  const procedureProjector = buildProcedureHydrator({ procedureActions, procedureEventsChecker })
  const procedureDb = buildTestEventDb<ProcedureEvents>({ eventBroker: internaleventBroker })
  const procedureRepo = buildProcedureRepo({
    db: procedureDb,
    procedureHydrator: procedureProjector,
    externaleventBroker,
    procedureEvents,
  })

  const procedureCommands = buildProcedureCommands({
    procedureProductRepo,
    procedureRepo,
    procedureActions,
  })

  externaleventBroker.registerHandler(procedureExternalEventHandler)

  return { procedureCommands, internaleventBroker, procedureProductDb, procedureDb }
}
