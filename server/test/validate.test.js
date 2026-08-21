const { test } = require('node:test');
const assert = require('node:assert');
const {
  productRules,
  productUpdateRules,
  placeOrderRules,
  reviewRules
} = require('../middleware/validate');

async function runChain(rules, body) {
  const req = { body, headers: {}, query: {}, params: {} };
  const state = { statusCode: null, jsonBody: null, nextCount: 0 };
  const res = {
    status(code) { state.statusCode = code; return this; },
    json(obj) { state.jsonBody = obj; }
  };
  for (const fn of rules) {
    await fn(req, res, () => { state.nextCount++; });
  }
  return state;
}

const validProduct = { name: 'Bomb', category: 'Sparklers', price: 100, discountPrice: 80, stock: 10 };

test('productRules accepts a valid payload', async () => {
  const state = await runChain(productRules, validProduct);
  assert.strictEqual(state.statusCode, null);
});

test('productRules requires a positive price', async () => {
  const state = await runChain(productRules, { ...validProduct, price: -5 });
  assert.strictEqual(state.statusCode, 400);
});

test('productRules rejects discountPrice >= price', async () => {
  const state = await runChain(productRules, { ...validProduct, discountPrice: 150 });
  assert.strictEqual(state.statusCode, 400);
  assert.match(state.jsonBody.error, /Discount price/);
});

test('productUpdateRules accepts an empty payload', async () => {
  const state = await runChain(productUpdateRules, {});
  assert.strictEqual(state.statusCode, null);
});

test('productUpdateRules accepts a partial update', async () => {
  const state = await runChain(productUpdateRules, { name: 'New Name', stock: 5 });
  assert.strictEqual(state.statusCode, null);
});

test('productUpdateRules validates price when provided', async () => {
  const state = await runChain(productUpdateRules, { price: -5 });
  assert.strictEqual(state.statusCode, 400);
});

test('productUpdateRules rejects discountPrice >= price when both provided', async () => {
  const state = await runChain(productUpdateRules, { price: 100, discountPrice: 150 });
  assert.strictEqual(state.statusCode, 400);
  assert.match(state.jsonBody.error, /Discount price/);
});

test('placeOrderRules requires an address', async () => {
  const state = await runChain(placeOrderRules, { name: 'Test', phone: '9876543210', address: '' });
  assert.strictEqual(state.statusCode, 400);
  assert.match(state.jsonBody.error, /address/i);
});

test('placeOrderRules accepts a valid payload', async () => {
  const state = await runChain(placeOrderRules, { name: 'Test', phone: '9876543210', email: 'test@example.com', address: '1 Test St' });
  assert.strictEqual(state.statusCode, null);
});

test('placeOrderRules requires a valid email', async () => {
  const state = await runChain(placeOrderRules, { name: 'Test', phone: '9876543210', email: 'not-an-email', address: '1 Test St' });
  assert.strictEqual(state.statusCode, 400);
  assert.match(state.jsonBody.error, /email/i);
});

test('placeOrderRules requires a name', async () => {
  const state = await runChain(placeOrderRules, { name: '', phone: '9876543210', address: '1 Test St' });
  assert.strictEqual(state.statusCode, 400);
  assert.match(state.jsonBody.error, /name/i);
});

test('placeOrderRules rejects an invalid phone', async () => {
  const state = await runChain(placeOrderRules, { name: 'Test', phone: '123', address: '1 Test St' });
  assert.strictEqual(state.statusCode, 400);
  assert.match(state.jsonBody.error, /phone/i);
});

test('reviewRules rejects rating out of range', async () => {
  const state = await runChain(reviewRules, { rating: 9 });
  assert.strictEqual(state.statusCode, 400);
});
