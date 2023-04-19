import { ConsumedGood, Procedure } from "../../procedure/domain/procedure"
import { InvoiceProduct } from "../externalInEvents/invoiceExternalEventHandler"
import { find, map, propEq } from "ramda"
import { InvoiceOffer, InvoiceOrder } from "../domain/invoice"

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
    type: "procedure",
    aggregateId: procedure.id,
    name: procedure.name,
    offers: adaptConsumedGoodsToOffers(procedure.goodsConsumed, goods),
  }
}
export type InvoiceAdapters = typeof invoiceAdapters
export const invoiceAdapters = {
  procedureToOrder: adaptProcedureToOrder,
}
