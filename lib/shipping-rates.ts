// Tabela comercial aprovada em 18/11/2026. Valores em cêntimos, por encomenda.
export const SHIPPING_ORIGIN = 'Amsterdam, Netherlands'
export const SHIPPING_PACKAGING_GRAMS = 30
export const PRODUCT_SHIPPING_GRAMS: Readonly<Record<string, number>> = {
  'akhet-ade-2026-limited-edition-oversized-t-shirt': 400,
  'caiiro-london-2025-limited-edition-oversized-t-shirt': 400,
}

export const SHIPPING_ZONES = {
  netherlands: { name: 'Netherlands', rates: [1195, 1195] },
  euCentral: { name: 'Central EU', rates: [1795, 1895] },
  euWest: { name: 'Portugal and Western / Northern EU', rates: [2095, 2295] },
  euOther: { name: 'Other EU countries', rates: [2295, 2595] },
  greeceMalta: { name: 'Greece and Malta', rates: [2495, 3095] },
  uk: { name: 'United Kingdom', rates: [1895, 2095] },
  europe: { name: 'Europe outside the EU', rates: [2195, 2395] },
  southAfrica: { name: 'South Africa', rates: [3295, 3995] },
  africa: { name: 'Other African destinations', rates: [3695, 4495] },
  canada: { name: 'Canada', rates: [3295, 3995] },
  usa: { name: 'United States and Puerto Rico', rates: null },
  americas: { name: 'Other American destinations', rates: [3695, 4495] },
  asia: { name: 'Asia', rates: [3695, 4495] },
  middleEast: { name: 'Middle East', rates: [3695, 4495] },
  oceania: { name: 'Oceania', rates: [3695, 4495] },
} as const
export type ShippingZoneId = keyof typeof SHIPPING_ZONES

// Lista explícita: um código desconhecido nunca herda uma tarifa mundial.
// Territórios especiais e cobertura por confirmar mantêm a selecção e pedem cotação.
const COUNTRY_GROUPS: Readonly<Record<ShippingZoneId, string>> = {
  netherlands: 'NL',
  euCentral: 'BE DE FR LU',
  euWest: 'PT ES IT AT DK SE IE',
  euOther: 'BG CY CZ EE FI HR HU LT LV PL RO SI SK',
  greeceMalta: 'GR MT',
  uk: 'GB',
  europe: 'AD AL AX BA BY CH FO GG GI GL IM IS JE LI MC MD ME MK NO RS RU SJ SM TR UA VA XK',
  southAfrica: 'ZA',
  africa: 'AO BF BI BJ BW CD CF CG CI CM CV DJ DZ EG EH ER ET GA GH GM GN GQ GW IO KE KM LR LS LY MA MG ML MR MU MW MZ NA NE NG RE RW SC SD SH SL SN SO SS ST SZ TD TF TG TN TZ UG YT ZM ZW',
  canada: 'CA',
  usa: 'US PR',
  americas: 'AG AI AR AW BB BL BM BO BQ BR BS BZ CL CO CR CU CW DM DO EC FK GD GF GP GS GT GY HN HT JM KN KY LC MF MQ MS MX NI PA PE PM PY SR SV SX TC TT UY VC VE VG VI',
  asia: 'AF AM AZ BD BT BN CN GE HK ID IN JP KG KH KP KR KZ LA LK MM MN MO MV MY NP PH PK SG TH TJ TL TM TW UZ VN',
  middleEast: 'AE BH IL IQ IR JO KW LB OM PS QA SA SY YE',
  oceania: 'AQ AS AU BV CC CK CX FJ FM GU HM KI MH MP NC NF NR NU NZ PF PG PN PW SB TK TO TV UM VU WF WS',
}
const QUOTE_COUNTRIES = new Set(('US PR AF AI AQ AS AW AX BL BM BQ BV BY CC CK CW CX EH FK FO GF GG GI GL GP GS GU HM HT IM IO IR JE KP KY LY MF MP MQ MS NC NF NU PF PM PN PS RE RU SD SH SJ SO SS SX SY TC TF TK UA UM VG VI WF YE YT').split(' '))
const EU_COUNTRIES = new Set(('NL BE DE FR LU PT ES IT AT DK SE IE BG CY CZ EE FI HR HU LT LV PL RO SI SK GR MT').split(' '))
const OPTIONAL_POSTAL_CODE = new Set(('AE AG AO AW BF BI BJ BO BQ BS BW BZ CD CF CG CI CK CM CW DJ DM ER FJ GA GD GH GM GQ GY HK JM KE KI KM KN LC ML MO MR MS MU MW NR NU PA QA RW SB SC SL SO SR SS ST SX SY TD TF TG TK TL TO TT TV TZ UG VU YE').split(' '))
const displayNames = new Intl.DisplayNames(['en'], { type: 'region' })

export const SHIPPING_COUNTRIES = Object.entries(COUNTRY_GROUPS).flatMap(([zoneId, codes]) =>
  codes.split(' ').map(code => ({
    code, name: displayNames.of(code) ?? code, zoneId: zoneId as ShippingZoneId,
    requiresQuote: QUOTE_COUNTRIES.has(code), requiresCustoms: !EU_COUNTRIES.has(code),
    requiresPostalCode: !OPTIONAL_POSTAL_CODE.has(code),
  })),
).sort((a, b) => a.name.localeCompare(b.name, 'en'))

export class ShippingQuoteRequiredError extends Error {
  constructor(message = 'A shipping quote is required for this destination or parcel. Please contact us before payment.') {
    super(message)
    this.name = 'ShippingQuoteRequiredError'
  }
}

export function getShippingDestination(country: string) {
  const destination = SHIPPING_COUNTRIES.find(entry => entry.code === country.trim().toUpperCase())
  if (!destination) throw new Error('Unsupported shipping country')
  return destination
}

export function getShippingDetails(country: string, weightGrams: number, postalCode = '') {
  const destination = getShippingDestination(country)
  if (!Number.isSafeInteger(weightGrams) || weightGrams <= 0) throw new Error('Invalid shipping weight')
  const zone = SHIPPING_ZONES[destination.zoneId]
  const postcode = postalCode.trim().toUpperCase().replace(/\s/g, '')
  const specialPostcode = (destination.code === 'ES' && /^(35|38|51|52)/.test(postcode)) ||
    (destination.code === 'GB' && postcode.startsWith('BT'))
  if (destination.requiresQuote || specialPostcode || !zone.rates || weightGrams > 2000) {
    throw new ShippingQuoteRequiredError()
  }
  const band = weightGrams <= 1000 ? 0 : 1
  return {
    countryCode: destination.code, zoneId: destination.zoneId, zoneName: zone.name,
    weightGrams, weightBand: band === 0 ? 'Up to 1 kg' : 'Over 1 kg, up to 2 kg',
    shippingCost: zone.rates[band] / 100, requiresCustoms: destination.requiresCustoms,
    origin: SHIPPING_ORIGIN,
  }
}

export function calculateShipping(country: string, weightGrams: number, postalCode = '') {
  return getShippingDetails(country, weightGrams, postalCode).shippingCost
}
