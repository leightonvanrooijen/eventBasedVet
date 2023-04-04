import { Then, When } from "@cucumber/cucumber"
import { CustomWorld } from "../../packages/acceptanceTests/world"
import { ProcedureEvents } from "../events/procedureEvents"
import { procedureMock } from "../domain/procedureMock"

When("a user creates a procedure", async function (this: CustomWorld) {
  const eventHandler = async (events: ProcedureEvents[]) => {}
  this.procedureService.internalEventBus.registerHandler(eventHandler)
  const input = procedureMock()
  await this.procedureService.commands.create({ name: input.name, goodsConsumed: input.goodsConsumed })
})
Then("a procedure is created", function () {})
