import { After, Before, BeforeAll } from "@cucumber/cucumber"
import { buildProcedureService } from "../../procedure/acceptanceTests/buildProcedureService"
import { buildEventBroker } from "../events/eventBroker"
import { buildProcedureMockGenerator } from "../../procedure/acceptanceTests/buildProcedureMockGenerator"
import { CustomWorld } from "./world"
import { buildInvoiceService } from "../../invoice/acceptanceTests/buildInvoiceService"

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
  const { procedureCommands, internalEventBroker, procedureDb, procedureProductDb } = buildProcedureService({
    externalEventBroker,
  })
  const procedureMockGenerator = buildProcedureMockGenerator({ procedureDb, procedureGoodDb: procedureProductDb })

  this.procedureService = {
    commands: procedureCommands,
    externalEventBroker,
    internalEventBroker: internalEventBroker,
    mocks: procedureMockGenerator,
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
