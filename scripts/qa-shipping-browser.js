async (page) => {
  const base = new URL(page.url()).origin
  // Em desenvolvimento, os nomes dos chunks mantêm-se entre alterações.
  // Remover o cache do service worker antes de avaliar a versão actual.
  await page.route('**/sw.js', route => route.abort())
  await page.evaluate(async () => {
    await Promise.all((await navigator.serviceWorker.getRegistrations()).map(registration => registration.unregister()))
    await Promise.all((await caches.keys()).map(key => caches.delete(key)))
  })
  await page.reload()
  const product = {id:'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',name:'AKHET ADE 2026 Limited Edition Oversized T-Shirt',slug:'akhet-ade-2026-limited-edition-oversized-t-shirt',price:25,active:true,stock_quantity:100,sizes:['M'],colors:['Black'],stock_by_size:{M:100},image_urls:['/images/merch/akhet-ade-2026-front.webp']}
  const errors = [], checks = []
  let payload
  page.on('pageerror', error => errors.push(error.message))
  await page.route('https://connect.facebook.net/**', route => route.fulfill({contentType:'application/javascript',body:''}))
  await page.route('https://www.facebook.com/**', route => route.abort())
  await page.route('**/api/products*', route => route.fulfill({json:{products:[product]}}))
  await page.route('**/api/checkout/status', route => route.fulfill({json:{available:true}}))
  await page.route('**/api/checkout/stripe', route => {
    payload = route.request().postDataJSON()
    return route.fulfill({status:400,json:{error:'QA: payment intercepted'}})
  })
  const check = (ok, name) => { if(!ok)throw new Error(name); checks.push(name) }
  const prepare = async quantity => {
    await page.goto(base+'/shop')
    await page.evaluate(({product,quantity}) => {
      localStorage.setItem('dacosta-cart',JSON.stringify([{productId:product.id,quantity,size:'M',color:'Black'}]))
    },{product,quantity})
    await page.goto(base+'/shop/checkout')
    const reject = page.getByRole('button',{name:'Reject marketing cookies',exact:true})
    if(await reject.isVisible())await reject.click()
    await page.locator('#customerName').fill('QA shipping')
    await page.locator('#customerEmail').fill('qa@example.invalid')
    await page.getByRole('button',{name:'Continue as Guest',exact:true}).click()
    await page.locator('#shippingPhone').fill('+221 770000000')
    await page.locator('#addressLine1').fill('QA address')
    await page.locator('#city').fill('QA city')
    await page.locator('#postalCode').fill('1000')
  }
  await page.setViewportSize({width:1440,height:1000})
  await prepare(1)
  for(const [country,shipping,total] of [['NL','11.95','36.95'],['PT','20.95','45.95'],['ZA','32.95','57.95'],['GW','36.95','61.95'],['CA','32.95','57.95'],['BR','36.95','61.95'],['JP','36.95','61.95'],['AE','36.95','61.95'],['AU','36.95','61.95']]) {
    await page.locator('#country').selectOption(country)
    check(await page.getByText('€'+shipping,{exact:true}).count()>0,country+' shipping')
    check(await page.getByText('€'+total,{exact:true}).count()>0,country+' total')
  }
  await page.locator('#country').selectOption('AE')
  await page.locator('#postalCode').fill('')
  check(!(await page.locator('#postalCode').getAttribute('required')), 'UAE optional postcode')
  await page.locator('#country').selectOption('US')
  check(await page.getByRole('button',{name:'Continue to Payment'}).isDisabled(),'US quote blocks payment')
  check(await page.getByRole('link',{name:'Request a shipping quote'}).isVisible(),'Quote contact visible')
  await page.locator('#country').selectOption('ES')
  await page.locator('#postalCode').fill('35001')
  check(await page.getByRole('button',{name:'Continue to Payment'}).isDisabled(),'Canary Islands quote')
  await page.locator('#country').selectOption('GB')
  await page.locator('#postalCode').fill('BT1 1AA')
  check(await page.getByRole('button',{name:'Continue to Payment'}).isDisabled(),'Northern Ireland quote')
  await page.locator('#country').selectOption('ZA')
  await page.locator('#postalCode').fill('8000')
  await page.screenshot({path:'output/playwright/shipping-south-africa-desktop.png',fullPage:true})
  await page.setViewportSize({width:390,height:844})
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),'Mobile checkout fits')
  await page.screenshot({path:'output/playwright/shipping-south-africa-mobile.png',fullPage:true})
  await page.getByRole('button',{name:'Continue to Payment'}).click()
  await page.getByRole('button',{name:'Place Order',exact:true}).click()
  await page.getByText('QA: payment intercepted',{exact:true}).waitFor()
  check(payload.total===57.95 && payload.shippingCost===32.95 && payload.shippingMethod==='standard' && payload.shipping.phone==='+221 770000000','Canonical checkout payload and international phone')
  await page.setViewportSize({width:1440,height:1000})
  for(const [quantity,shipping,total] of [[2,'20.95','70.95'],[3,'22.95','97.95'],[4,'22.95','122.95']]) {
    await prepare(quantity)
    await page.locator('#country').selectOption('PT')
    check(await page.getByText('€'+shipping,{exact:true}).count()>0,quantity+' tees shipping')
    check(await page.getByText('€'+total,{exact:true}).count()>0,quantity+' tees total')
  }
  await prepare(5)
  await page.locator('#country').selectOption('PT')
  check(await page.getByRole('button',{name:'Continue to Payment'}).isDisabled(),'Five tees require quote')
  check(errors.length===0,'No browser errors: '+errors.join(', '))
  return {passed:true,checks:checks.length,payments:'intercepted, no order or email created'}
}
