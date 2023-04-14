import { After, Before, BeforeAll } from "@cucumber/cucumber"
import { buildProcedureService } from "../../procedure/acceptanceTests/buildProcedureService"
import { buildTestEventBus } from "../events/eventBus"
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
  const externalEventBus = buildTestEventBus()
  const { procedureCommands, internalEventBus, procedureDb, procedureProductDb } = buildProcedureService({
    externalEventBus,
  })
  const procedureMockGenerator = buildProcedureMockGenerator({ procedureDb, procedureProductDb })

  this.procedureService = {
    commands: procedureCommands,
    externalEventBus,
    internalEventBus,
    mocks: procedureMockGenerator,
  }
})

Before({ tags: "@invoice" }, async function (this: CustomWorld) {
  const externalEventBus = buildTestEventBus()

  const { invoiceCommands, invoiceHelpers, invoiceDb } = buildInvoiceService({ externalEventBus })

  this.invoiceService = {
    commands: invoiceCommands,
    helpers: invoiceHelpers,
    db: invoiceDb,
    externalEventBus,
  }
})
After({ tags: "@acceptance" }, async function () {})

BeforeAll(async function () {})
