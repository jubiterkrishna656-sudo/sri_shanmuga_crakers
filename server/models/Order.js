const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: { type: Number, required: true },
  address: { type: String, required: true },
  customerName: { type: String, default: '' },
  customerPhone: { type: String, default: '' },
  transactionId: { type: String, default: '' },
  paymentStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  orderStatus: { type: String, enum: ['pending', 'payment_verification', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  stockRestored: { type: Boolean, default: false },
  history: [{
    by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    byName: { type: String, default: '' },
    action: { type: String, default: '' },
    detail: { type: String, default: '' },
    at: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model('Order', orderSchema);
