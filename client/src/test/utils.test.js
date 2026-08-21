import { describe, it, expect, beforeEach, vi } from 'vitest';
import { categories, categoryNames } from '../utils/categories';
import { MIN_ORDER_AMOUNT, FREE_SHIPPING_THRESHOLD, SHOP_CONTACT } from '../utils/constants';

describe('categories utility', () => {
  it('exports an array of categories', () => {
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
  });

  it('each category has required fields', () => {
    categories.forEach(cat => {
      expect(cat).toHaveProperty('name');
      expect(cat).toHaveProperty('emoji');
      expect(cat).toHaveProperty('color');
      expect(cat).toHaveProperty('shadow');
    });
  });

  it('categoryNames is derived from categories', () => {
    expect(categoryNames).toEqual(categories.map(c => c.name));
  });

  it('has no duplicate names', () => {
    const names = categories.map(c => c.name);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe('constants', () => {
  it('MIN_ORDER_AMOUNT is a positive number', () => {
    expect(typeof MIN_ORDER_AMOUNT).toBe('number');
    expect(MIN_ORDER_AMOUNT).toBeGreaterThan(0);
  });

  it('FREE_SHIPPING_THRESHOLD is a positive number', () => {
    expect(typeof FREE_SHIPPING_THRESHOLD).toBe('number');
    expect(FREE_SHIPPING_THRESHOLD).toBeGreaterThan(0);
  });

  it('SHOP_CONTACT has phone field', () => {
    expect(SHOP_CONTACT).toHaveProperty('phone');
    expect(typeof SHOP_CONTACT.phone).toBe('string');
  });
});
