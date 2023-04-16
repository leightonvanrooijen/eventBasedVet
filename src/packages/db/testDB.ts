import { updateObject } from "../updateObject"
import { DeepPartial } from "../deepPartial"

export interface DataStore<T extends Record<string, any>> {
  get(keyValue: string): Promise<T | undefined>

  getByIds(keyValues: string[]): Promise<T[]>

  getAll(): Promise<T[]>

  create(inputItem: T): Promise<T>

  update(update: DeepPartial<T>): Promise<T>

  delete(keyValue: string): Promise<any>
}

export class TestDB<T extends Record<string, any>> implements DataStore<T> {
  constructor(private store: T[], private key: keyof T) {}

  async get(keyValue: string): Promise<T | undefined> {
    const item = this.store.find((item) => item[this.key] === keyValue)
    return Promise.resolve(item)
  }

  async getByIds(keyValues: string[]): Promise<T[]> {
    const items = this.store.filter((item) => keyValues.includes(item[this.key]))
    return Promise.resolve(items)
  }

  async getAll(): Promise<T[]> {
    return Promise.resolve(this.store)
  }

  async create(inputItem: T): Promise<T> {
    const key = inputItem[this.key]

    const found = this.store.find((item) => item[this.key] === key)
    if (found) throw new Error("Record already exists in the database")

    this.store.push(inputItem)
    return Promise.resolve(inputItem)
  }

  async update(inputItem: DeepPartial<T>): Promise<T> {
    const key = inputItem[this.key as keyof DeepPartial<T>]

    const index = this.store.findIndex((item) => item[this.key] === key)
    if (index === -1) throw new Error("Record does not exist in the database")

    const updated = updateObject(this.store[index], inputItem)
    this.store[index] = updated
    return Promise.resolve(updated)
  }

  async delete(keyValue: string): Promise<void> {
    this.store = this.store.filter((item) => item[this.key] !== keyValue)
    return Promise.resolve()
  }
}
