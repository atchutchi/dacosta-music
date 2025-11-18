// Facebook Pixel Events for E-commerce Tracking

declare global {
  interface Window {
    fbq: any;
  }
}

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '';

// Initialize Facebook Pixel
export const initFacebookPixel = () => {
  if (typeof window !== 'undefined' && FB_PIXEL_ID) {
    (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', FB_PIXEL_ID);
    window.fbq('track', 'PageView');
  }
};

// Event: Ver Produto
export const trackViewContent = (productId: string, productName: string, price: number, currency: string = 'EUR') => {
  if (typeof window !== 'undefined' && window.fbq && FB_PIXEL_ID) {
    window.fbq('track', 'ViewContent', {
      content_ids: [productId],
      content_name: productName,
      content_type: 'product',
      value: price,
      currency: currency.toUpperCase()
    });
    console.log('📊 FB Pixel: ViewContent -', productName);
  }
};

// Event: Adicionar ao Carrinho
export const trackAddToCart = (
  productId: string, 
  productName: string, 
  price: number, 
  quantity: number = 1,
  currency: string = 'EUR'
) => {
  if (typeof window !== 'undefined' && window.fbq && FB_PIXEL_ID) {
    window.fbq('track', 'AddToCart', {
      content_ids: [productId],
      content_name: productName,
      content_type: 'product',
      value: price * quantity,
      currency: currency.toUpperCase(),
      quantity: quantity
    });
    console.log('📊 FB Pixel: AddToCart -', productName);
  }
};

// Event: Compra Completa
export const trackPurchase = (
  orderNumber: string,
  productIds: string[],
  totalValue: number,
  currency: string = 'EUR',
  numItems: number = 1
) => {
  if (typeof window !== 'undefined' && window.fbq && FB_PIXEL_ID) {
    window.fbq('track', 'Purchase', {
      content_ids: productIds,
      content_type: 'product',
      value: totalValue,
      currency: currency.toUpperCase(),
      num_items: numItems,
      transaction_id: orderNumber
    });
    console.log('📊 FB Pixel: Purchase -', orderNumber);
  }
};

