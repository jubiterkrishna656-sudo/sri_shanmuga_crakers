const Product = require('../models/Product');
const Category = require('../models/Category');
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

    const isTextSearch = !!search;
    const filter = {};
    if (category && category !== 'all') filter.category = category;
    if (search) filter.$text = { $search: search };

    const sort = isTextSearch ? { score: { $meta: 'textScore' } } : { createdAt: -1 };
    const projection = isTextSearch ? { score: { $meta: 'textScore' } } : undefined;

    let products = await Product.find(filter, projection).sort(sort);
    if (category && category !== 'all') {
      products = products.filter(p => p.category === category);
    }

    let markedProducts = products.map(p => {
      const doc = p.toObject ? p.toObject() : p;
      return { ...doc, source: 'local' };
    });

    if (search && !isTextSearch) {
      const q = search.toLowerCase();
      markedProducts = markedProducts.filter(p =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
      );
    }

    const withStats = await withReviewStats(markedProducts);

    if (page) {
      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
      const start = (pageNum - 1) * limitNum;
      const paged = withStats.slice(start, start + limitNum);

      const result = {
        products: paged,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: withStats.length,
          pages: Math.ceil(withStats.length / limitNum)
        }
      };
      cache.set(cacheKey, result);
      return res.json(result);
    }

    cache.set(cacheKey, withStats);
    res.json(withStats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `product:${id}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const product = await Product.findById(id);
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
    const { name, category, price, discountPrice, stock, description, imageUrl, videoUrl, productNumber, featured } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    const num = productNumber || await getNextProductNumber();
    const product = await Product.create({
      productNumber: num, name, category, image, imageUrl, videoUrl,
      price: Number(price), discountPrice: Number(discountPrice) || 0,
      stock: Number(stock) || 0, description,
      featured: featured === true || featured === 'true'
    });
    cache.del('products:');
    cache.del('categories');

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, category, price, discountPrice, stock, description, imageUrl, videoUrl, productNumber, featured } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (category !== undefined) update.category = category;
    if (price !== undefined) update.price = Number(price);
    if (discountPrice !== undefined) update.discountPrice = Number(discountPrice) || 0;
    if (stock !== undefined) update.stock = Number(stock) || 0;
    if (description !== undefined) update.description = description;
    if (imageUrl !== undefined) update.imageUrl = imageUrl;
    if (videoUrl !== undefined) update.videoUrl = videoUrl;
    if (productNumber !== undefined) update.productNumber = productNumber;
    if (featured !== undefined) update.featured = featured === true || featured === 'true';
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

    const localCategoryNames = await Product.distinct('category');

    const merged = localCategoryNames.map(name => ({ name, emoji: '🎆', color: 'from-yellow-400 to-orange-500', source: 'local' }));

    const managedCategories = await Category.find().sort({ order: 1, name: 1 }).select('name emoji color');
    const managedNames = managedCategories.map(c => c.name);

    const allCategories = [
      ...managedCategories.map(c => ({ ...c.toObject(), source: 'local' })),
      ...merged.filter(c => !managedNames.includes(c.name))
    ];

    const seen = new Set();
    const deduped = allCategories.filter(c => {
      if (seen.has(c.name)) return false;
      seen.add(c.name);
      return true;
    });

    cache.set('categories', deduped, 60000);
    res.json(deduped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};