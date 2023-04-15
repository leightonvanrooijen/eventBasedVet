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
  const externaleventBroker = buildEventBroker()
  const { procedureCommands, internaleventBroker, procedureDb, procedureProductDb } = buildProcedureService({
    externaleventBroker,
  })
  const procedureMockGenerator = buildProcedureMockGenerator({ procedureDb, procedureProductDb })

  this.procedureService = {
    commands: procedureCommands,
    externaleventBroker,
    internaleventBroker,
    mocks: procedureMockGenerator,
  }
})

Before({ tags: "@invoice" }, async function (this: CustomWorld) {
  const externaleventBroker = buildEventBroker()

  const { invoiceCommands, invoiceHelpers, invoiceDb } = buildInvoiceService({ externaleventBroker })

  this.invoiceService = {
    commands: invoiceCommands,
    helpers: invoiceHelpers,
    db: invoiceDb,
    externaleventBroker,
  }
})
After({ tags: "@acceptance" }, async function () {})

BeforeAll(async function () {})
