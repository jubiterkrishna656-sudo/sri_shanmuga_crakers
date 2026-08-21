const Category = require('../models/Category');
const cache = require('../utils/cache');

exports.getCategories = async (req, res) => {
  try {
    const cached = cache.get('categories:all');
    if (cached) return res.json(cached);
    const categories = await Category.find().sort({ order: 1, name: 1 });
    cache.set('categories:all', categories, 60000);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, emoji, color, order } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ error: 'Category already exists' });
    }
    const category = await Category.create({ name: name.trim(), emoji, color, order });
    cache.del('categories:all');
    cache.del('categories');
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, emoji, color, order } = req.body;
    const update = {};
    if (name !== undefined) update.name = name.trim();
    if (emoji !== undefined) update.emoji = emoji;
    if (color !== undefined) update.color = color;
    if (order !== undefined) update.order = order;

    const category = await Category.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    cache.del('categories:all');
    cache.del('categories');
    res.json(category);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Category name already exists' });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    cache.del('categories:all');
    cache.del('categories');
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
