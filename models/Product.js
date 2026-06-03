'use strict';

const fs = require('fs');
const path = require('path');
const types = require('../data/types.json');
const Category = require('./Category');

const dataFile = path.join(__dirname, '..', 'data', 'products.json');

function readProducts() {
  try {
    const raw = fs.readFileSync(dataFile, 'utf8');
    const products = raw ? JSON.parse(raw) : [];
    return Array.isArray(products) ? products : [];
  } catch (_) {
    return [];
  }
}

function writeProducts(products) {
  const normalized = Array.isArray(products) ? products : [products];
  fs.writeFileSync(dataFile, JSON.stringify(normalized, null, 2));
}

class Product {
  static getAll() { 
    return readProducts(); 
  }
  
  static getById(id) { 
    return readProducts().find(p => p.id === Number(id)); 
  }
  
  static getCategories() {
    return Category.getAll();
  }
  
  static getTypes() {
    return types;
  }

  static add(productData) {
    const products = readProducts();
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct = {
      id: newId,
      name: String(productData.name || '').trim(),
      price: Number(productData.price || 0),
      image: String(productData.image || '/images/default.svg').trim(),
      category: String(productData.category || '').trim(),
      type: String(productData.type || '').trim(),
      badge: productData.badge ? String(productData.badge).trim() : null,
      desc: String(productData.desc || '').trim()
    };
    products.push(newProduct);
    writeProducts(products);
    return newProduct;
  }

  static update(id, productData) {
    const products = readProducts();
    const idx = products.findIndex(p => p.id === Number(id));
    if (idx === -1) throw new Error('Product not found.');
    
    products[idx] = {
      ...products[idx],
      ...productData,
      id: Number(id), // prevent id override
      price: productData.price !== undefined ? Number(productData.price) : products[idx].price
    };
    writeProducts(products);
    return products[idx];
  }

  static delete(id) {
    let products = readProducts();
    const idx = products.findIndex(p => p.id === Number(id));
    if (idx === -1) throw new Error('Product not found.');
    products = products.filter(p => p.id !== Number(id));
    writeProducts(products);
    return true;
  }
}

module.exports = Product;
