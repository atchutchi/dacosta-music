import Content from './shop-content'
import { pageMetadata } from '@/lib/page-metadata'

export const metadata = { ...pageMetadata("Shop","/shop","Official AKHET and Caiiro limited edition t-shirts. VAT included. Shipping from Amsterdam.") }
export default function Page() { return <Content /> }
