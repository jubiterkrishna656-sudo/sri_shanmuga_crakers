const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  emoji: { type: String, default: '🎆' },
  color: { type: String, default: 'from-yellow-400 to-orange-500' },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

categorySchema.index({ name: 1 });

module.exports = mongoose.model('Category', categorySchema);
