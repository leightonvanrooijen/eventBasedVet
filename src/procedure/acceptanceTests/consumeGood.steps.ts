import { Then, When } from "@cucumber/cucumber"
import { CustomWorld } from "../../packages/acceptanceTests/world"
import { buildEventCatcher } from "./buildEventCatcher"
import { faker } from "@faker-js/faker"
import { consumedGoodMock } from "../domain/consumedGoodMock"
import { assertThat } from "mismatched"
import { GoodsConsumedOnProcedureEventType } from "../repo/events/procedureEvents"

When("a user consumes a good during a procedure", async function (this: CustomWorld) {
  this.procedureService.internalEventBroker.registerHandler(buildEventCatcher(this))

  await this.procedureService.mocks.beginProcedure({ aggregateId: this["procedure"] })
  const productId = faker.datatype.uuid()
  await this.procedureService.mocks.createProduct({ id: productId })
  const mockConsumedGood = consumedGoodMock({ goodId: productId })

  await this.procedureService.commands.consumeGood(this["procedure"].id, mockConsumedGood)
})
Then("the good is consumed", function () {
  assertThat(this["events"][2].type).is(GoodsConsumedOnProcedureEventType)
})
