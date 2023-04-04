import { DataStore } from "../../packages/db/testDB"
import { ProcedureProduct } from "../domain/product/procedureProduct"
import { DeepPartial } from "../../packages/deepPartial"

export type ProcedureProductRepo = ReturnType<typeof buildProcedureProductRepo>

export const buildProcedureProductRepo = ({ db }: { db: DataStore<ProcedureProduct> }) => {
  return {
    create: async (product: ProcedureProduct) => {
      return db.create(product)
    },
    get: async (id: string) => {
      return db.get(id)
    },
    getByIds: async (ids: string[]) => {
      return db.getByIds(ids)
    },
    update: async (update: DeepPartial<ProcedureProduct>) => {
      return db.update(update)
    },
  }
}
