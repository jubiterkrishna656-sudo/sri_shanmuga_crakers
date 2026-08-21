const ADMIN_WHATSAPP = '918778353490';

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const shortId = (id) => String(id).slice(-8).toUpperCase();

function buildAdminNewOrderMessage(order) {
  const items = order.products.map(p => `  • ${p.name} x ${p.quantity} = ${inr(p.price * p.quantity)}`).join('\n');
  const orderNum = order.orderNumber || `#${shortId(order._id)}`;
  return [
    `🎆 *New Order Received!*`,
    ``,
    `Order: *${orderNum}*`,
    `Customer: ${order.customerName || 'N/A'}`,
    `Phone: ${order.customerPhone || 'N/A'}`,
    `Address: ${order.address || 'N/A'}`,
    `Payment Ref: ${order.transactionId || 'N/A'}`,
    ``,
    `*Items:*`,
    items,
    ``,
    `*Total: ${inr(order.totalAmount)}*`,
    ``,
    `Status: ${order.orderStatus}`
  ].join('\n');
}

function buildCustomerThanksMessage(order) {
  const orderNum = order.orderNumber || `#${shortId(order._id)}`;
  return [
    `🎆 Thank you for choosing *Shanmuga Crackers*!`,
    ``,
    `Hi ${order.customerName || 'there'},`,
    ``,
    `Your order *${orderNum}* has been received successfully.`,
    `Total: *${inr(order.totalAmount)}*`,
    ``,
    `We will update you once your order is confirmed.`,
    ``,
    `— Sri Shanmuga Grand Crackers`
  ].join('\n');
}

function getAdminNewOrderUrl(order) {
  const msg = buildAdminNewOrderMessage(order);
  return `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(msg)}`;
}

function getCustomerThanksUrl(order) {
  const phone = order.customerPhone ? `91${order.customerPhone}` : '';
  if (!phone) return null;
  const msg = buildCustomerThanksMessage(order);
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

module.exports = {
  ADMIN_WHATSAPP,
  getAdminNewOrderUrl,
  getCustomerThanksUrl,
  buildAdminNewOrderMessage,
  buildCustomerThanksMessage
};
