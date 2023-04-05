import { ICreateAttachment, ICreateLog } from "@cucumber/cucumber/lib/runtime/attachment_manager"
import { ProcedureService } from "../src/packages/acceptanceTests/world"

// should be overriding IWorld so we don't have to type it in our steps but I must have my tsconfig wrong
declare module "@cucumber/cucumber" {
  interface IWorld<ParametersType = any> {
    procedureService: ProcedureService
    readonly attach: ICreateAttachment
    readonly log: ICreateLog
    readonly parameters: ParametersType
    [key: string]: any
  }
}
