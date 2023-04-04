import { ChangeEvent } from "../../packages/eventSourcing/changeEvent.types"
import { CreateProcedureProps } from "../commands/procedureCommands"
import { ConsumedGood, Procedure } from "../domain/procedure"

export const ProcedureCreatedEventType = "procedureCreatedEvent"
export type ProcedureCreatedEvent = ChangeEvent<CreateProcedureProps>
export const GoodsConsumedOnProcedureEventType = "goodsConsumedOnProcedureEvent"
export type GoodsConsumedOnProcedureEvent = ChangeEvent<ConsumedGood>
export const ProcedureCompletedEventType = "procedureCompletedEvent"
export type ProcedureCompletedEvent = ChangeEvent<{ status: "complete" }>

export const ExternalProcedureCompletedEventType = "procedureCompletedEvent"
export type ExternalProcedureCompletedEvent = ChangeEvent<Procedure>

export type ProcedureEvents = ProcedureCreatedEvent | GoodsConsumedOnProcedureEvent | ProcedureCompletedEvent

export type ProcedureEventsMaker = ReturnType<typeof buildProcedureEvents>

export const buildProcedureEvents = () => {
  return {
    created: (procedure: Procedure): ProcedureCreatedEvent => {
      return {
        version: 1,
        type: ProcedureCreatedEventType,
        aggregateId: procedure.id,
        date: Date.now().toString(),
        data: {
          name: procedure.name,
          goodsConsumed: procedure.goodsConsumed,
        },
      }
    },
    goodConsumed: (procedureId: string, consumedGood: ConsumedGood, version: number): GoodsConsumedOnProcedureEvent => {
      return {
        version,
        type: GoodsConsumedOnProcedureEventType,
        aggregateId: procedureId,
        date: Date.now().toString(),
        data: {
          ...consumedGood,
        },
      }
    },
    completed: (procedureId: string, version: number): ProcedureCompletedEvent => {
      return {
        version,
        type: ProcedureCompletedEventType,
        aggregateId: procedureId,
        date: Date.now().toString(),
        data: {
          status: "complete",
        },
      }
    },
    externalCompleted: (procedure: Procedure, version: number): ExternalProcedureCompletedEvent => {
      return {
        version,
        type: ExternalProcedureCompletedEventType,
        aggregateId: procedure.id,
        date: Date.now().toString(),
        data: {
          ...procedure,
        },
      }
    },
  }
}

export type ProcedureEventChecker = ReturnType<typeof buildProcedureEventChecker>
export const buildProcedureEventChecker = () => {
  return {
    isProcedureCreatedEvent: (event: ProcedureEvents): event is ProcedureCreatedEvent =>
      event.type === ProcedureCreatedEventType,
    isGoodsConsumedOnProcedureEvent: (event: ProcedureEvents): event is GoodsConsumedOnProcedureEvent =>
      event.type === GoodsConsumedOnProcedureEventType,
    isProcedureCompletedEventType: (event: ProcedureEvents): event is ProcedureCompletedEvent =>
      event.type === ProcedureCompletedEventType,
  }
}
