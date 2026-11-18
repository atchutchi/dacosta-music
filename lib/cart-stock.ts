type Item = {productId:string;quantity:number;size?:string|null;color?:string|null}
type Stock = {id:string;active?:boolean;stock_quantity:number;stock_by_size?:Record<string,number>|null}
export function maxCartItemQuantity(product:Stock, items:Item[], current:Item) {
  if (product.active === false) return 0
  const other = items.filter(item => item.productId===product.id &&
    !(item.size===current.size && item.color===current.color))
  const remainingTotal = product.stock_quantity - other.reduce((sum,item)=>sum+item.quantity,0)
  const remainingSize = product.stock_by_size
    ? (product.stock_by_size[current.size ?? ''] ?? 0) - other.filter(item=>item.size===current.size).reduce((sum,item)=>sum+item.quantity,0)
    : remainingTotal
  return Math.max(0,Math.min(remainingTotal,remainingSize))
}
