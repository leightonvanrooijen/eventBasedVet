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
import { EventBroker } from "../../packages/events/eventBroker.types"

const setUp = (store = {}) => {
  const thespian = new Thespian()
  const db = buildTestEventDb({ store })
  const procedureEvents = buildProcedureEvents({ uuid: () => "123" })
  const externalEventBroker = thespian.mock<EventBroker>()
  const procedureHydrator = thespian.mock<ProcedureHydrator>()
  const repo = buildProcedureRepo({
    db,
    procedureEvents,
    procedureHydrator: procedureHydrator.object,
    externalEventBroker: externalEventBroker.object,
  })

  return { repo, procedureHydrator, externalEventBroker }
}
describe("buildProcedureRepo", () => {
  describe("get", () => {
    it("returns a hydrated procedure", async () => {
      const events = pipe(
        internalProcedureMockEvents.addBegan,
        internalProcedureMockEvents.addGoodsConsumed,
        internalProcedureMockEvents.addCompleted,
      )([])
      const mockHydratedProcedure = procedureMock()

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
      const consumedGood = consumedGoodMock()
      const { repo } = setUp(store)

      await repo.saveGoodConsumed(procedure, consumedGood)
      const savedEventType = store[procedure.id][0].type

      assertThat(savedEventType).is(GoodsConsumedOnProcedureEventType)
    })
  })
  describe("saveProcedureCompleted", () => {
    it("saves a procedure completed event", async () => {
      const store = {}
      const procedure = procedureMock()
      const { repo, externalEventBroker } = setUp(store)

      externalEventBroker.setup((f) => f.process(match.any()))

      await repo.saveProcedureCompleted(procedure)
      const savedEventType = store[procedure.id][0].type

      assertThat(savedEventType).is(ProcedureCompletedEventType)
    })
    it("fires a external procedure completed event", async () => {
      const store = {}
      const procedure = procedureMock()
      const { repo, externalEventBroker } = setUp(store)

      externalEventBroker.setup((f) => f.process([match.obj.has({ type: ExternalProcedureCompletedEventType })]))

      await repo.saveProcedureCompleted(procedure)
    })
  })
})
