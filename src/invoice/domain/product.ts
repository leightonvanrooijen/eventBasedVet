export type InvoiceProduct = { id: string; name: string; price: number }

export const makeInvoiceProduct = ({ id, name, price }: InvoiceProduct) => {
  return {
    id,
    name,
    price,
    type: "product",
  }
}
