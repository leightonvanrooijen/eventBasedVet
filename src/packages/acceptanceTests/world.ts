import { IWorldOptions, setWorldConstructor, World } from "@cucumber/cucumber"
import { ProcedureCommands } from "../../procedure/commands/procedureCommands"
import { EventBroker } from "../events/eventBroker.types"
import { ProcedureMockGenerator } from "../../procedure/acceptanceTests/buildProcedureMockGenerator"
import { InvoiceCommands } from "../../invoice/commmands/invoiceCommands"
import { InvoiceServiceHelpers } from "../../invoice/acceptanceTests/buildInvoiceServiceHelpers"
import { DataStore } from "../db/testDB"
import { Invoice } from "../../invoice/domain/invoice"

export type ProcedureService = {
  externalEventBroker: EventBroker
  internalEventBroker: EventBroker
  commands: ProcedureCommands
  mocks: ProcedureMockGenerator
}

export type InvoiceService = {
  externalEventBroker: EventBroker
  commands: InvoiceCommands
  helpers: InvoiceServiceHelpers
  db: DataStore<Invoice>
}

export class CustomWorld extends World {
  procedureService: ProcedureService
  invoiceService: InvoiceService
  // productService: ProductCommands

  constructor(options: IWorldOptions, procedureService: ProcedureService) {
    super(options)
    this.procedureService = procedureService
  }
}

setWorldConstructor(CustomWorld)
