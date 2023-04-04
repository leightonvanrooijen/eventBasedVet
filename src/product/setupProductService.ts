import { EventBus } from "../packages/events/eventBus.types"
import { buildTestEventDb } from "../packages/eventSourcing/testEventDb"
import { buildProductEvents, ProductEvents } from "./events/productEvents"
import { buildProductRepo } from "./repo/productRepo"
import { buildProductActions } from "./domain/product"
import { v4 } from "uuid"
import { buildProductCommands } from "./commands/productCommands"

export const setupProductService = (externalEventBus: EventBus) => {
  const defaultProductStore = {}
  const productDb = buildTestEventDb<ProductEvents>({ defaultStore: defaultProductStore })
  const productRepo = buildProductRepo({ db: productDb })
  const productActions = buildProductActions({ uuid: v4 })
  const productEvents = buildProductEvents()
  const productCommands = buildProductCommands({ productRepo, productActions, productEvents, externalEventBus })

  return { productCommands, defaultProductStore }
}
