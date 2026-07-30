const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');

const isValidUserId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.getCart = async (req, res) => {
  try {
    if (!isValidUserId(req.userId)) return res.json({ items: [] });
    let cart = await Cart.findOne({ userId: req.userId }).populate('items.productId');
    if (!cart) cart = { items: [] };
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    if (!isValidUserId(req.userId)) return res.status(400).json({ error: 'Invalid user account' });
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      cart = new Cart({ userId: req.userId, items: [] });
    }

    const idx = cart.items.findIndex(i => i.productId.toString() === productId);
    if (idx > -1) {
      cart.items[idx].quantity += quantity;
    } else {
      cart.items.push({
        productId: product._id,
        name: product.name,
        image: product.image,
        price: product.discountPrice || product.price,
        quantity
      });
    }

    await cart.save();
    cart = await Cart.findOne({ userId: req.userId }).populate('items.productId');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    if (!isValidUserId(req.userId)) return res.status(400).json({ error: 'Invalid user account' });
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const idx = cart.items.findIndex(i => i.productId.toString() === productId);
    if (idx === -1) return res.status(404).json({ error: 'Item not in cart' });

    if (quantity <= 0) {
      cart.items.splice(idx, 1);
    } else {
      cart.items[idx].quantity = quantity;
    }

    await cart.save();
    const updated = await Cart.findOne({ userId: req.userId }).populate('items.productId');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    if (!isValidUserId(req.userId)) return res.status(400).json({ error: 'Invalid user account' });
    const { productId } = req.params;
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items = cart.items.filter(i => i.productId.toString() !== productId);
    await cart.save();
    const updated = await Cart.findOne({ userId: req.userId }).populate('items.productId');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    if (!isValidUserId(req.userId)) return res.json({ message: 'Cart cleared', items: [] });
    await Cart.findOneAndDelete({ userId: req.userId });
    res.json({ message: 'Cart cleared', items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
