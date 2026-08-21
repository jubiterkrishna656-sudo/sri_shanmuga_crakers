const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productNumber: { type: String, default: '' },
  name: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  price: { type: Number, required: true },
  discountPrice: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  description: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  avgRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

productSchema.index({ category: 1, createdAt: -1 });
productSchema.index({ name: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ name: 'text', description: 'text' }, { weights: { name: 10, description: 5 } });

module.exports = mongoose.model('Product', productSchema);
