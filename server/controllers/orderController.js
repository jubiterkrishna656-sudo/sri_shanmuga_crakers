const Order = require('../models/Order');
const Product = require('../models/Product');
const Counter = require('../models/Counter');
const cache = require('../utils/cache');
const { MIN_ORDER_AMOUNT } = require('../utils/constants');
const { getAdminNewOrderUrl, getCustomerThanksUrl } = require('../utils/whatsapp');

async function getNextOrderNumber() {
  const counter = await Counter.findOneAndUpdate(
    { _id: 'orderNumber' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `SC${String(counter.seq).padStart(3, '0')}`;
}

const ORDER_FLOW = {
  pending: ['payment_verification', 'confirmed', 'cancelled'],
  payment_verification: ['confirmed', 'cancelled'],
  confirmed: ['packed', 'cancelled'],
  packed: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: []
};

const PAYMENT_FLOW = {
  pending: ['verified', 'rejected'],
  verified: [],
  rejected: []
};

exports.placeOrder = async (req, res) => {
  try {
    const { products, name, phone, address, transactionId } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const productIds = products.map(p => p.productId).filter(Boolean);
    if (productIds.length !== products.length) {
      return res.status(400).json({ error: 'Invalid product in cart' });
    }

    const found = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(found.map(p => [String(p._id), p]));

    const orderProducts = [];
    for (const p of products) {
      const prod = productMap.get(p.productId);
      if (!prod) {
        return res.status(400).json({ error: 'One or more products are no longer available' });
      }
      const qty = Number(p.quantity);
      if (!Number.isInteger(qty) || qty <= 0) {
        return res.status(400).json({ error: 'Invalid quantity' });
      }
      orderProducts.push({
        productId: prod._id,
        name: prod.name,
        quantity: qty,
        price: prod.discountPrice || prod.price
      });
    }

    const totalAmount = orderProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);

    if (totalAmount < MIN_ORDER_AMOUNT) {
      return res.status(400).json({ error: `Minimum order amount is ₹${MIN_ORDER_AMOUNT}` });
    }

    const deducted = [];
    for (const item of orderProducts) {
      const result = await Product.findOneAndUpdate(
        { _id: item.productId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
      if (!result) {
        for (const d of deducted) {
          await Product.findByIdAndUpdate(d.id, { $inc: { stock: d.qty } });
        }
        return res.status(400).json({
          error: `Insufficient stock for "${item.name}".`
        });
      }
      deducted.push({ id: item.productId, qty: item.quantity });
    }

    const orderNumber = await getNextOrderNumber();

    const order = await Order.create({
      orderNumber,
      userId: req.userId || undefined,
      products: orderProducts,
      totalAmount,
      address,
      customerName: name || '',
      customerPhone: phone || '',
      transactionId: transactionId || '',
      paymentStatus: 'pending',
      orderStatus: 'pending',
      history: [{ byName: name || 'Customer', action: 'Order placed', detail: 'pending', at: new Date() }]
    });

    orderProducts.forEach(p => cache.del(`product:${p.productId}`));
    cache.del('products:');

    const adminWhatsAppUrl = getAdminNewOrderUrl(order);
    console.log(`[whatsapp] New order ${orderNumber} — Admin notification: ${adminWhatsAppUrl}`);

    res.status(201).json({ ...order.toObject(), adminWhatsAppUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fields safe to expose to guests looking up orders by phone number.
// Deliberately excludes sensitive data (address, transactionId, history).
const PUBLIC_ORDER_FIELDS = ['_id', 'orderNumber', 'products', 'totalAmount', 'customerName', 'customerPhone', 'paymentStatus', 'orderStatus', 'stockRestored', 'createdAt'];

exports.getOrdersByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    if (!phone || !/^[0-9]{6,15}$/.test(phone)) {
      return res.status(400).json({ error: 'Valid phone number is required' });
    }
    const orders = await Order.find({ customerPhone: phone }).sort({ createdAt: -1 });
    if (req.userRole === 'admin') {
      return res.json(orders);
    }
    const sanitized = orders.map(o => {
      const doc = o.toObject ? o.toObject() : o;
      const clean = {};
      PUBLIC_ORDER_FIELDS.forEach(f => { if (doc[f] !== undefined) clean[f] = doc[f]; });
      return clean;
    });
    res.json(sanitized);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email phone').sort({ createdAt: -1 });
    const withWhatsApp = orders.map(o => {
      const obj = o.toObject();
      obj.adminWhatsAppUrl = getAdminNewOrderUrl(obj);
      return obj;
    });
    res.json(withWhatsApp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (orderStatus && orderStatus !== order.orderStatus) {
      if (!ORDER_FLOW[order.orderStatus]?.includes(orderStatus)) {
        return res.status(400).json({ error: `Cannot change status from "${order.orderStatus}" to "${orderStatus}"` });
      }
    }
    if (paymentStatus && paymentStatus !== order.paymentStatus) {
      if (!PAYMENT_FLOW[order.paymentStatus]?.includes(paymentStatus)) {
        return res.status(400).json({ error: `Cannot change payment from "${order.paymentStatus}" to "${paymentStatus}"` });
      }
    }

    const update = {};
    if (orderStatus) update.orderStatus = orderStatus;
    if (paymentStatus) update.paymentStatus = paymentStatus;
    // Marking an order delivered implies payment has been received.
    if (orderStatus === 'delivered') update.paymentStatus = 'verified';
    // A rejected payment means the order cannot proceed — auto-cancel it so the
    // reserved stock is released (the stock-restore block below handles it).
    const paymentRejected = paymentStatus === 'rejected' && order.paymentStatus !== 'rejected';
    const effectiveOrderStatus = paymentRejected ? 'cancelled' : orderStatus;
    if (paymentRejected) update.orderStatus = 'cancelled';

    // Record who made the change (admin audit trail).
    const changes = [];
    if (effectiveOrderStatus && effectiveOrderStatus !== order.orderStatus) changes.push(`${order.orderStatus} → ${effectiveOrderStatus}`);
    if (paymentStatus && paymentStatus !== order.paymentStatus) changes.push(`payment ${order.paymentStatus} → ${paymentStatus}`);
    if (changes.length > 0) {
      update.$push = {
        history: {
          by: req.userId,
          byName: req.userName || 'Admin',
          action: effectiveOrderStatus === 'cancelled' ? 'Order cancelled' : 'Order updated',
          detail: changes.join(', '),
          at: new Date()
        }
      };
    }

    // Restore stock (once) when an order that reserved stock is cancelled.
    if (effectiveOrderStatus === 'cancelled' && !order.stockRestored) {
      for (const item of order.products) {
        if (item.productId) {
          await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } });
          cache.del(`product:${item.productId}`);
        }
      }
      update.stockRestored = true;
      cache.del('products:');
    }

    const updated = await Order.findByIdAndUpdate(req.params.id, update, { new: true });

    if (changes.length > 0) {
      const thanksUrl = getCustomerThanksUrl(updated);
      if (thanksUrl) {
        console.log(`[whatsapp] Order ${updated.orderNumber || String(updated._id).slice(-8).toUpperCase()} — Customer thanks: ${thanksUrl}`);
        updated._doc.customerWhatsAppUrl = thanksUrl;
      }
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.ORDER_FLOW = ORDER_FLOW;
exports.PAYMENT_FLOW = PAYMENT_FLOW;

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (!['delivered', 'cancelled'].includes(order.orderStatus) && !order.stockRestored) {
      for (const item of order.products) {
        if (item.productId) {
          await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.quantity } });
          cache.del(`product:${item.productId}`);
        }
      }
      cache.del('products:');
    }

    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};