const Product = require('../models/Product');
const Review = require('../models/Review');
const Counter = require('../models/Counter');
const fs = require('fs');
const path = require('path');
const cache = require('../utils/cache');

const round = (n) => Math.round(n * 10) / 10;

async function maxProductNumber() {
  const [row] = await Product.aggregate([
    { $match: { productNumber: { $regex: /^[0-9]+$/ } } },
    { $project: { num: { $toInt: '$productNumber' } } },
    { $sort: { num: -1 } },
    { $limit: 1 }
  ]);
  return (row && Number.isFinite(row.num)) ? row.num : 0;
}

async function getNextProductNumber() {
  await Counter.updateOne(
    { _id: 'productNumber' },
    { $setOnInsert: { seq: await maxProductNumber() } },
    { upsert: true }
  );
  const counter = await Counter.findOneAndUpdate(
    { _id: 'productNumber' },
    { $inc: { seq: 1 } },
    { new: true }
  );
  return String(counter.seq).padStart(3, '0');
}

async function withReviewStats(products) {
  if (!products.length) return products;
  const ids = products.map(p => p._id);
  const stats = await Review.aggregate([
    { $match: { productId: { $in: ids } } },
    { $group: { _id: '$productId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  const statsMap = new Map(stats.map(s => [String(s._id), { avgRating: round(s.avgRating), count: s.count }]));

  const writes = [];
  products.forEach(p => {
    const s = statsMap.get(String(p._id));
    const avg = s ? s.avgRating : 0;
    const count = s ? s.count : 0;
    if (p.avgRating !== avg || p.reviewCount !== count) {
      writes.push({ updateOne: { filter: { _id: p._id }, update: { $set: { avgRating: avg, reviewCount: count } } } });
    }
  });
  if (writes.length) await Product.bulkWrite(writes);

  return products.map(p => {
    const doc = p.toObject ? p.toObject() : p;
    const s = statsMap.get(String(p._id));
    return {
      ...doc,
      avgRating: s ? s.avgRating : 0,
      reviewCount: s ? s.count : 0
    };
  });
}

exports.getProducts = async (req, res) => {
  try {
    const { category, search, page, limit = 12 } = req.query;
    const cacheKey = `products:${category || ''}:${search || ''}:${page || ''}:${limit}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    let filter = {};
    if (category && category !== 'all') filter.category = category;
    if (search) filter.name = { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };

    let result;
    if (page) {
      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
      const skip = (pageNum - 1) * limitNum;

      const [products, total] = await Promise.all([
        Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
        Product.countDocuments(filter)
      ]);

      const withStats = await withReviewStats(products);

      result = {
        products: withStats,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      };
    } else {
      const products = await Product.find(filter).sort({ createdAt: -1 });
      result = await withReviewStats(products);
    }

    cache.set(cacheKey, result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const cacheKey = `product:${req.params.id}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const [withStats] = await withReviewStats([product]);
    cache.set(cacheKey, withStats);
    res.json(withStats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, category, price, discountPrice, stock, description, imageUrl, videoUrl, productNumber } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    const num = productNumber || await getNextProductNumber();
    const product = await Product.create({ productNumber: num, name, category, image, imageUrl, videoUrl, price, discountPrice, stock, description });
    cache.del('products:');
    cache.del('categories');
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, category, price, discountPrice, stock, description, imageUrl, videoUrl, productNumber } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (category !== undefined) update.category = category;
    if (price !== undefined) update.price = price;
    if (discountPrice !== undefined) update.discountPrice = discountPrice;
    if (stock !== undefined) update.stock = stock;
    if (description !== undefined) update.description = description;
    if (imageUrl !== undefined) update.imageUrl = imageUrl;
    if (videoUrl !== undefined) update.videoUrl = videoUrl;
    if (productNumber !== undefined) update.productNumber = productNumber;
    if (req.file) {
      const old = await Product.findById(req.params.id);
      if (old?.image) {
        const oldPath = path.join(__dirname, '..', old.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      update.image = `/uploads/${req.file.filename}`;
    }
    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
    cache.del('products:');
    cache.del(`product:${req.params.id}`);
    cache.del('categories');
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product?.image) {
      const p = path.join(__dirname, '..', product.image);
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }
    await Promise.all([
      Product.findByIdAndDelete(req.params.id),
      Review.deleteMany({ productId: req.params.id })
    ]);
    cache.del('products:');
    cache.del(`product:${req.params.id}`);
    cache.del('categories');
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const cached = cache.get('categories');
    if (cached) return res.json(cached);
    const categories = await Product.distinct('category');
    cache.set('categories', categories, 60000);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};