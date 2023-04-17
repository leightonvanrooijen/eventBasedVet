import { IWorldOptions, setWorldConstructor, World } from "@cucumber/cucumber"
import { ProcedureCommands } from "../../procedure/commands/procedureCommands"
import { EventBroker } from "../events/eventBroker.types"
import { InvoiceCommands } from "../../invoice/commmands/invoiceCommands"
import { InvoiceServiceHelpers } from "../../invoice/acceptanceTests/buildInvoiceServiceHelpers"
import { DataStore } from "../db/testDB"
import { Invoice } from "../../invoice/domain/invoice"
import { ProcedureServiceHelpers } from "../../procedure/acceptanceTests/buildProcedureServiceHelpers"

export type ProcedureService = {
  externalEventBroker: EventBroker
  internalEventBroker: EventBroker
  commands: ProcedureCommands
  helpers: ProcedureServiceHelpers
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

  constructor(options: IWorldOptions, procedureService: ProcedureService) {
    super(options)
    this.procedureService = procedureService
  }
}

setWorldConstructor(CustomWorld)
