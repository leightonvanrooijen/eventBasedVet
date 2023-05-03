import { procedureMock } from "./procedure.mock"
import { buildProcedureActions, makeProcedure } from "./procedure"
import { consumedGoodMock } from "./consumedGoodMock"
import { buildProcedureEvents } from "../infrastructure/repo/events/procedureEvents"
import { faker } from "@faker-js/faker"
import { Procedure, ProcedureStatuses } from "./procedure.types"

describe("procedure", () => {
  describe("makeProcedure", () => {
    it("returns a procedure", () => {
      const fakeProcedure = procedureMock()

      const procedure = makeProcedure(fakeProcedure)

      expect(procedure).toEqual(fakeProcedure)
    })
    it("sets the goodsConsumed to an empty array if none are provided", () => {
      const fakeProcedure = procedureMock()

      const procedure = makeProcedure({
        ...fakeProcedure,
        goodsConsumed: undefined,
      })

      expect(procedure.goodsConsumed).toEqual([])
    })
    it.each([
      ["must have an ID", { id: "" }],
      ["must have an name", { name: "" }],
      ["must have an status", { status: "" as ProcedureStatuses }],
      ["must have an appointmentId", { appointmentId: "" }],
      ["must have an animalId", { animalId: "" }],
    ])("must have an ID", (message: string, input: Partial<Procedure>) => {
      const fakeProcedure = procedureMock(input)

      const procedure = () => makeProcedure(fakeProcedure)

      expect(procedure).toThrow()
    })
    it("must have an name", () => {
      const fakeProcedure = procedureMock({ name: "" })

      const procedure = () => makeProcedure(fakeProcedure)

      expect(procedure).toThrow()
    })
  })

  describe("buildProcedureActions", () => {
    const setUp = () => {
      return buildProcedureActions({
        uuid: () => "xyz",
        makeProcedure,
        events: buildProcedureEvents({ uuid: faker.datatype.uuid }),
      })
    }
    describe("create", () => {
      it("creates a procedure", () => {
        const fake = procedureMock({ status: "pending" })
        const procedureActions = setUp()
        const input = {
          name: fake.name,
          id: fake.id,
          appointmentId: fake.appointmentId,
          animalId: fake.animalId,
        }

        const { procedure } = procedureActions.create(input)

        expect(procedure).toEqual({
          ...input,
          status: "pending",
          goodsConsumed: [],
        })
      })
    })
    describe("begin", () => {
      it("sets the procedure status to active", () => {
        const fake = procedureMock({ status: "pending" })
        const procedureActions = setUp()

        const { procedure } = procedureActions.begin({ procedure: fake })

        expect(procedure.status).toEqual("active")
      })
      it("throws if it is already active", () => {
        const procedure = procedureMock({ status: "active" })
        const procedureActions = setUp()

        const updated = () =>
          procedureActions.begin({
            procedure,
          })

        expect(updated).toThrow()
      })
    })
    describe("consumeGood", () => {
      it("should add the consumed good to the goodsConsumed array if the good does not exist", () => {
        const fake = procedureMock()
        const consumedGood = consumedGoodMock()
        const procedureActions = setUp()

        const { procedure } = procedureActions.consumeGood({
          procedure: fake,
          consumedGood,
        })

        expect(procedure.goodsConsumed[2]).toEqual(consumedGood)
      })
      it("should add the quantity of the goods consumed if a matching good exists", () => {
        const consumedGood = consumedGoodMock({ quantity: 4 })
        const fake = procedureMock({
          goodsConsumed: [consumedGoodMock(), consumedGood],
        })

        const procedureActions = setUp()

        const { procedure } = procedureActions.consumeGood({
          procedure: fake,
          consumedGood,
        })

        expect(procedure.goodsConsumed[1].quantity).toEqual(8)
        expect(procedure.goodsConsumed[1].goodId).toEqual(consumedGood.goodId)
      })
    })
    describe("complete", () => {
      it("should complete a procedure", () => {
        const fake = procedureMock({ status: "active" })
        const procedureActions = setUp()

        const { procedure } = procedureActions.complete({ procedure: fake })

        expect(procedure.status).toEqual("complete")
      })
      it("cannot complete a already complete procedure", () => {
        const procedure = procedureMock({ status: "complete" })
        const procedureActions = setUp()

        const completed = () => procedureActions.complete({ procedure })

        expect(completed).toThrow()
      })
    })
  })
})
