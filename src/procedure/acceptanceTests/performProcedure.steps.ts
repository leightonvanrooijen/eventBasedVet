import { Given, Then, When } from "@cucumber/cucumber"
import { CustomWorld } from "../../packages/acceptanceTests/world"
import { buildEventCatcher } from "./buildEventCatcher"
import { assertThat } from "mismatched"
import {
  GoodsConsumedOnProcedureEventType,
  ProcedureBeganEventType,
  ProcedureCompletedEventType,
  ProcedureCreatedEventType,
} from "../repo/events/procedureEvents"
import { procedureMock } from "../domain/procedureMock"

Given("a vet is preforming a procedure", async function (this: CustomWorld) {
  this["procedure"] = procedureMock()
  await this.procedureService.helpers.setUpPreformingProcedure({ id: this["procedure"].id })
})

When("the vet consumes a good", async function (this: CustomWorld) {
  this.procedureService.internalEventBroker.registerHandler(buildEventCatcher(this))

  await this.procedureService.helpers.consumeGood(this["procedure"].id)
})
When("the vet completes the procedure", async function () {
  await this.procedureService.commands.complete(this["procedure"].id)
})
Then("the procedure is completed with the consumed goods on it", function () {
  assertThat(this["events"][0].type).is(GoodsConsumedOnProcedureEventType)
  assertThat(this["events"][1].type).is(ProcedureCompletedEventType)
})

// Create procedure
When("a user creates a procedure", async function (this: CustomWorld) {
  this.procedureService.internalEventBroker.registerHandler(buildEventCatcher(this))

  await this.procedureService.helpers.createProcedure()
})
Then("the procedure is created", async function () {
  assertThat(this["events"][0].type).is(ProcedureCreatedEventType)
})

// Consume a good
When("a user consumes a good during a procedure", async function (this: CustomWorld) {
  this.procedureService.internalEventBroker.registerHandler(buildEventCatcher(this))

  await this.procedureService.helpers.consumeGood(this["procedure"].id)
})
Then("the good is consumed", function () {
  assertThat(this["events"][0].type).is(GoodsConsumedOnProcedureEventType)
})

// Begin procedure
Given("the procedure has been created", async function (this: CustomWorld) {
  this["procedure"] = await this.procedureService.helpers.createProcedure()
})

When("a vet begins the procedure", async function (this: CustomWorld) {
  this.procedureService.internalEventBroker.registerHandler(buildEventCatcher(this))
  await this.procedureService.commands.begin({ procedureId: this["procedure"].id })
})
Then("the procedure is began", function () {
  assertThat(this["events"][0].type).is(ProcedureBeganEventType)
})
