import { Then, When } from "@cucumber/cucumber"
import { CustomWorld } from "../../packages/acceptanceTests/world"
import { ProcedureCreatedEventType } from "../events/procedureEvents"
import { procedureMock } from "../domain/procedureMock"
import { assertThat } from "mismatched"
import { buildEventCatcher } from "./buildEventCatcher"

When("a user creates a procedure", async function (this: CustomWorld) {
  this.procedureService.internalEventBus.registerHandler(buildEventCatcher(this))
  const input = procedureMock()
  await this.procedureService.commands.create({ name: input.name })
})
Then("a procedure is created", function () {
  assertThat(this["events"][0].type).is(ProcedureCreatedEventType)
})
