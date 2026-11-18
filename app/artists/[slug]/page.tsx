import Profile from './artist-profile'
import { notFound } from 'next/navigation'
import { pageMetadata } from '@/lib/page-metadata'
import { ARTIST_NAMES } from '@/lib/contact-context'
const photos: Record<string,string> = {caiiro:'Caiiro-VIII',dacapo:'da-capo-X',enoonapa:'Enoo-Napa0374',djeff:'Djeff_profile_photo',breyth:'breyth-photo-main'}
type Props = {params:Promise<{slug:string}>}
export async function generateMetadata({params}:Props) {
 const {slug}=await params
 if(!Object.hasOwn(photos,slug)) return {title:'Artist not found',robots:{index:false,follow:false}}
 return pageMetadata(ARTIST_NAMES[slug],'/artists/'+slug,'Discover '+ARTIST_NAMES[slug]+' and enquire about bookings with Da Costa Music.','/images/artists/'+photos[slug]+'.webp')
}
export default async function Page({params}:Props) {const {slug}=await params;if(!Object.hasOwn(photos,slug))notFound();return <Profile/>}
