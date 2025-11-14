// Email templates para notificações de pedidos

export interface OrderEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  items: Array<{
    name: string
    quantity: number
    price: number
    size?: string
    color?: string
    image?: string
  }>
  subtotal: number
  shipping: number
  total: number
  shippingAddress: {
    name: string
    addressLine1: string
    addressLine2?: string
    city: string
    state?: string
    country: string
    postalCode: string
  }
}

export function getOrderConfirmationEmailHTML(data: OrderEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - ${data.orderNumber}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: #000000;
      color: #ffffff;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: bold;
    }
    .content {
      padding: 30px 20px;
    }
    .success-icon {
      text-align: center;
      font-size: 60px;
      margin-bottom: 20px;
    }
    .order-info {
      background-color: #f8f8f8;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .order-info h2 {
      margin-top: 0;
      font-size: 18px;
      color: #000;
    }
    .item {
      border-bottom: 1px solid #e0e0e0;
      padding: 15px 0;
      display: flex;
      gap: 15px;
    }
    .item:last-child {
      border-bottom: none;
    }
    .item-image {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 4px;
      background-color: #f0f0f0;
    }
    .item-details {
      flex: 1;
    }
    .item-name {
      font-weight: 600;
      margin-bottom: 5px;
    }
    .item-meta {
      font-size: 14px;
      color: #666;
    }
    .item-price {
      text-align: right;
      font-weight: 600;
    }
    .totals {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 2px solid #000;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
    }
    .total-row.grand-total {
      font-size: 20px;
      font-weight: bold;
      color: #000;
      padding-top: 15px;
      border-top: 1px solid #e0e0e0;
      margin-top: 10px;
    }
    .shipping-address {
      background-color: #f8f8f8;
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
    }
    .shipping-address h3 {
      margin-top: 0;
      font-size: 16px;
    }
    .footer {
      background-color: #000000;
      color: #ffffff;
      padding: 20px;
      text-align: center;
      font-size: 14px;
    }
    .footer a {
      color: #ffffff;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎵 DA COSTA MUSIC</h1>
    </div>
    
    <div class="content">
      <div class="success-icon">✅</div>
      
      <h2 style="text-align: center; margin-bottom: 10px;">Order Confirmed!</h2>
      <p style="text-align: center; color: #666; margin-top: 0;">
        Thank you for your purchase, ${data.customerName}!
      </p>
      
      <div class="order-info">
        <h2>Order #${data.orderNumber}</h2>
        <p style="margin: 5px 0; color: #666;">
          <strong>Date:</strong> ${new Date().toLocaleDateString('pt-PT', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
      
      <h3>Order Items</h3>
      <div>
        ${data.items.map(item => `
          <div class="item">
            ${item.image ? `<img src="${item.image}" alt="${item.name}" class="item-image">` : ''}
            <div class="item-details">
              <div class="item-name">${item.name}</div>
              <div class="item-meta">
                ${item.size ? `Size: ${item.size}` : ''} 
                ${item.color ? `• ${item.color}` : ''}
                <br>Quantity: ${item.quantity}
              </div>
            </div>
            <div class="item-price">€${(item.price * item.quantity).toFixed(2)}</div>
          </div>
        `).join('')}
      </div>
      
      <div class="totals">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>€${data.subtotal.toFixed(2)}</span>
        </div>
        <div class="total-row">
          <span>Shipping:</span>
          <span>€${data.shipping.toFixed(2)}</span>
        </div>
        <div class="total-row grand-total">
          <span>Total:</span>
          <span>€${data.total.toFixed(2)}</span>
        </div>
      </div>
      
      <div class="shipping-address">
        <h3>📦 Shipping Address</h3>
        <p style="margin: 5px 0;">
          ${data.shippingAddress.name}<br>
          ${data.shippingAddress.addressLine1}<br>
          ${data.shippingAddress.addressLine2 ? `${data.shippingAddress.addressLine2}<br>` : ''}
          ${data.shippingAddress.city}, ${data.shippingAddress.state || ''} ${data.shippingAddress.postalCode}<br>
          ${data.shippingAddress.country}
        </p>
      </div>
      
      <p style="margin-top: 30px; text-align: center; color: #666;">
        We'll send you another email when your order ships. If you have any questions, 
        please <a href="http://dacosta-music.com/#contact" style="color: #000;">contact us</a>.
      </p>
    </div>
    
    <div class="footer">
      <p style="margin: 0;">© ${new Date().getFullYear()} Da Costa Music. All rights reserved.</p>
      <p style="margin: 10px 0 0 0;">
        <a href="http://dacosta-music.com">Visit our website</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

export function getAdminNewOrderEmailHTML(data: OrderEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Order - ${data.orderNumber}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: #FF6B00;
      color: #ffffff;
      padding: 30px 20px;
      text-align: center;
    }
    .content {
      padding: 30px 20px;
    }
    .alert {
      background-color: #fff3cd;
      border-left: 4px solid #FF6B00;
      padding: 15px;
      margin-bottom: 20px;
    }
    .info-box {
      background-color: #f8f8f8;
      padding: 15px;
      border-radius: 8px;
      margin: 15px 0;
    }
    .item {
      border-bottom: 1px solid #e0e0e0;
      padding: 10px 0;
    }
    .totals {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 2px solid #000;
      font-size: 16px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔔 NEW ORDER RECEIVED</h1>
    </div>
    
    <div class="content">
      <div class="alert">
        <strong>⚠️ Action Required:</strong> A new order has been placed and requires processing.
      </div>
      
      <h2>Order #${data.orderNumber}</h2>
      
      <div class="info-box">
        <h3 style="margin-top: 0;">Customer Information</h3>
        <p style="margin: 5px 0;"><strong>Name:</strong> ${data.customerName}</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${data.customerEmail}">${data.customerEmail}</a></p>
      </div>
      
      <div class="info-box">
        <h3 style="margin-top: 0;">Shipping Address</h3>
        <p style="margin: 5px 0;">
          ${data.shippingAddress.name}<br>
          ${data.shippingAddress.addressLine1}<br>
          ${data.shippingAddress.addressLine2 ? `${data.shippingAddress.addressLine2}<br>` : ''}
          ${data.shippingAddress.city}, ${data.shippingAddress.state || ''} ${data.shippingAddress.postalCode}<br>
          ${data.shippingAddress.country}
        </p>
      </div>
      
      <h3>Order Items</h3>
      ${data.items.map(item => `
        <div class="item">
          <strong>${item.name}</strong><br>
          ${item.size ? `Size: ${item.size}` : ''} ${item.color ? `• ${item.color}` : ''}<br>
          Quantity: ${item.quantity} × €${item.price.toFixed(2)} = €${(item.price * item.quantity).toFixed(2)}
        </div>
      `).join('')}
      
      <div class="totals">
        <div style="display: flex; justify-content: space-between; margin: 5px 0;">
          <span>Subtotal:</span>
          <span>€${data.subtotal.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin: 5px 0;">
          <span>Shipping:</span>
          <span>€${data.shipping.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1px solid #e0e0e0; font-size: 18px;">
          <span>TOTAL:</span>
          <span>€${data.total.toFixed(2)}</span>
        </div>
      </div>
      
      <p style="margin-top: 30px; padding: 15px; background-color: #e7f3ff; border-radius: 8px;">
        <strong>Next Steps:</strong><br>
        1. Process the order in the admin panel<br>
        2. Prepare items for shipping<br>
        3. Mark as "shipped" when dispatched
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

export function getOrderShippedEmailHTML(data: OrderEmailData & { trackingNumber?: string; trackingUrl?: string }): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Shipped - ${data.orderNumber}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: #4CAF50;
      color: #ffffff;
      padding: 30px 20px;
      text-align: center;
    }
    .content {
      padding: 30px 20px;
    }
    .tracking-box {
      background-color: #e7f3ff;
      border: 2px solid #2196F3;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin: 20px 0;
    }
    .tracking-button {
      display: inline-block;
      background-color: #2196F3;
      color: #ffffff;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📦 Your Order Has Shipped!</h1>
    </div>
    
    <div class="content">
      <h2 style="text-align: center;">Good news, ${data.customerName}!</h2>
      <p style="text-align: center; font-size: 16px; color: #666;">
        Your order #${data.orderNumber} is on its way!
      </p>
      
      ${data.trackingNumber ? `
        <div class="tracking-box">
          <h3 style="margin-top: 0;">Tracking Information</h3>
          <p style="font-size: 18px; font-weight: bold; margin: 10px 0;">
            ${data.trackingNumber}
          </p>
          ${data.trackingUrl ? `
            <a href="${data.trackingUrl}" class="tracking-button">Track Your Package</a>
          ` : ''}
        </div>
      ` : ''}
      
      <h3>Shipping Address</h3>
      <p style="background-color: #f8f8f8; padding: 15px; border-radius: 8px;">
        ${data.shippingAddress.name}<br>
        ${data.shippingAddress.addressLine1}<br>
        ${data.shippingAddress.addressLine2 ? `${data.shippingAddress.addressLine2}<br>` : ''}
        ${data.shippingAddress.city}, ${data.shippingAddress.state || ''} ${data.shippingAddress.postalCode}<br>
        ${data.shippingAddress.country}
      </p>
      
      <p style="text-align: center; margin-top: 30px; color: #666;">
        If you have any questions about your shipment, please <a href="http://dacosta-music.com/#contact">contact us</a>.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

