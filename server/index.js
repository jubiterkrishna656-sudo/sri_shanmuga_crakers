const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const Product = require('./models/Product');

const escapeXml = (s) => String(s).replace(/[<>&'"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));

dotenv.config();

for (const key of ['MONGODB_URI', 'JWT_SECRET']) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}. Set it in server/.env`);
    process.exit(1);
  }
}

fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });

const cspConnect = (process.env.CSP_CONNECT_SOURCES || 'http://localhost:3000,http://localhost:5000,ws://localhost:*')
  .split(',').map(s => s.trim()).filter(Boolean);

const app = express();

app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'http:'],
      frameSrc: ["'self'", 'https://www.youtube.com', 'https://www.youtube-nocookie.com'],
      connectSrc: ["'self'", ...cspConnect],
      objectSrc: ["'none'"]
    }
  }
}));

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000')
  .split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({ origin: allowedOrigins }));
app.use(compression());
app.use(express.json());
app.use('/api', (req, res, next) => { res.setHeader('Cache-Control', 'no-store'); next(); });
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), { maxAge: '7d', fallthrough: true }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again later.' }
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

const clientBuild = path.join(__dirname, '../client/dist');
app.use('/assets', express.static(path.join(clientBuild, 'assets'), { maxAge: '365d', immutable: true }));
app.use(express.static(clientBuild, { maxAge: 0 }));

app.use('/api', (req, res) => res.status(404).json({ error: 'API route not found' }));

app.get('/sitemap.xml', async (req, res) => {
  try {
    const origin = `${req.protocol}://${req.get('host')}`;
    const products = await Product.find({}, 'name createdAt').sort({ createdAt: -1 });
    const urls = [
      { loc: `${origin}/`, priority: '1.0' },
      { loc: `${origin}/products`, priority: '0.9' },
      ...products.map(p => ({ loc: `${origin}/products/${p._id}`, lastmod: p.createdAt?.toISOString() }))
    ];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u =>
      `  <url>\n    <loc>${escapeXml(u.loc)}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}${u.priority ? `\n    <priority>${u.priority}</priority>` : ''}\n  </url>`
    ).join('\n')}\n</urlset>`;
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch {
    res.status(500).send('Error generating sitemap');
  }
});

app.get('/robots.txt', (req, res) => {
  const origin = `${req.protocol}://${req.get('host')}`;
  res.type('text/plain');
  res.send([
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /login',
    'Disallow: /register',
    'Disallow: /cart',
    'Disallow: /checkout',
    '',
    `Sitemap: ${origin}/sitemap.xml`,
    ''
  ].join('\n'));
});

app.get('*', (req, res) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(clientBuild, 'index.html'));
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.code === 'LIMIT_FILE_SIZE' ? 'File too large. Max 5MB allowed' : err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
