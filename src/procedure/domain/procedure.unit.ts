import { procedureMock } from "./procedureMock"
import { buildProcedureActions, makeProcedure } from "./procedure"
import { consumedGoodMock } from "./consumedGoodMock"

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
    it("must have an ID", () => {
      const fakeProcedure = procedureMock({ id: "" })

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
      })
    }
    describe("create", () => {
      it("should create a procedure", () => {
        const { name, goodsConsumed } = procedureMock()
        const procedureActions = setUp()

        const procedure = procedureActions.create({
          name,
          goodsConsumed,
        })

        expect(procedure).toEqual(expect.objectContaining({ name, goodsConsumed }))
      })
    })
    describe("consumeGood", () => {
      it("should add the consumed good to the goodsConsumed array if the good does not exist", () => {
        const procedure = procedureMock()
        const consumedGood = consumedGoodMock()
        const procedureActions = setUp()

        const updated = procedureActions.consumeGood({
          procedure,
          consumedGood,
        })

        expect(updated.goodsConsumed[2]).toEqual(consumedGood)
      })
      it("should add the quantity of the goods consumed if a matching good exists", () => {
        const consumedGood = consumedGoodMock({ quantity: 4 })
        const procedure = procedureMock({
          goodsConsumed: [consumedGoodMock(), consumedGood],
        })

        const procedureActions = setUp()

        const updated = procedureActions.consumeGood({
          procedure,
          consumedGood,
        })

        expect(updated.goodsConsumed[1].quantity).toEqual(8)
        expect(updated.goodsConsumed[1].goodId).toEqual(consumedGood.goodId)
      })
    })
    describe("complete", () => {
      it("should complete a procedure", () => {
        const procedure = procedureMock({ status: "active" })
        const procedureActions = setUp()

        const completed = procedureActions.complete({ procedure })

        expect(completed.status).toEqual("complete")
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