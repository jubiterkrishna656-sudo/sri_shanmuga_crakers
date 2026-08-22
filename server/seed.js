const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');

const products = [
  { productNumber: '001', name: 'Lakshmi Special Sparklers (100g)', category: 'Sparklers', price: 150, stock: 200, featured: true, description: 'Classic Lakshmi sparklers packed for the whole festival season. Bright golden sparks with a satisfying crackle.' },
  { productNumber: '002', name: 'Bulb Mini Sparklers (50g)', category: 'Sparklers', price: 80, stock: 300, description: 'Safe mini sparklers, perfect for kids and beginners. Easy to light and long-burning.' },
  { productNumber: '003', name: 'Deluxe Colour Sparklers (250g)', category: 'Sparklers', price: 350, discountPrice: 300, stock: 150, description: 'Premium multicolour sparklers that change hue as they burn. A Diwali favourite.' },
  { productNumber: '004', name: 'Golden Fountain Flower Pot', category: 'Flower Pots', price: 250, discountPrice: 200, stock: 120, description: 'A single-mouth fountain that erupts in a dazzling golden shower.' },
  { productNumber: '005', name: 'Rainbow Flower Pot', category: 'Flower Pots', price: 300, stock: 90, description: 'Colour-changing fountain with crackling finale. Stunning centrepiece for any evening.' },
  { productNumber: '006', name: 'Deluxe Multi Shot Flower Pot', category: 'Flower Pots', price: 450, stock: 60, featured: true, description: 'Multiple aerial shots from a single pot with colourful report bursts.' },
  { productNumber: '007', name: 'Sky Rocket (3 Pack)', category: 'Rockets', price: 180, stock: 100, description: 'Classic stick rockets with a loud pop and bright flash. Pack of 3.' },
  { productNumber: '008', name: 'Deluxe Whistling Rocket', category: 'Rockets', price: 220, stock: 80, description: 'Rockets that whistle on ascent before the aerial burst.' },
  { productNumber: '009', name: 'Super Sonic Rocket Pack', category: 'Rockets', price: 400, discountPrice: 320, stock: 50, featured: true, description: 'High-flying rockets with multicolour break. Value pack for big displays.' },
  { productNumber: '010', name: 'Full Ash Bomb (Pack of 6)', category: 'Bombs', price: 240, stock: 70, description: 'Big flash and a full clean ash column. A crowd favourite.' },
  { productNumber: '011', name: 'Deluxe Bullet Bomb', category: 'Bombs', price: 160, stock: 90, description: 'Sharp cracker with a powerful report and minimal smoke.' },
  { productNumber: '012', name: 'Thunder King Bomb (Pack of 4)', category: 'Bombs', price: 320, discountPrice: 280, stock: 40, description: 'Extra-loud bombs for the bold. Pack of 4 with safety fuse.' },
  { productNumber: '013', name: 'Diwali Gift Box (Premium)', category: 'Gift Boxes', price: 999, discountPrice: 799, stock: 25, featured: true, description: 'Curated premium gift box with sparklers, pots and rockets. Perfect for gifting.' },
  { productNumber: '014', name: 'Family Combo Gift Box', category: 'Gift Boxes', price: 1499, discountPrice: 1199, stock: 20, description: 'A balanced mix for the whole family, from safe kids items to show-stoppers.' },
  { productNumber: '015', name: 'Royal Celebration Gift Box', category: 'Gift Boxes', price: 1999, discountPrice: 1599, stock: 15, description: 'Our biggest box with premium aerials, fountains and sparklers.' },
  { productNumber: '016', name: 'Kids Snapper Pack', category: 'Kids Crackers', price: 120, stock: 150, description: 'Satisfying pop-bangers that are completely safe for young children.' },
  { productNumber: '017', name: 'Chakra Wheel Pack', category: 'Kids Crackers', price: 90, stock: 180, description: 'Spinning ground wheels with a colourful trail. Indoor-safe.' },
  { productNumber: '018', name: 'Baby Sparkler Combo', category: 'Kids Crackers', price: 140, discountPrice: 100, stock: 130, description: 'Gentle sparklers sized for little hands with adult supervision.' },
  { productNumber: '019', name: 'Grand Diwali Combo', category: 'Combo Packs', price: 1999, discountPrice: 1599, stock: 30, featured: true, description: 'The complete celebration: sparklers, flower pots, rockets and bombs in one box.' },
  { productNumber: '020', name: 'Family Fun Combo', category: 'Combo Packs', price: 1299, discountPrice: 999, stock: 40, description: 'Everything the family needs for a safe and joyful festival night.' },
  { productNumber: '021', name: 'Best Seller Combo Pack', category: 'Combo Packs', price: 799, discountPrice: 599, stock: 50, description: 'Our most-loved picks bundled at a great price.' }
];

async function seedAdmin() {
  if (process.env.NODE_ENV === 'production' && (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD === 'change-this-admin-password')) {
    throw new Error('ADMIN_PASSWORD must be set to a strong value in server/.env before seeding in production');
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@shanmuga.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (existingAdmin) {
    console.log(`Admin user already exists (${adminEmail})`);
  } else {
    const hashed = await bcrypt.hash(adminPassword, 10);
    await User.create({
      name: 'Admin',
      email: adminEmail,
      phone: '0000000000',
      password: hashed,
      role: 'admin'
    });
    console.log(`Admin user created (${adminEmail})`);
    if (!process.env.ADMIN_PASSWORD) {
      console.warn('WARNING: ADMIN_PASSWORD not set in server/.env. A dev default password was used. Set ADMIN_PASSWORD and re-seed before going live.');
    }
  }
}

async function seedProducts() {
  const count = await Product.countDocuments();
  if (count > 0) {
    console.log(`Products already exist (${count}). Skipping product seeding.`);
    return;
  }
  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products`);
}

const defaultCategories = [
  { name: 'Sparklers', emoji: '🎆', color: 'from-yellow-400 to-orange-500', order: 1 },
  { name: 'Flower Pots', emoji: '🎇', color: 'from-pink-400 to-rose-500', order: 2 },
  { name: 'Rockets', emoji: '🚀', color: 'from-blue-400 to-indigo-500', order: 3 },
  { name: 'Bombs', emoji: '💥', color: 'from-red-500 to-rose-600', order: 4 },
  { name: 'Gift Boxes', emoji: '🎁', color: 'from-green-400 to-emerald-500', order: 5 },
  { name: 'Kids Crackers', emoji: '🧨', color: 'from-cyan-400 to-sky-500', order: 6 },
  { name: 'Combo Packs', emoji: '📦', color: 'from-purple-400 to-violet-500', order: 7 }
];

async function seedCategories() {
  const count = await Category.countDocuments();
  if (count > 0) {
    console.log(`Categories already exist (${count}). Skipping category seeding.`);
    return;
  }
  await Category.insertMany(defaultCategories);
  console.log(`Seeded ${defaultCategories.length} categories`);
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    await seedAdmin();
    await seedCategories();

    if (process.env.NODE_ENV !== 'production') {
      await seedProducts();
    } else {
      console.log('Production mode — skipping test product seeding');
    }

    await mongoose.disconnect();
    console.log('Seed complete');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
