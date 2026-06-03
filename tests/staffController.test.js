'use strict';

const staffCtrl = require('../controllers/staffController');
const Product = require('../models/Product');

// Mock Product model
jest.mock('../models/Product');
jest.mock('../models/Category', () => ({
  getAll: jest.fn().mockReturnValue([{ name: 'TestCat' }])
}));

describe('staffController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      session: { user: { id: 1, role: 'staff' } }
    };
    res = {
      render: jest.fn(),
      redirect: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('listProducts', () => {
    test('renders staff/products with all products', () => {
      Product.getAll.mockReturnValue([{ id: 1, name: 'Prod1' }]);
      staffCtrl.listProducts(req, res);
      expect(Product.getAll).toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith('staff/products', { products: [{ id: 1, name: 'Prod1' }] });
    });
  });

  describe('showAddProduct', () => {
    test('renders staff/product-form with categories and types', () => {
      Product.getTypes.mockReturnValue(['Type1']);
      staffCtrl.showAddProduct(req, res);
      expect(res.render).toHaveBeenCalledWith('staff/product-form', {
        categories: [{ name: 'TestCat' }],
        types: ['Type1'],
        product: null
      });
    });
  });

  describe('addProduct', () => {
    test('adds product and redirects on success', () => {
      req.body = { name: 'New Prod', price: 10 };
      staffCtrl.addProduct(req, res);
      expect(Product.add).toHaveBeenCalledWith(req.body);
      expect(res.redirect).toHaveBeenCalledWith('/staff/products');
    });

    test('sends 400 on error', () => {
      Product.add.mockImplementation(() => { throw new Error('Bad input'); });
      staffCtrl.addProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Bad input');
    });
  });

  describe('showEditProduct', () => {
    test('renders product form if product exists', () => {
      req.params.id = 1;
      Product.getById.mockReturnValue({ id: 1, name: 'P' });
      Product.getTypes.mockReturnValue(['T']);
      
      staffCtrl.showEditProduct(req, res);
      
      expect(Product.getById).toHaveBeenCalledWith(1);
      expect(res.render).toHaveBeenCalledWith('staff/product-form', {
        categories: [{ name: 'TestCat' }],
        types: ['T'],
        product: { id: 1, name: 'P' }
      });
    });

    test('returns 404 if product not found', () => {
      req.params.id = 99;
      Product.getById.mockReturnValue(undefined);
      
      staffCtrl.showEditProduct(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Product not found');
    });
  });

  describe('updateProduct', () => {
    test('updates product and redirects', () => {
      req.params.id = 1;
      req.body = { price: 20 };
      staffCtrl.updateProduct(req, res);
      
      expect(Product.update).toHaveBeenCalledWith(1, req.body);
      expect(res.redirect).toHaveBeenCalledWith('/staff/products');
    });

    test('sends 400 on error', () => {
      req.params.id = 99;
      Product.update.mockImplementation(() => { throw new Error('Not found'); });
      staffCtrl.updateProduct(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Not found');
    });
  });

  describe('deleteProduct', () => {
    test('deletes product and redirects', () => {
      req.params.id = 1;
      staffCtrl.deleteProduct(req, res);
      
      expect(Product.delete).toHaveBeenCalledWith(1);
      expect(res.redirect).toHaveBeenCalledWith('/staff/products');
    });

    test('sends 400 on error', () => {
      req.params.id = 99;
      Product.delete.mockImplementation(() => { throw new Error('Not found'); });
      staffCtrl.deleteProduct(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Not found');
    });
  });
});
