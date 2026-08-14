const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

exports.getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, revenueResult, pendingOrders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'cancelled' }, paymentStatus: { $ne: 'rejected' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.countDocuments({ orderStatus: { $in: ['pending', 'payment_verification'] } })
    ]);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: revenueResult[0]?.total || 0,
      pendingOrders
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReports = async (req, res) => {
  try {
    const [statusGroup, topProducts, dailyRevenue] = await Promise.all([
      Order.aggregate([{ $group: { _id: '$orderStatus', count: { $sum: 1 } } }]),
      Order.aggregate([
        { $unwind: '$products' },
        { $match: { 'products.name': { $exists: true, $ne: '' }, orderStatus: { $ne: 'cancelled' }, paymentStatus: { $ne: 'rejected' } } },
        {
          $group: {
            _id: '$products.name',
            name: { $first: '$products.name' },
            quantity: { $sum: '$products.quantity' },
            revenue: { $sum: { $multiply: ['$products.price', '$products.quantity'] } }
          }
        },
        { $sort: { quantity: -1 } },
        { $limit: 10 },
        { $project: { _id: 0, name: 1, quantity: 1, revenue: 1 } }
      ]),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'cancelled' }, paymentStatus: { $ne: 'rejected' } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$totalAmount' } } },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, date: '$_id', revenue: 1 } }
      ])
    ]);

    const orderStatusCount = { pending: 0, payment_verification: 0, confirmed: 0, packed: 0, shipped: 0, delivered: 0, cancelled: 0 };
    statusGroup.forEach(s => { if (orderStatusCount[s._id] !== undefined) orderStatusCount[s._id] = s.count; });

    res.json({ orderStatusCount, topProducts, revenueChart: dailyRevenue.slice(-30) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
