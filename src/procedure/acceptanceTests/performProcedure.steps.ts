import { Given, Then, When } from "@cucumber/cucumber"
import { CustomWorld } from "../../packages/acceptanceTests/world"
import { buildEventCatcher } from "./buildEventCatcher"
import { faker } from "@faker-js/faker"
import { consumedGoodMock } from "../domain/consumedGoodMock"
import { assertThat } from "mismatched"
import { GoodsConsumedOnProcedureEventType, ProcedureCompletedEventType } from "../events/procedureEvents"

Given(/^a vet is preforming a procedure$/, async function (this: CustomWorld) {
  this["procedureId"] = faker.datatype.uuid()
  await this.procedureService.mocks.createProcedure({ aggregateId: this["procedureId"] })

  this["productId"] = faker.datatype.uuid()
  this.procedureService.internalEventBus.registerHandler(buildEventCatcher(this))
})

When(/^the vet consumes a good$/, async function (this: CustomWorld) {
  await this.procedureService.mocks.createProduct({ id: this["productId"] })
  const mockConsumedGood = consumedGoodMock({ goodId: this["productId"] })

  await this.procedureService.commands.consumeGood(this["procedureId"], mockConsumedGood)
})
When(/^the vet completes the procedure$/, async function () {
  await this.procedureService.commands.complete(this["procedureId"])
})
Then(/^the procedure is completed with the consumed goods on it$/, function () {
  assertThat(this["events"][0].type).is(GoodsConsumedOnProcedureEventType)
  assertThat(this["events"][1].type).is(ProcedureCompletedEventType)
})
