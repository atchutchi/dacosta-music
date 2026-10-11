async (page) => {
  const product = {
    id: 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',
    name: 'AKHET ADE 2026 Limited Edition Oversized T-Shirt',
    slug: 'akhet-ade-2026-limited-edition-oversized-t-shirt',
    price: 25, category: 'Apparel', active: true, featured: true,
    description: 'AKHET debut showcase at Elementstraat Warehouse, Amsterdam, on 23 October 2026.',
    sizes: ['XS','S','M','L','XL'], colors: ['Black'], stock_quantity: 100,
    stock_by_size: {XS:10,S:10,M:30,L:30,XL:20}, low_stock_threshold:5,
    image_urls: ['/images/merch/akhet-ade-2026-front.webp','/images/merch/akhet-ade-2026-back.webp']
  }
  const failures = [], errors = []
  const check = (value, message) => { if (!value) failures.push(message) }
  page.on('pageerror', error => errors.push(error.message))
  let pixelRequests = 0, checkoutPayload
  await page.route('**/api/products*', route => {
    const slug = new URL(route.request().url()).searchParams.get('slug')
    const products = !slug || slug === product.slug ? [product] : []
    return route.fulfill({json:{products,pagination:{page:1,pages:1,total:products.length,limit:12}}})
  })
  await page.route('https://connect.facebook.net/**', route => { pixelRequests++; return route.fulfill({contentType:'application/javascript',body:''}) })
  await page.route('https://www.facebook.com/**', route => route.abort())
  await page.route('**/api/checkout/stripe', route => {
    checkoutPayload = route.request().postDataJSON()
    return route.fulfill({status:400,json:{error:'QA: no payment or order was created'}})
  })
  await page.goto('http://127.0.0.1:3000/shop')
  await page.evaluate(() => { localStorage.clear() })
  await page.reload()
  await page.getByRole('button',{name:'Reject marketing cookies'}).click()
  check(pixelRequests === 0,'Pixel loaded without consent')
  await page.goto(`http://127.0.0.1:3000/shop/product/${product.slug}`)
  await page.getByRole('heading',{name:product.name,exact:true}).waitFor()
  check(await page.getByText('VAT included',{exact:true}).isVisible(),'VAT note missing')
  await page.getByRole('button',{name:'XS',exact:true}).click()
  check(await page.getByText('10 available',{exact:true}).isVisible(),'XS stock incorrect')
  await page.getByRole('button',{name:'M',exact:true}).click()
  check(await page.getByText('30 available',{exact:true}).isVisible(),'M stock incorrect')
  await page.getByRole('button',{name:'XS',exact:true}).click()
  for (let i=0;i<9;i++) await page.getByRole('button',{name:'+',exact:true}).click()
  check(await page.getByRole('button',{name:'+',exact:true}).isDisabled(),'XS quantity exceeded ten')
  await page.getByRole('button',{name:'Add to Cart',exact:true}).click()
  await page.getByRole('button',{name:'Add to Cart',exact:true}).click()
  const cart = await page.evaluate(() => JSON.parse(localStorage.getItem('dacosta-cart')))
  check(cart.length === 1 && cart[0].quantity === 10,'Repeated addition exceeded stock')
  await page.getByRole('img',{name:`${product.name} 2`,exact:true}).click()
  check((await page.getByRole('img',{name:product.name,exact:true}).getAttribute('src')).endsWith('back.webp'),'Back image missing')
  await page.screenshot({path:'output/akhet-product-desktop.png',fullPage:true})
  await page.setViewportSize({width:390,height:844})
  check(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),'Product overflows mobile')
  await page.screenshot({path:'output/akhet-product-mobile.png',fullPage:true})
  await page.setViewportSize({width:1280,height:900})
  await page.evaluate(() => {const cart = JSON.parse(localStorage.getItem('dacosta-cart')); cart[0].quantity=1;localStorage.setItem('dacosta-cart',JSON.stringify(cart))})
  await page.goto('http://127.0.0.1:3000/shop/checkout')
  await page.locator('#customerName').fill('QA DaCosta')
  await page.locator('#customerEmail').fill('qa@example.invalid')
  await page.getByRole('button',{name:'Continue as Guest',exact:true}).click()
  await page.locator('#shippingPhone').fill('900000000')
  await page.locator('#addressLine1').fill('Test address')
  await page.locator('#city').fill('Test city')
  await page.locator('#postalCode').fill('1000-001')
  await page.locator('#country').selectOption('PT')
  check((await page.getByText('€5.50',{exact:true}).count()) > 0,'Portugal postage incorrect')
  await page.getByRole('radio',{name:'DHL',exact:true}).check()
  check(await page.getByText('Shipping with DHL',{exact:true}).isVisible(),'DHL selection missing')
  await page.locator('#country').selectOption('NL')
  check((await page.getByText('€12.50',{exact:true}).count()) > 0,'Netherlands postage incorrect')
  await page.locator('#country').selectOption('PT')
  await page.getByRole('button',{name:'Continue to Payment',exact:true}).click()
  await page.getByRole('button',{name:'Place Order',exact:true}).click()
  await page.getByText('QA: no payment or order was created',{exact:true}).waitFor()
  check(checkoutPayload.shippingMethod === 'dhl' && checkoutPayload.total === 30.5,'Checkout payload incorrect')
  await page.getByRole('button',{name:'Cookie settings',exact:true}).click()
  const pixelResponse = page.waitForResponse('https://connect.facebook.net/en_US/fbevents.js')
  await page.getByRole('button',{name:'Accept marketing cookies',exact:true}).click()
  await pixelResponse
  check(pixelRequests === 1,'Pixel did not load once after consent')
  const commands = await page.evaluate(() => window.fbq?.queue ?? [])
  check(commands.some(command => command[0] === 'init' && command[1] === '834660132483518'),'Pixel ID incorrect')
  await page.getByRole('button',{name:'Cookie settings',exact:true}).click()
  await page.getByRole('button',{name:'Reject marketing cookies',exact:true}).click()
  check(await page.evaluate(() => window.fbq.queue.some(command => command[0] === 'consent' && command[1] === 'revoke')),'Consent withdrawal missing')
  await page.goto('http://127.0.0.1:3000/shop/product/does-not-exist')
  await page.getByRole('heading',{name:'Product Not Found',exact:true}).waitFor()
  check(await page.getByRole('heading',{name:'Product Not Found',exact:true}).isVisible(),'Invalid slug showed another product')
  check(errors.length === 0,`Browser errors: ${errors.join(', ')}`)
  if (failures.length) throw new Error(failures.join('; '))
  return {passed:true, pixelRequests, scenarios:['VAT','images','mobile','stock by size','cart limit','CTT/DHL shipping','checkout error','Pixel consent','exact product slug'], checkout:'intercepted, no external order/payment/email'}
}
