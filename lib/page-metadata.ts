import type { Metadata } from 'next'

export const SITE_ORIGIN = 'https://www.dacosta-music.com'
export function pageMetadata(title:string,pathname:string,description:string,image='/images/club-view-optimized.webp'): Metadata {
  const url = new URL(pathname,SITE_ORIGIN).href
  const fullTitle = `${title} | Da Costa Music`
  return {
    title:{absolute:fullTitle}, description, alternates:{canonical:url},
    openGraph:{type:'website',siteName:'Da Costa Music',title:fullTitle,description,url,images:[{url:new URL(image,SITE_ORIGIN).href,alt:title}]},
    twitter:{card:'summary_large_image',title:fullTitle,description,images:[new URL(image,SITE_ORIGIN).href]},
  }
}
