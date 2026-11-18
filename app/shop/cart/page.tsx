import Content from './cart-content'
import { pageMetadata } from '@/lib/page-metadata'

export const metadata = { ...pageMetadata("Your cart","/shop/cart","Review your merchandise and estimate shipping by delivery country."), robots:{index:false,follow:true} }
export default function Page() { return <Content /> }
