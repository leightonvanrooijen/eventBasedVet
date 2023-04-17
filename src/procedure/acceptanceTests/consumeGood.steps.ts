import { Then, When } from "@cucumber/cucumber"
import { CustomWorld } from "../../packages/acceptanceTests/world"
import { buildEventCatcher } from "./buildEventCatcher"
import { assertThat } from "mismatched"
import { GoodsConsumedOnProcedureEventType } from "../repo/events/procedureEvents"

When("a user consumes a good during a procedure", async function (this: CustomWorld) {
  this.procedureService.internalEventBroker.registerHandler(buildEventCatcher(this))

  await this.procedureService.helpers.consumeGood(this["procedure"].id)
})
Then("the good is consumed", function () {
  assertThat(this["events"][0].type).is(GoodsConsumedOnProcedureEventType)
})
