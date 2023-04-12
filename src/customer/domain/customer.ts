import { Uuid } from "../../packages/uuid/uuid.types"

export type CustomerTypes = "person" | "organisation"

export type Customer = {
  id: string
  name: string
  type: CustomerTypes
  customerId: string
}

export type CustomerActions = ReturnType<typeof buildCustomerActions>

export const makeCustomer = ({ id, name, type, customerId }: Customer): Customer => {
  if (!id) throw new Error("A Customer must have an id")
  if (!name) throw new Error("A Customer must have an name")
  if (!type) throw new Error("A Customer must have an type")
  if (!customerId) throw new Error("A Customer must have an customerId")

  return {
    id,
    name,
    type,
    customerId,
  }
}

export const buildCustomerActions = ({ uuid }: { uuid: Uuid }) => {
  return {
    create: ({ name, type, customerId }: { name: string; type: CustomerTypes; customerId: string }) => {
      return makeCustomer({ name, type, id: uuid(), customerId })
    },
  }
}
