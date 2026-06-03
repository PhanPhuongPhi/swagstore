'use strict';

const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');

const dataFile = path.join(__dirname, '..', 'data', 'products.json');
const backup   = path.join(__dirname, '..', 'data', 'products.json.bak');

const SAMPLE = {
  name: 'Test Product', price: 99.99, image: '/images/test.svg',
  category: 'Accessories', type: 'Test Type', badge: 'New', desc: 'Test Desc'
};

beforeAll(() => {
  if (fs.existsSync(dataFile)) fs.copyFileSync(dataFile, backup);
});
afterAll(() => {
  if (fs.existsSync(backup)) { fs.copyFileSync(backup, dataFile); fs.unlinkSync(backup); }
});
// Start each test with an empty array or a specific set
beforeEach(() => fs.writeFileSync(dataFile, '[]'));
afterEach (() => fs.writeFileSync(dataFile, '[]'));

describe('Product model CRUD', () => {
  test('getAll returns empty array initially', () => {
    expect(Product.getAll()).toEqual([]);
  });

  test('add creates a new product with valid id', () => {
    const p1 = Product.add(SAMPLE);
    expect(p1).toMatchObject(SAMPLE);
    expect(p1.id).toBeDefined();

    const p2 = Product.add({ ...SAMPLE, name: 'Test 2' });
    expect(p2.id).toBeGreaterThan(p1.id);
  });

  test('getById returns the correct product', () => {
    const created = Product.add(SAMPLE);
    const found = Product.getById(created.id);
    expect(found).toBeDefined();
    expect(found.name).toBe(SAMPLE.name);
  });

  test('update modifies existing product', () => {
    const created = Product.add(SAMPLE);
    const updated = Product.update(created.id, { price: 150, name: 'Updated Name' });
    expect(updated.price).toBe(150);
    expect(updated.name).toBe('Updated Name');
    expect(updated.id).toBe(created.id); // ID shouldn't change
  });

  test('update throws error if product not found', () => {
    expect(() => Product.update(999, { price: 10 })).toThrow('Product not found.');
  });

  test('delete removes product by id', () => {
    const created = Product.add(SAMPLE);
    expect(Product.getAll().length).toBe(1);
    const res = Product.delete(created.id);
    expect(res).toBe(true);
    expect(Product.getAll().length).toBe(0);
  });

  test('delete throws error if product not found', () => {
    expect(() => Product.delete(999)).toThrow('Product not found.');
  });
});

describe('Product model utilities', () => {
  test('getCategories returns categories', () => {
    const categories = Product.getCategories();
    expect(Array.isArray(categories)).toBe(true);
  });

  test('getTypes returns types', () => {
    const types = Product.getTypes();
    expect(Array.isArray(types)).toBe(true);
  });
});
