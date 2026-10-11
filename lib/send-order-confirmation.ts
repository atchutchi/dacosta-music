import { Resend } from 'resend'
import { getOrderConfirmationEmailHTML, getAdminNewOrderEmailHTML, type OrderEmailData } from '@/lib/email-templates'
import { deliverOrderEmails } from '@/lib/order-notifications'

export async function sendOrderConfirmation(data: OrderEmailData) {
  if (!process.env.RESEND_API_KEY) throw new Error('Order email is not configured')
  const resend = new Resend(process.env.RESEND_API_KEY)
  return deliverOrderEmails({
    orderNumber: data.orderNumber, customerEmail: data.customerEmail,
    customerHTML: getOrderConfirmationEmailHTML(data), adminHTML: getAdminNewOrderEmailHTML(data),
  }, (payload, options) => resend.emails.send(payload, options),
  process.env.EMAIL_FROM || 'orders@dacosta-music.com',
  process.env.ORDER_NOTIFICATION_EMAIL || 'cesar@dacosta-music.com')
}
