import Content from './product-content'
import {pageMetadata} from '@/lib/page-metadata'
import {createServerClient} from '@/lib/supabase/server'
type Props = {params:Promise<{slug:string}>}
export async function generateMetadata({params}:Props) {
 const {slug}=await params
 try {
  const supabase=await createServerClient()
  const {data:product}=await supabase.from('products').select('name,description,image_urls').eq('slug',slug).eq('active',true).maybeSingle()
  if(product) return pageMetadata(product.name,'/shop/product/'+encodeURIComponent(slug),(product.description || 'Official merchandise from Da Costa Music.').replace(/<[^>]*>/g,'').slice(0,180),product.image_urls?.[0])
 } catch { /* Keep the catalogue usable when metadata cannot be fetched. */ }
 return {...pageMetadata('Product','/shop/product/'+encodeURIComponent(slug),'Official merchandise from Da Costa Music.'),robots:{index:false,follow:true}}
}
export default function Page(){return <Content/>}
