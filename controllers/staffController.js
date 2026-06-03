'use strict';

const Product = require('../models/Product');
const Category = require('../models/Category');

exports.listProducts = (req, res) => {
  const products = Product.getAll();
  res.render('staff/products', { products });
};

exports.showAddProduct = (req, res) => {
  const categories = Category.getAll();
  const types = Product.getTypes();
  res.render('staff/product-form', { categories, types, product: null });
};

exports.addProduct = (req, res) => {
  try {
    Product.add(req.body);
    res.redirect('/staff/products');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.showEditProduct = (req, res) => {
  const product = Product.getById(req.params.id);
  if (!product) return res.status(404).send('Product not found');
  
  const categories = Category.getAll();
  const types = Product.getTypes();
  res.render('staff/product-form', { categories, types, product });
};

exports.updateProduct = (req, res) => {
  try {
    Product.update(req.params.id, req.body);
    res.redirect('/staff/products');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.deleteProduct = (req, res) => {
  try {
    Product.delete(req.params.id);
    res.redirect('/staff/products');
  } catch (error) {
    res.status(400).send(error.message);
  }
};
