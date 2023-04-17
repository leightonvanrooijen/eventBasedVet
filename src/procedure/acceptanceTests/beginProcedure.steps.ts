import { Given, Then, When } from "@cucumber/cucumber"
import { CustomWorld } from "../../packages/acceptanceTests/world"
import { assertThat } from "mismatched"
import { buildEventCatcher } from "./buildEventCatcher"
import { ProcedureBeganEventType } from "../repo/events/procedureEvents"

Given("the procedure has been created", async function (this: CustomWorld) {
  this["procedure"] = await this.procedureService.helpers.createProcedure()
})

When("a user begins the procedure", async function (this: CustomWorld) {
  this.procedureService.internalEventBroker.registerHandler(buildEventCatcher(this))
  await this.procedureService.commands.begin({ procedureId: this["procedure"].id })
})
Then("the procedure is began", function () {
  assertThat(this["events"][0].type).is(ProcedureBeganEventType)
})
