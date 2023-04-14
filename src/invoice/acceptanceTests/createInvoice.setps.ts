import { Then, When } from "@cucumber/cucumber"
import { CustomWorld } from "../../packages/acceptanceTests/world"
import { assertThat } from "mismatched"

When(/^a procedure is completed$/, async function (this: CustomWorld) {
  const { product2 } = await this.invoiceService.helpers.completeProcedure()
  this["product2"] = product2
})
Then(/^a invoice is generated containing the goods consumed on the procedure$/, async function (this: CustomWorld) {
  const invoices = await this.invoiceService.db.getAll()

  const offers = invoices[0].orders[0].offers
  const good = offers[1].goodOffered

  assertThat(good).is({
    id: this["product2"].id,
    price: this["product2"].price,
    name: this["product2"].name,
  })
})
