const Review = require('../models/Review');
const Product = require('../models/Product');
const cache = require('../utils/cache');

const round = (n) => Math.round(n * 10) / 10;

async function refreshProductStats(productId) {
  const stats = await Review.aggregate([
    { $match: { productId } },
    { $group: { _id: '$productId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  const s = stats[0];
  await Product.findByIdAndUpdate(productId, {
    avgRating: s ? round(s.avgRating) : 0,
    reviewCount: s ? s.count : 0
  });
  cache.del('products:');
  cache.del(`product:${productId}`);
  cache.del(`reviews:${productId}`);
}

exports.getProductReviews = async (req, res) => {
  try {
    const cacheKey = `reviews:${req.params.id}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const reviews = await Review.find({ productId: req.params.id })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });
    cache.set(cacheKey, reviews, 30000);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    let review;
    const existing = await Review.findOne({ productId: req.params.id, userId: req.userId });
    if (existing) {
      existing.rating = req.body.rating;
      existing.comment = req.body.comment || '';
      await existing.save();
      review = existing;
    } else {
      review = await Review.create({
        productId: req.params.id,
        userId: req.userId,
        rating: req.body.rating,
        comment: req.body.comment || ''
      });
    }

    await refreshProductStats(req.params.id);
    const populated = await Review.findById(review._id).populate('userId', 'name');
    res.status(existing ? 200 : 201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findOne({ _id: req.params.reviewId, productId: req.params.id });
    if (!review) return res.status(404).json({ error: 'Review not found' });
    if (review.userId.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await Review.findByIdAndDelete(review._id);
    await refreshProductStats(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
