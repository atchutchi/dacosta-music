import Content from './checkout-content'
import { pageMetadata } from '@/lib/page-metadata'

export const metadata = { ...pageMetadata("Checkout","/shop/checkout","Confirm delivery, shipping and payment in euros."), robots:{index:false,follow:true} }
export default function Page() { return <Content /> }
