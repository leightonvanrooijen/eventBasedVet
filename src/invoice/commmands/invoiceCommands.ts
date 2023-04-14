import { ConsumedGood, Procedure } from "../../procedure/domain/procedure"
import { InvoiceProduct } from "../domain/product"
import { find, map, pluck, propEq } from "ramda"
import { InvoiceProductRepo } from "../repo/invoiceProductRepo"
import { InvoiceActions, InvoiceOffer, InvoiceOrder } from "../domain/invoice"
import { InvoiceRepo } from "../repo/invoiceRepo"

export type InvoiceCommands = ReturnType<typeof buildInvoiceCommands>

const adaptConsumedGoodToOffer = (consumedGood: ConsumedGood, good: InvoiceProduct): InvoiceOffer => {
  return {
    goodOffered: good,
    typeOfGood: consumedGood.typeOfGood,
    price: good.price,
    quantity: consumedGood.quantity,
    businessFunction: consumedGood.businessFunction,
  }
}

const adaptConsumedGoodsToOffers = (consumedGoods: ConsumedGood[], goods: InvoiceProduct[]) => {
  return map((consumedGood: ConsumedGood) => {
    const containedProduct = find<InvoiceProduct>(propEq("id", consumedGood.goodId))(goods)
    return adaptConsumedGoodToOffer(consumedGood, containedProduct)
  })(consumedGoods)
}

const adaptProcedureToOrder = (procedure: Procedure, goods: InvoiceProduct[]): InvoiceOrder => {
  return {
    type: procedure.type,
    aggregateId: procedure.id,
    name: procedure.name,
    offers: adaptConsumedGoodsToOffers(procedure.goodsConsumed, goods),
  }
}

export type InvoiceAdapters = typeof invoiceAdapters
export const invoiceAdapters = {
  procedureToOrder: adaptProcedureToOrder,
}

export const buildInvoiceCommands = ({
  invoiceActions,
  invoiceRepo,
  productRepo,
  invoiceAdapters,
}: {
  invoiceActions: InvoiceActions
  invoiceRepo: InvoiceRepo
  productRepo: InvoiceProductRepo
  invoiceAdapters: InvoiceAdapters
}) => {
  return {
    createFromProcedure: async (procedure: Procedure) => {
      const goodIdsContainedInProcedure = pluck("goodId")(procedure.goodsConsumed)
      const goods = await productRepo.getByIds(goodIdsContainedInProcedure)
      const order = invoiceAdapters.procedureToOrder(procedure, goods)

      const invoice = invoiceActions.create(order)

      await invoiceRepo.create(invoice)
    },
  }
}
