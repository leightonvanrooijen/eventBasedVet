import { TestDB } from "../../packages/db/testDB"
import { buildProcedureGoodRepo } from "../infrastructure/repo/procedureGoodRepo"
import {
  buildProcedureExternalEventHandler,
  ProcedureAnimal,
  ProcedureGood,
} from "../externalInEvents/procedureExternalEventHandler"
import {
  buildProcedureEventChecker,
  buildProcedureEvents,
  ProcedureEvents,
} from "../infrastructure/repo/events/procedureEvents"
import { buildProcedureActions, makeProcedure } from "../domain/procedure"
import { buildProcedureHydrator } from "../infrastructure/repo/events/procedureHydrator"
import { buildTestEventDb } from "../../packages/eventSourcing/testEventDb"
import { buildProcedureRepo } from "../infrastructure/repo/procedureRepo"
import { buildProcedureService } from "../application/procedureService"
import { v4 } from "uuid"
import { EventBroker } from "../../packages/events/eventBroker.types"
import { buildEventBroker } from "../../packages/events/eventBroker"
import { buildProcedureAnimalRepo } from "../infrastructure/repo/procedureAnimalRepo"

export const buildProcedureTestService = ({ externalEventBroker }: { externalEventBroker: EventBroker }) => {
  const internalEventBroker = buildEventBroker()

  const procedureGoodDb = new TestDB<ProcedureGood>([], "id")
  const procedureGoodRepo = buildProcedureGoodRepo({ db: procedureGoodDb })

  const procedureAnimalDb = new TestDB<ProcedureAnimal>([], "id")
  const procedureAnimalRepo = buildProcedureAnimalRepo({ db: procedureAnimalDb })

  const procedureExternalEventHandler = buildProcedureExternalEventHandler({
    procedureGoodRepo,
    procedureAnimalRepo,
    idempotencyEventFilter: (events) => Promise.resolve(events),
  })

  const procedureEvents = buildProcedureEvents({ uuid: v4 })
  const procedureEventsChecker = buildProcedureEventChecker()
  const procedureActions = buildProcedureActions({ uuid: v4, makeProcedure, events: procedureEvents })
  const procedureProjector = buildProcedureHydrator({
    actions: procedureActions,
    eventsChecker: procedureEventsChecker,
  })
  const procedureDb = buildTestEventDb<ProcedureEvents>({ eventBroker: internalEventBroker })

  const procedureRepo = buildProcedureRepo({
    db: procedureDb,
    procedureHydrator: procedureProjector,
  })

  const procedureCommands = buildProcedureService({
    procedureGoodRepo,
    procedureRepo,
    procedureActions,
    procedureAnimalRepo,
    events: procedureEvents,
    eventBroker: externalEventBroker,
  })

  externalEventBroker.registerHandler(procedureExternalEventHandler)

  return { procedureCommands, internalEventBroker, procedureGoodDb, procedureDb }
}
