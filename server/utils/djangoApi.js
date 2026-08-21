const https = require('https');
const http = require('http');

const DJANGO_API_URL = process.env.DJANGO_API_URL;
const DJANGO_API_KEY = process.env.DJANGO_API_KEY;
const REQUEST_TIMEOUT = 5000;

function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const mod = parsed.protocol === 'https:' ? https : http;
    const headers = { 'Accept': 'application/json', ...options.headers };
    if (DJANGO_API_KEY) headers['Authorization'] = `Token ${DJANGO_API_KEY}`;
    if (options.body) headers['Content-Type'] = 'application/json';

    const req = mod.request(url, { method: options.method || 'GET', headers, timeout: REQUEST_TIMEOUT }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on('timeout', () => { req.destroy(); reject(new Error('Request timed out')); });
    req.on('error', reject);
    if (options.body) req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    req.end();
  });
}

async function fetchDjangoProducts() {
  if (!DJANGO_API_URL) return [];
  try {
    const { status, data } = await request(DJANGO_API_URL);
    if (status !== 200 || !data.success || !Array.isArray(data.products)) return [];
    return data.products.map(p => normalizeDjangoProduct(p));
  } catch (err) {
    console.error('Django API fetch failed:', err.message);
    return [];
  }
}

async function fetchDjangoProductById(sourceId) {
  if (!DJANGO_API_URL) return null;
  try {
    const url = DJANGO_API_URL.replace(/\/$/, '') + '/' + sourceId + '/';
    const { status, data } = await request(url);
    if (status !== 200 || !data) return null;
    const product = data.product || data;
    if (!product || !product.name) return null;
    return normalizeDjangoProduct(product);
  } catch (err) {
    console.error('Django API fetch single failed:', err.message);
    return null;
  }
}

function normalizeDjangoProduct(p) {
  const sourceId = String(p.id || p._id || '');
  return {
    _id: sourceId ? `django_${sourceId}` : null,
    sourceId,
    source: 'django',
    name: p.name || p.title || '',
    category: p.category || p.category_name || 'General',
    price: Number(p.price || 0),
    discountPrice: Number(p.discount_price || p.discountPrice || 0),
    stock: Number(p.stock || p.quantity || 0),
    description: p.description || '',
    image: p.image || p.image_url || p.thumbnail || '',
    imageUrl: p.image_url || p.image || '',
    videoUrl: p.video_url || p.videoUrl || '',
    featured: p.featured || p.is_featured || false,
    productNumber: p.product_number || p.sku || '',
    avgRating: Number(p.avg_rating || p.avgRating || 0),
    reviewCount: Number(p.review_count || p.reviewCount || 0),
  };
}

async function syncProductToDjango(product) {
  if (!DJANGO_API_URL) return null;
  try {
    const payload = {
      name: product.name,
      category: product.category,
      price: product.price,
      discount_price: product.discountPrice || 0,
      stock: product.stock || 0,
      description: product.description || '',
      image_url: product.imageUrl || '',
      video_url: product.videoUrl || '',
      featured: product.featured || false,
    };
    const { status, data } = await request(DJANGO_API_URL, {
      method: 'POST',
      body: payload,
    });
    if (status >= 200 && status < 300) return data;
    console.error('Django sync failed:', status);
    return null;
  } catch (err) {
    console.error('Django sync error:', err.message);
    return null;
  }
}

async function fetchDjangoCategories() {
  const products = await fetchDjangoProducts();
  const cats = [...new Set(products.map(p => p.category).filter(Boolean))];
  return cats.map(name => ({ name, source: 'django' }));
}

module.exports = { fetchDjangoProducts, fetchDjangoProductById, syncProductToDjango, fetchDjangoCategories };
