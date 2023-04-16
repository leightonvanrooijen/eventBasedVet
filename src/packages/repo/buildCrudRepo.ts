import { DataStore } from "../db/testDB"
import { DeepPartial } from "../deepPartial"

export const buildCrudRepo = <T extends Record<string, any>>({ db }: { db: DataStore<T> }) => {
  return {
    create: async (item: T) => {
      return db.create(item)
    },
    get: async (id: string) => {
      const item = db.get(id)
      if (!item) throw new Error("Record does not exist")
      return item
    },
    getByIds: async (ids: string[]) => {
      return db.getByIds(ids)
    },
    update: async (update: DeepPartial<T>) => {
      return db.update(update)
    },
  }
}
