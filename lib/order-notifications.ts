type EmailPayload = { from: string; to: string[]; subject: string; html: string }
type Mailer = (payload: EmailPayload, options: { idempotencyKey: string }) => Promise<{
  data: { id: string } | null; error: { message: string } | null
}>

export async function deliverOrderEmails(
  order: { orderNumber: string; customerEmail: string; customerHTML: string; adminHTML: string },
  mailer: Mailer, fromEmail: string, notificationEmail = 'cesar@dacosta-music.com'
) {
  const customer = await mailer({
    from: `Da Costa Music <${fromEmail}>`, to: [order.customerEmail],
    subject: `Order Confirmation - #${order.orderNumber}`, html: order.customerHTML,
  }, { idempotencyKey: `order-confirmation/${order.orderNumber}/customer` })
  if (customer.error || !customer.data) throw new Error(customer.error?.message || 'Email confirmation failed')
  const admin = await mailer({
    from: `Da Costa Music Shop <${fromEmail}>`, to: [notificationEmail],
    subject: `New Order #${order.orderNumber}`, html: order.adminHTML,
  }, { idempotencyKey: `order-confirmation/${order.orderNumber}/admin` })
  if (admin.error || !admin.data) throw new Error(admin.error?.message || 'Order notification failed')
  return { customerEmailId: customer.data.id, adminEmailId: admin.data.id }
}
