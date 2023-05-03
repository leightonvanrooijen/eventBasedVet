export type ConsumedGood = {
  quantity: number
  typeOfGood: "product"
  goodId: string
  businessFunction: "sell"
}
export type ProcedureStatuses = "active" | "complete" | "pending"

export type Procedure = {
  id: string
  name: string
  goodsConsumed: ConsumedGood[]
  status: ProcedureStatuses
  animalId: string
  appointmentId: string
}
