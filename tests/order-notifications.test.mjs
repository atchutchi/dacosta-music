import test from 'node:test'
import assert from 'node:assert/strict'
import { deliverOrderEmails } from '../lib/order-notifications.ts'

const order = { orderNumber: 'DC-TEST-1', customerEmail: 'buyer@example.com', customerHTML: '<p>Confirmation</p>', adminHTML: '<p>New order</p>' }
test('envia a confirmação ao cliente e a notificação para César com identificadores de repetição diferentes', async () => {
  const deliveries = []
  const mailer = async (payload, options) => { deliveries.push({ payload, options }); return { data: { id: 'email-1' }, error: null } }
  await deliverOrderEmails(order, mailer, 'orders@example.com')
  assert.deepEqual(deliveries.map(entry => entry.payload.to), [['buyer@example.com'], ['cesar@dacosta-music.com']])
  assert.equal(deliveries[0].options.idempotencyKey, 'order-confirmation/DC-TEST-1/customer')
  assert.equal(deliveries[1].options.idempotencyKey, 'order-confirmation/DC-TEST-1/admin')
})
test('uma rejeição do serviço de email é tratada como falha', async () => {
  await assert.rejects(deliverOrderEmails(order, async () => ({ data: null, error: { message: 'Provider rejected email' } }), 'orders@example.com'), /rejected/i)
})
