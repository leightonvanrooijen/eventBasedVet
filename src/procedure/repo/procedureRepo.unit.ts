import { buildProcedureRepo } from "./procedureRepo"
import { buildTestEventDb } from "../../packages/eventSourcing/testEventDb"
import {
  buildProcedureEvents,
  ExternalProcedureCompletedEventType,
  GoodsConsumedOnProcedureEventType,
  ProcedureBeganEventType,
  ProcedureCompletedEventType,
} from "../internalEvents/procedureEvents"
import { ProcedureHydrator } from "../internalEvents/procedureHydrator"
import { assertThat, match } from "mismatched"
import { procedureMock } from "../domain/procedureMock"
import { consumedGoodMock } from "../domain/consumedGoodMock"
import { Thespian } from "thespian"
import { pipe } from "ramda"
import { internalProcedureMockEvents } from "../internalEvents/procedureEventMocks"
import { hydrationMock } from "../internalEvents/hydrationMock"
import { EventBus } from "../../packages/events/eventBus.types"

const setUp = (store = {}) => {
  const thespian = new Thespian()
  const db = buildTestEventDb({ store })
  const procedureEvents = buildProcedureEvents()
  const externalEventBus = thespian.mock<EventBus>()
  const procedureHydrator = thespian.mock<ProcedureHydrator>()
  const repo = buildProcedureRepo({
    db,
    procedureEvents,
    procedureHydrator: procedureHydrator.object,
    externalEventBus: externalEventBus.object,
  })

  return { repo, procedureHydrator, externalEventBus }
}
describe("buildProcedureRepo", () => {
  describe("get", () => {
    it("returns a hydrated procedure", async () => {
      const events = pipe(
        internalProcedureMockEvents.addBegan,
        internalProcedureMockEvents.addGoodsConsumed,
        internalProcedureMockEvents.addCompleted,
      )([])
      const mockHydratedProcedure = hydrationMock(procedureMock())

      const { repo, procedureHydrator } = setUp(internalProcedureMockEvents.adaptToEventStore(events))

      procedureHydrator.setup((f) => f.hydrate(events)).returns(() => mockHydratedProcedure)

      const hydratedProcedure = await repo.get(events[0].aggregateId)

      assertThat(hydratedProcedure).is(mockHydratedProcedure)
    })
  })
  describe("saveProcedureBegan", () => {
    it("saves a procedure began event", async () => {
      const store = {}
      const procedure = procedureMock()
      const { repo } = setUp(store)

      await repo.saveProcedureBegan(procedure)
      const savedEventType = store[procedure.id][0].type

      assertThat(savedEventType).is(ProcedureBeganEventType)
    })
  })
  describe("saveGoodConsumed", () => {
    it("saves a good consumed event", async () => {
      const store = {}
      const procedure = procedureMock()
      const mockHydratedProcedure = hydrationMock(procedure, { eventId: 0 })
      const consumedGood = consumedGoodMock()
      const { repo } = setUp(store)

      await repo.saveGoodConsumed(mockHydratedProcedure, consumedGood)
      const savedEventType = store[procedure.id][0].type

      assertThat(savedEventType).is(GoodsConsumedOnProcedureEventType)
    })
  })
  describe("saveProcedureCompleted", () => {
    it("saves a procedure completed event", async () => {
      const store = {}
      const procedure = procedureMock()
      const mockHydratedProcedure = hydrationMock(procedure, { eventId: 0 })
      const { repo, externalEventBus } = setUp(store)

      externalEventBus.setup((f) => f.processEvents(match.any()))

      await repo.saveProcedureCompleted(procedure, mockHydratedProcedure)
      const savedEventType = store[procedure.id][0].type

      assertThat(savedEventType).is(ProcedureCompletedEventType)
    })
    it("fires a external procedure completed event", async () => {
      const store = {}
      const procedure = procedureMock()
      const mockHydratedProcedure = hydrationMock(procedure, { eventId: 0 })
      const { repo, externalEventBus } = setUp(store)

      externalEventBus.setup((f) => f.processEvents([match.obj.has({ type: ExternalProcedureCompletedEventType })]))

      await repo.saveProcedureCompleted(procedure, mockHydratedProcedure)
    })
  })
})
