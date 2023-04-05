import { TestDB } from "../packages/db/testDB"
import { ProcedureProduct } from "./domain/product/procedureProduct"
import { buildProcedureProductRepo } from "./repo/procedureProductRepo"
import { buildProcedureExternalEventHandler } from "./externalEvents/procedureExternalEventHandler"
import { buildProcedureEventChecker, buildProcedureEvents, ProcedureEvents } from "./events/procedureEvents"
import { buildProcedureActions, makeProcedure } from "./domain/procedure"
import { buildProcedureProjector } from "./events/procedureProjector"
import { buildTestEventDb } from "../packages/eventSourcing/testEventDb"
import { buildProcedureRepo } from "./repo/procedureRepo"
import { buildProcedureCommands } from "./commands/procedureCommands"
import { v4 } from "uuid"
import { EventBus } from "../packages/events/eventBus.types"
import { buildTestEventBus } from "../packages/events/eventBus"

export const buildProcedureService = ({ externalEventBus }: { externalEventBus: EventBus }) => {
  const internalEventBus = buildTestEventBus()

  const procedureProductDb = new TestDB<ProcedureProduct>([], "id")
  const procedureProductRepo = buildProcedureProductRepo({ db: procedureProductDb })
  const procedureExternalEventHandler = buildProcedureExternalEventHandler({ procedureProductRepo })

  const procedureEvents = buildProcedureEvents()
  const procedureEventsChecker = buildProcedureEventChecker()
  const procedureActions = buildProcedureActions({ uuid: v4, makeProcedure })
  const procedureProjector = buildProcedureProjector({ procedureActions, procedureEventsChecker })
  const procedureDb = buildTestEventDb<ProcedureEvents>({ eventBus: internalEventBus })
  const procedureRepo = buildProcedureRepo({ db: procedureDb })

  const procedureCommands = buildProcedureCommands({
    procedureEvents,
    procedureProjector,
    procedureProductRepo,
    procedureRepo,
    procedureActions,
    externalEventBus,
  })

  externalEventBus.registerHandler(procedureExternalEventHandler)

  return { procedureCommands, internalEventBus, procedureProductDb, procedureDb }
}
