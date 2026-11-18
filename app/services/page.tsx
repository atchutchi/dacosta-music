import Content from './services-content'
import { pageMetadata } from '@/lib/page-metadata'

export const metadata = { ...pageMetadata("Services","/services","Worldwide artist bookings, management, travel, logistics and creative services.") }
export default function Page() { return <Content /> }
