const { test } = require('node:test');
const assert = require('node:assert');
const { ORDER_FLOW, PAYMENT_FLOW } = require('../controllers/orderController');

const canTransition = (flow, from, to) => (flow[from] || []).includes(to);

test('order flow allows forward progression', () => {
  assert.ok(canTransition(ORDER_FLOW, 'pending', 'payment_verification'));
  assert.ok(canTransition(ORDER_FLOW, 'pending', 'confirmed'));
  assert.ok(canTransition(ORDER_FLOW, 'payment_verification', 'confirmed'));
  assert.ok(canTransition(ORDER_FLOW, 'confirmed', 'packed'));
  assert.ok(canTransition(ORDER_FLOW, 'packed', 'shipped'));
  assert.ok(canTransition(ORDER_FLOW, 'shipped', 'delivered'));
});

test('order flow allows cancellation from active states', () => {
  assert.ok(canTransition(ORDER_FLOW, 'pending', 'cancelled'));
  assert.ok(canTransition(ORDER_FLOW, 'payment_verification', 'cancelled'));
  assert.ok(canTransition(ORDER_FLOW, 'confirmed', 'cancelled'));
  assert.ok(canTransition(ORDER_FLOW, 'packed', 'cancelled'));
});

test('order flow blocks skipping steps and reversing', () => {
  assert.ok(!canTransition(ORDER_FLOW, 'pending', 'shipped'));
  assert.ok(!canTransition(ORDER_FLOW, 'pending', 'delivered'));
  assert.ok(!canTransition(ORDER_FLOW, 'confirmed', 'pending'));
  assert.ok(!canTransition(ORDER_FLOW, 'delivered', 'shipped'));
  assert.ok(!canTransition(ORDER_FLOW, 'cancelled', 'pending'));
});

test('every status has a defined flow entry', () => {
  const statuses = ['pending', 'payment_verification', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];
  statuses.forEach(s => assert.ok(Array.isArray(ORDER_FLOW[s]), `${s} missing from ORDER_FLOW`));
});

test('payment flow allows pending -> verified/rejected only', () => {
  assert.ok(canTransition(PAYMENT_FLOW, 'pending', 'verified'));
  assert.ok(canTransition(PAYMENT_FLOW, 'pending', 'rejected'));
  assert.ok(!canTransition(PAYMENT_FLOW, 'pending', 'cancelled'));
  assert.ok(!canTransition(PAYMENT_FLOW, 'verified', 'rejected'));
  assert.ok(!canTransition(PAYMENT_FLOW, 'rejected', 'verified'));
});
