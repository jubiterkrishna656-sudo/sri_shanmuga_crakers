const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Review = require('./models/Review');
const Category = require('./models/Category');
const Counter = require('./models/Counter');

async function cleanup() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected\n');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@shanmuga.com';

    // Count before
    const usersBefore = await User.countDocuments();
    const productsBefore = await Product.countDocuments();
    const ordersBefore = await Order.countDocuments();
    const reviewsBefore = await Review.countDocuments();
    const categoriesBefore = await Category.countDocuments();

    console.log('=== BEFORE CLEANUP ===');
    console.log(`  Users:     ${usersBefore}`);
    console.log(`  Products:  ${productsBefore}`);
    console.log(`  Orders:    ${ordersBefore}`);
    console.log(`  Reviews:   ${reviewsBefore}`);
    console.log(`  Categories: ${categoriesBefore}\n`);

    // Delete all non-admin users
    const usersDeleted = await User.deleteMany({ email: { $ne: adminEmail } });
    console.log(`Deleted ${usersDeleted.deletedCount} non-admin users`);

    // Delete all products
    const productsDeleted = await Product.deleteMany({});
    console.log(`Deleted ${productsDeleted.deletedCount} products`);

    // Delete all orders
    const ordersDeleted = await Order.deleteMany({});
    console.log(`Deleted ${ordersDeleted.deletedCount} orders`);

    // Delete all reviews
    const reviewsDeleted = await Review.deleteMany({});
    console.log(`Deleted ${reviewsDeleted.deletedCount} reviews`);

    // Delete all counters (order number sequences etc.)
    const countersDeleted = await Counter.deleteMany({});
    console.log(`Deleted ${countersDeleted.deletedCount} counters`);

    // Clear uploaded images
    const uploadsDir = path.join(__dirname, 'uploads');
    const fs = require('fs');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      files.forEach(f => {
        fs.unlinkSync(path.join(uploadsDir, f));
        console.log(`Deleted upload: ${f}`);
      });
    }

    // Keep admin user and categories
    const admin = await User.findOne({ email: adminEmail });
    console.log(`\nKept admin: ${adminEmail} (role: ${admin?.role})`);
    console.log(`Kept ${categoriesBefore} categories`);

    // Count after
    const usersAfter = await User.countDocuments();
    const productsAfter = await Product.countDocuments();
    const ordersAfter = await Order.countDocuments();
    const reviewsAfter = await Review.countDocuments();

    console.log('\n=== AFTER CLEANUP ===');
    console.log(`  Users:     ${usersAfter} (admin only)`);
    console.log(`  Products:  ${productsAfter} (empty - add via admin panel)`);
    console.log(`  Orders:    ${ordersAfter}`);
    console.log(`  Reviews:   ${reviewsAfter}`);
    console.log(`  Categories: ${categoriesBefore}\n`);

    await mongoose.disconnect();
    console.log('Cleanup complete! Database is fresh and ready for production.');
    process.exit(0);
  } catch (err) {
    console.error('Cleanup error:', err);
    process.exit(1);
  }
}

cleanup();
