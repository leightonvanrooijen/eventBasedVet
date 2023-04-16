import { EventBroker } from "../packages/events/eventBroker.types"
import { buildTestEventDb } from "../packages/eventSourcing/testEventDb"
import { buildProductEvents, ProductEvents } from "./repo/events/productEvents"
import { buildProductRepo } from "./repo/productRepo"
import { buildProductActions } from "./domain/product"
import { v4 } from "uuid"
import { buildProductCommands } from "./commands/productCommands"

export const buildProductService = (externalEventBroker: EventBroker) => {
  const defaultProductStore = {}
  const productDb = buildTestEventDb<ProductEvents>({ store: defaultProductStore })
  const productEvents = buildProductEvents()
  const productRepo = buildProductRepo({ db: productDb, externalEventBroker, productEvents })
  const productActions = buildProductActions({ uuid: v4 })
  const productCommands = buildProductCommands({
    productRepo,
    productActions,
    productEvents,
    externalEventBroker: externalEventBroker,
  })

  return { productCommands, defaultProductStore }
}
