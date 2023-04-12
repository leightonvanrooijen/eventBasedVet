import { buildProcedureRepo } from "./procedureRepo"
import { buildTestEventDb } from "../../packages/eventSourcing/testEventDb"
import { buildProcedureEventChecker, buildProcedureEvents } from "../events/procedureEvents"
import { buildProcedureProjector } from "../events/procedureProjector"
import { buildProcedureActions, makeProcedure } from "../domain/procedure"
import { faker } from "@faker-js/faker"
import { buildTestEventBus } from "../../packages/events/eventBus"

describe("buildProcedureRepo", () => {
  describe("get", () => {
    const db = buildTestEventDb()
    const procedureEvents = buildProcedureEvents()
    const procedureActions = buildProcedureActions({ uuid: faker.datatype.uuid, makeProcedure })
    const procedureEventsChecker = buildProcedureEventChecker()
    const externalEventBus = buildTestEventBus()
    const procedureProjector = buildProcedureProjector({ procedureActions, procedureEventsChecker })
    const repo = buildProcedureRepo({ db, procedureEvents, procedureProjector, externalEventBus })
  })
})
