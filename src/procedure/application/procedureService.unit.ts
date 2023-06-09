import { buildProcedureService } from "./procedureService"
import { ProcedureRepo } from "../infrastructure/repo/procedureRepo"
import { ProcedureActions } from "../domain/procedure"
import { procedureMock } from "../domain/procedure.mock"
import { ProcedureGoodRepo } from "../infrastructure/repo/procedureGoodRepo"
import { Thespian } from "thespian"
import { consumedGoodMock } from "../domain/consumedGoodMock"
import { procedureAnimalMock, procedureGoodMock } from "../externalInEvents/procedureExternalInMocks"
import { ProcedureAnimalRepo } from "../infrastructure/repo/procedureAnimalRepo"
import {
  goodsConsumedOnProcedureEventMock,
  procedureBeganEventMock,
  procedureCompletedEventMock,
  procedureCreatedEventMock,
} from "../infrastructure/repo/events/procedureEventMocks"
import { buildProcedureEvents } from "../infrastructure/repo/events/procedureEvents"
import { faker } from "@faker-js/faker"
import { EventBroker } from "../../packages/events/eventBroker.types"
import { match } from "mismatched"

let thespian: Thespian
const setUp = () => {
  thespian = new Thespian()
  const procedureRepo = thespian.mock<ProcedureRepo>()
  const procedureGoodRepo = thespian.mock<ProcedureGoodRepo>()
  const procedureAnimalRepo = thespian.mock<ProcedureAnimalRepo>()
  const procedureActions = thespian.mock<ProcedureActions>()
  const events = buildProcedureEvents({ uuid: faker.datatype.uuid })
  const eventBroker = thespian.mock<EventBroker>()

  const commands = buildProcedureService({
    procedureRepo: procedureRepo.object,
    procedureActions: procedureActions.object,
    procedureGoodRepo: procedureGoodRepo.object,
    procedureAnimalRepo: procedureAnimalRepo.object,
    events,
    eventBroker: eventBroker.object,
  })

  return { commands, procedureRepo, procedureActions, procedureGoodRepo, procedureAnimalRepo, events, eventBroker }
}
afterEach(() => thespian.verify())

describe("buildProcedureCommands", () => {
  describe("create", () => {
    it("creates a procedure", async () => {
      const procedure = procedureMock()
      const input = {
        name: procedure.name,
        id: procedure.id,
        appointmentId: procedure.appointmentId,
        animalId: procedure.animalId,
      }
      const event = procedureCreatedEventMock()
      const { commands, procedureRepo, procedureActions, procedureAnimalRepo } = setUp()

      procedureAnimalRepo.setup((f) => f.get(procedure.animalId)).returns(() => Promise.resolve(procedureAnimalMock()))
      procedureActions
        .setup((f) => f.create(input))
        .returns(() => ({
          procedure,
          event,
        }))
      procedureRepo.setup((f) => f.save([event]))

      await commands.create(input)
    })
    it("throws if the animal does not exist", async () => {
      const procedure = procedureMock()
      const input = {
        name: procedure.name,
        id: procedure.id,
        appointmentId: procedure.appointmentId,
        animalId: procedure.animalId,
      }
      const { commands, procedureAnimalRepo } = setUp()

      procedureAnimalRepo.setup((f) => f.get(procedure.animalId)).returns(() => undefined)

      const create = async () => commands.create(input)

      await expect(create).rejects.toThrow()
    })
  })
  describe("begin", () => {
    it("begins a procedure", async () => {
      const procedure = procedureMock()
      const event = procedureBeganEventMock()
      const { commands, procedureRepo, procedureActions } = setUp()

      procedureActions.setup((f) => f.begin({ procedure })).returns(() => ({ procedure, event }))
      procedureRepo.setup((f) => f.get(procedure.id)).returns(() => Promise.resolve(procedure))
      procedureRepo.setup((f) => f.save([event]))

      await commands.begin({ procedureId: procedure.id })
    })
  })
  describe("consumeGood", () => {
    it("consumes a good", async () => {
      const procedure = procedureMock()
      const consumedGood = consumedGoodMock()
      const good = procedureGoodMock()
      const event = goodsConsumedOnProcedureEventMock()
      const { commands, procedureRepo, procedureActions, procedureGoodRepo } = setUp()

      procedureGoodRepo.setup((f) => f.get(consumedGood.goodId)).returns(() => Promise.resolve(good))
      procedureRepo.setup((f) => f.get(procedure.id)).returns(() => Promise.resolve(procedure))
      procedureActions.setup((f) => f.consumeGood({ procedure, consumedGood })).returns(() => ({ procedure, event }))
      procedureRepo.setup((f) => f.save([event]))

      await commands.consumeGood(procedure.id, consumedGood)
    })
    it("throws if the good does not exist in the datastore", async () => {
      const procedure = procedureMock()
      const consumedGood = consumedGoodMock()
      const { commands, procedureGoodRepo } = setUp()

      procedureGoodRepo.setup((f) => f.get(consumedGood.goodId)).returns(() => Promise.resolve(undefined))

      const consumeGood = async () => commands.consumeGood(procedure.id, consumedGood)

      await expect(consumeGood).rejects.toThrow()
    })
  })
  describe("complete", () => {
    it("completes the procedure", async () => {
      const procedure = procedureMock()
      const event = procedureCompletedEventMock()
      const { commands, procedureRepo, procedureActions, eventBroker } = setUp()

      procedureRepo.setup((f) => f.get(procedure.id)).returns(() => Promise.resolve(procedure))
      procedureActions.setup((f) => f.complete({ procedure })).returns(() => ({ procedure, event }))
      procedureRepo.setup((f) => f.save([event]))
      eventBroker.setup((f) =>
        f.process([match.obj.has({ aggregateId: procedure.id, data: procedure, type: "procedureCompletedEvent" })]),
      )

      await commands.complete(procedure.id)
    })
  })
})
