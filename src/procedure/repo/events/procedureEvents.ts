import { ChangeEvent } from "../../../packages/eventSourcing/changeEvent.types"
import { ConsumedGood, Procedure } from "../../domain/procedure"
import { Uuid } from "../../../packages/uuid/uuid.types"

export const ProcedureCreatedEventType = "procedureCreatedEvent"
export type ProcedureCreatedEvent = ChangeEvent<{ name: string; appointmentId: string; animalId: string }>
export const ProcedureBeganEventType = "procedureBeganEvent"
export type ProcedureBeganEvent = ChangeEvent<{ status: "active" }>
export const GoodsConsumedOnProcedureEventType = "goodsConsumedOnProcedureEvent"
export type GoodsConsumedOnProcedureEvent = ChangeEvent<ConsumedGood>
export const ProcedureCompletedEventType = "procedureCompletedEvent"
export type ProcedureCompletedEvent = ChangeEvent<{ status: "complete" }>

export const ExternalProcedureCompletedEventType = "procedureCompletedEvent"
export type ExternalProcedureCompletedEvent = ChangeEvent<Procedure>

export type ProcedureEvents =
  | ProcedureBeganEvent
  | GoodsConsumedOnProcedureEvent
  | ProcedureCompletedEvent
  | ProcedureCreatedEvent

export type ProcedureEventsMaker = ReturnType<typeof buildProcedureEvents>

export const buildProcedureEvents = ({ uuid }: { uuid: Uuid }) => {
  return {
    created: (procedure: Procedure): ProcedureCreatedEvent => {
      return {
        eventId: uuid(),
        type: ProcedureCreatedEventType,
        aggregateId: procedure.id,
        date: Date.now().toString(),
        data: {
          name: procedure.name,
          appointmentId: procedure.appointmentId,
          animalId: procedure.animalId,
        },
      }
    },
    began: (procedure: Procedure): ProcedureBeganEvent => {
      return {
        eventId: uuid(),
        type: ProcedureBeganEventType,
        aggregateId: procedure.id,
        date: Date.now().toString(),
        data: {
          status: "active",
        },
      }
    },
    goodConsumed: (procedureId: string, consumedGood: ConsumedGood): GoodsConsumedOnProcedureEvent => {
      return {
        eventId: uuid(),
        type: GoodsConsumedOnProcedureEventType,
        aggregateId: procedureId,
        date: Date.now().toString(),
        data: {
          ...consumedGood,
        },
      }
    },
    completed: (procedureId: string): ProcedureCompletedEvent => {
      return {
        eventId: uuid(),
        type: ProcedureCompletedEventType,
        aggregateId: procedureId,
        date: Date.now().toString(),
        data: {
          status: "complete",
        },
      }
    },
    externalCompleted: (procedure: Procedure): ExternalProcedureCompletedEvent => {
      return {
        eventId: uuid(),
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
    isProcedureCreateEvent: (event: ProcedureEvents): event is ProcedureCreatedEvent =>
      event.type === ProcedureCreatedEventType,
    isProcedureBeganEvent: (event: ProcedureEvents): event is ProcedureBeganEvent =>
      event.type === ProcedureBeganEventType,
    isGoodsConsumedOnProcedureEvent: (event: ProcedureEvents): event is GoodsConsumedOnProcedureEvent =>
      event.type === GoodsConsumedOnProcedureEventType,
    isProcedureCompletedEventType: (event: ProcedureEvents): event is ProcedureCompletedEvent =>
      event.type === ProcedureCompletedEventType,
  }
}
