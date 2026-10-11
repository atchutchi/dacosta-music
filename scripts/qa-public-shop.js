async (page) => {
  const base = 'https://www.dacosta-music.com'
  const akhet = 'AKHET ADE 2026 Limited Edition Oversized T-Shirt'
  const caiiro = 'Caiiro London 2025 Limited Edition Oversized T-Shirt'
  const errors = [], failures = []
  const check = (ok, message) => { if (!ok) failures.push(message) }
  const settleProduct = async name => {
    await page.getByRole('heading',{name,exact:true}).scrollIntoViewIfNeeded()
    await page.waitForFunction(productName => {
      let el = Array.from(document.querySelectorAll('h3')).find(e=>e.textContent === productName)
      if(!el)return false
      while(el){if(Number(getComputedStyle(el).opacity)<0.99)return false;el=el.parentElement}
      return Array.from(document.querySelectorAll('main img')).every(img=>img.complete && img.naturalWidth>0)
    }, name)
  }
  page.on('pageerror', error => errors.push(error.message))
  let pixelRequests = 0, paymentRequests = 0
  await page.route('https://connect.facebook.net/**', route => { pixelRequests++; return route.fulfill({contentType:'application/javascript',body:''}) })
  await page.route('https://www.facebook.com/**', route => route.abort())
  await page.route('**/api/checkout/stripe', route => { paymentRequests++; return route.abort() })
  await page.setViewportSize({width:1440,height:1080})
  await page.goto(`${base}/shop`)
  await page.evaluate(()=>localStorage.clear())
  await page.reload()
  await page.getByRole('heading',{name:akhet,exact:true}).waitFor()
  await page.getByRole('heading',{name:caiiro,exact:true}).waitFor()
  await page.getByRole('button',{name:'Reject marketing cookies',exact:true}).click()
  check(pixelRequests === 0,'Pixel loaded before consent')
  check(await page.getByText('VAT included',{exact:true}).isVisible(),'VAT missing from shop')
  await settleProduct(caiiro)
  await page.evaluate(()=>window.scrollTo(0,0))
  await page.screenshot({path:'output/public-shop-desktop.png',fullPage:true})
  await page.goto(`${base}/shop/product/akhet-ade-2026-limited-edition-oversized-t-shirt`)
  await page.getByRole('heading',{name:akhet,exact:true}).waitFor()
  check(await page.getByText('€25.00',{exact:true}).count() > 0,'Wrong AKHET price')
  await page.getByRole('button',{name:'XS',exact:true}).click()
  check(await page.getByText('10 available',{exact:true}).isVisible(),'Wrong XS stock')
  await page.getByRole('button',{name:'M',exact:true}).click()
  check(await page.getByText('30 available',{exact:true}).isVisible(),'Wrong M stock')
  await page.getByRole('img',{name:`${akhet} 2`,exact:true}).click()
  check((await page.getByRole('img',{name:akhet,exact:true}).getAttribute('src')).endsWith('back.webp'),'Back image not served')
  await page.getByRole('button',{name:'Add to Cart',exact:true}).click()
  await page.goto(`${base}/shop/product/caiiro-london-2025-limited-edition-oversized-t-shirt`)
  await page.getByRole('heading',{name:caiiro,exact:true}).waitFor()
  await page.getByRole('button',{name:'Add to Cart',exact:true}).click()
  await page.goto(`${base}/shop/cart`)
  await page.getByText(akhet,{exact:true}).waitFor()
  check(await page.getByText(caiiro,{exact:true}).isVisible(),'Caiiro missing from cart')
  check(await page.getByText('€65.00',{exact:true}).count() > 0,'Cart subtotal incorrect')
  await page.goto(`${base}/shop/checkout`)
  await page.getByText('Online payments will be available soon',{exact:true}).waitFor()
  await page.screenshot({path:'output/public-checkout-status.png',fullPage:true})
  check(paymentRequests === 0,'A payment was attempted during read-only QA')
  await page.goto(`${base}/shop`)
  await page.setViewportSize({width:390,height:844})
  await page.getByRole('heading',{name:akhet,exact:true}).waitFor()
  check(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth),'Mobile shop overflow')
  await settleProduct(caiiro)
  await settleProduct(akhet)
  await page.evaluate(()=>window.scrollTo(0,0))
  await page.screenshot({path:'output/public-shop-mobile.png',fullPage:true})
  await page.setViewportSize({width:1440,height:1080})
  await page.getByRole('button',{name:'Cookie settings',exact:true}).click()
  const pixelResponse = page.waitForResponse('https://connect.facebook.net/en_US/fbevents.js')
  await page.getByRole('button',{name:'Accept marketing cookies',exact:true}).click()
  await pixelResponse
  check(pixelRequests === 1,'Pixel did not load after consent')
  const commands = await page.evaluate(()=>window.fbq?.queue ?? [])
  check(commands.some(command=>command[0] === 'init' && command[1] === '834660132483518'),'Wrong Meta Pixel ID')
  await page.getByRole('button',{name:'Cookie settings',exact:true}).click()
  await page.getByRole('button',{name:'Reject marketing cookies',exact:true}).click()
  check(errors.length === 0,`Browser errors: ${errors.join(', ')}`)
  if(failures.length) throw new Error(failures.join('; '))
  return {passed:true,products:2,cartSubtotal:65,payments:'unavailable until Stripe activation; no payment attempted',pixelRequests,errors}
}
