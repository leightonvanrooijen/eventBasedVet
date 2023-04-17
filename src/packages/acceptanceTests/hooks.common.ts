import { After, Before, BeforeAll } from "@cucumber/cucumber"
import { buildProcedureService } from "../../procedure/acceptanceTests/buildProcedureService"
import { buildEventBroker } from "../events/eventBroker"
import { CustomWorld } from "./world"
import { buildInvoiceService } from "../../invoice/acceptanceTests/buildInvoiceService"
import { buildProcedureServiceHelpers } from "../../procedure/acceptanceTests/buildProcedureServiceHelpers"

Before({ tags: "@ignore" }, async function () {
  return "skipped"
})

Before({ tags: "@debug" }, async function () {
  this.debug = true
})

Before({ tags: "@manual" }, async function () {
  return "skipped"
})

Before({ tags: "@procedure" }, async function (this: CustomWorld) {
  const externalEventBroker = buildEventBroker()
  const { procedureCommands, internalEventBroker, procedureDb, procedureGoodDb } = buildProcedureService({
    externalEventBroker,
  })
  const procedureServiceHelpers = buildProcedureServiceHelpers({ procedureCommands, externalEventBroker })

  this.procedureService = {
    commands: procedureCommands,
    externalEventBroker,
    internalEventBroker: internalEventBroker,
    helpers: procedureServiceHelpers,
  }
})

Before({ tags: "@invoice" }, async function (this: CustomWorld) {
  const externalEventBroker = buildEventBroker()

  const { invoiceCommands, invoiceHelpers, invoiceDb } = buildInvoiceService({
    externalEventBroker: externalEventBroker,
  })

  this.invoiceService = {
    commands: invoiceCommands,
    helpers: invoiceHelpers,
    db: invoiceDb,
    externalEventBroker: externalEventBroker,
  }
})
After({ tags: "@acceptance" }, async function () {})

BeforeAll(async function () {})
