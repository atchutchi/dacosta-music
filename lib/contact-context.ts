export const ARTIST_NAMES: Readonly<Record<string,string>> = {
  caiiro:'Caiiro', dacapo:'Da Capo', enoonapa:'Enoo Napa', djeff:'DJEFF', breyth:'BREYTH', b3b:'B3B', b2b:'B2B',
}
export const SERVICE_NAMES: Readonly<Record<string,string>> = {
  turnkey:'Turnkey Service', booking:'Worldwide Booking', 'travel-logistics':'Travel & Logistics Management',
  management:'Artist Management', branding:'Artist Image & Branding', finance:'Artist Finance & Administrative Organization',
}
export function getContactContext(search:string) {
  const params = new URLSearchParams(search)
  const artistSlug = params.get('artist') ?? ''
  const artist = Object.hasOwn(ARTIST_NAMES,artistSlug) ? ARTIST_NAMES[artistSlug] : undefined
  if (artist) return {subject:'booking',artists:[artist],message:''}
  const serviceSlug = params.get('service') ?? ''
  const service = Object.hasOwn(SERVICE_NAMES,serviceSlug) ? SERVICE_NAMES[serviceSlug] : undefined
  return service ? {subject:'other',artists:[] as string[],message:`I'm interested in ${service}.\n\n`} : null
}
