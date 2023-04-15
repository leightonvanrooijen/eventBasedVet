import { Then, When } from "@cucumber/cucumber"
import { CustomWorld } from "../../packages/acceptanceTests/world"
import { procedureMock } from "../domain/procedureMock"
import { assertThat } from "mismatched"
import { buildEventCatcher } from "./buildEventCatcher"
import { ProcedureBeganEventType } from "../internalEvents/procedureEvents"

When("a user begins a procedure", async function (this: CustomWorld) {
  this.procedureService.internaleventBroker.registerHandler(buildEventCatcher(this))
  const input = procedureMock()
  await this.procedureService.commands.begin({ name: input.name })
})
Then("a procedure is began", function () {
  assertThat(this["events"][0].type).is(ProcedureBeganEventType)
})
