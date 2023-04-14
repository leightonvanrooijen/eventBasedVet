import { ChangeEvent } from "../../packages/eventSourcing/changeEvent.types"
import { ConsumedGood, Procedure } from "../domain/procedure"

export const ProcedureBeganEventType = "procedureBeganEvent"
export type ProcedureBeganEvent = ChangeEvent<{ name: string }>
export const GoodsConsumedOnProcedureEventType = "goodsConsumedOnProcedureEvent"
export type GoodsConsumedOnProcedureEvent = ChangeEvent<ConsumedGood>
export const ProcedureCompletedEventType = "procedureCompletedEvent"
export type ProcedureCompletedEvent = ChangeEvent<{ status: "complete" }>

export const ExternalProcedureCompletedEventType = "procedureCompletedEvent"
export type ExternalProcedureCompletedEvent = ChangeEvent<Procedure>

export type ProcedureEvents = ProcedureBeganEvent | GoodsConsumedOnProcedureEvent | ProcedureCompletedEvent

export type ProcedureEventsMaker = ReturnType<typeof buildProcedureEvents>

export const buildProcedureEvents = () => {
  return {
    began: (procedure: Procedure): ProcedureBeganEvent => {
      return {
        version: 1,
        type: ProcedureBeganEventType,
        aggregateId: procedure.id,
        date: Date.now().toString(),
        data: {
          name: procedure.name,
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
    isProcedureBeganEvent: (event: ProcedureEvents): event is ProcedureBeganEvent =>
      event.type === ProcedureBeganEventType,
    isGoodsConsumedOnProcedureEvent: (event: ProcedureEvents): event is GoodsConsumedOnProcedureEvent =>
      event.type === GoodsConsumedOnProcedureEventType,
    isProcedureCompletedEventType: (event: ProcedureEvents): event is ProcedureCompletedEvent =>
      event.type === ProcedureCompletedEventType,
  }
}
