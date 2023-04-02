import { IWorldOptions, setWorldConstructor, World } from "@cucumber/cucumber"
import axios from "axios"

export class CustomWorld extends World {
  url: string

  constructor(options: IWorldOptions) {
    super(options)
  }

  async post(endpoint: string, body: Record<string, any>) {
    return axios.post(this.url + endpoint, body)
  }

  async get(endpoint: string, params: Record<string, string> = {}) {
    return axios.get(this.url + endpoint, { params })
  }
}

setWorldConstructor(CustomWorld)
