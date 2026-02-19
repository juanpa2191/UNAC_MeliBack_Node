const request = require('supertest');
const express = require('express');

// Mock de Sequelize
const mockOp = {
  like: 'LIKE'
};

jest.mock('sequelize', () => ({
  Op: mockOp,
  DataTypes: {
    INTEGER: 'INTEGER',
    STRING: 'STRING',
    TEXT: 'TEXT',
    DECIMAL: () => 'DECIMAL',
  },
  sequelize: {
    define: jest.fn().mockReturnValue({
      findAll: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
    }),
  },
}));

// Mock del modelo Product
const mockProduct = {
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  destroy: jest.fn(),
};

jest.mock('../src/models', () => ({
  Product: mockProduct,
}));

const productController = require('../src/controllers/productController');

const app = express();
app.use(express.json());

// Rutas de prueba
app.get('/api/products', productController.getAllProducts);
app.get('/api/products/:id', productController.getProductById);
app.post('/api/products', productController.createProduct);
app.put('/api/products/:id', productController.update);
app.delete('/api/products/:id', productController.deleteProduct);
app.get('/api/products/name/:name', productController.getProductByName);

describe('ProductController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('debería obtener todos los productos exitosamente', async () => {
      const mockProducts = [
        { id: 1, name: 'Producto 1', price: 10.99 },
        { id: 2, name: 'Producto 2', price: 20.99 },
      ];
      mockProduct.findAll.mockResolvedValue(mockProducts);

      const res = await request(app).get('/api/products');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockProducts);
      expect(mockProduct.findAll).toHaveBeenCalledTimes(1);
    });

    it('debería manejar errores al obtener productos', async () => {
      mockProduct.findAll.mockRejectedValue(new Error('Error de base de datos'));

      const res = await request(app).get('/api/products');

      expect(res.status).toBe(500);
      expect(res.body.message).toContain('Error en getallProducts');
    });
  });

  describe('getProductById', () => {
    it('debería obtener un producto por ID exitosamente', async () => {
      const mockProductData = { id: 1, name: 'Producto 1', price: 10.99 };
      mockProduct.findByPk.mockResolvedValue(mockProductData);

      const res = await request(app).get('/api/products/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockProductData);
      expect(mockProduct.findByPk).toHaveBeenCalledWith('1');
    });

    it('debería retornar 404 si el producto no existe', async () => {
      mockProduct.findByPk.mockResolvedValue(null);

      const res = await request(app).get('/api/products/999');

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Producto no encontrado');
    });

    it('debería manejar errores al obtener producto por ID', async () => {
      mockProduct.findByPk.mockRejectedValue(new Error('Error de base de datos'));

      const res = await request(app).get('/api/products/1');

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Error de base de datos');
    });
  });

  describe('createProduct', () => {
    it('debería crear un nuevo producto exitosamente', async () => {
      const productData = {
        name: 'Nuevo Producto',
        description: 'Descripción',
        price: 15.99,
        category: 'Electronics',
        stock: 10,
        imageUrl: 'imagen.jpg'
      };
      const createdProduct = { id: 1, ...productData };
      mockProduct.create.mockResolvedValue(createdProduct);

      const res = await request(app)
        .post('/api/products')
        .send(productData);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('creacion exitosa');
      expect(res.body.data).toEqual(createdProduct);
      expect(mockProduct.create).toHaveBeenCalledWith(productData);
    });

    it('debería manejar errores al crear producto', async () => {
      mockProduct.create.mockRejectedValue(new Error('Error al crear'));

      const res = await request(app)
        .post('/api/products')
        .send({ name: 'Producto' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Error al crear');
    });
  });

  describe('update', () => {
    it('debería actualizar un producto exitosamente', async () => {
      const existingProduct = { 
        id: 1, 
        name: 'Viejo', 
        update: jest.fn().mockResolvedValue(true) 
      };
      const updatedProduct = { id: 1, name: 'Nuevo', price: 20.99 };
      existingProduct.update.mockResolvedValue(updatedProduct);
      mockProduct.findByPk.mockResolvedValue(existingProduct);

      const res = await request(app)
        .put('/api/products/1')
        .send({ name: 'Nuevo', price: 20.99 });

      expect(res.status).toBe(200);
      expect(existingProduct.update).toHaveBeenCalled();
    });

    it('debería retornar 404 si el producto no existe', async () => {
      mockProduct.findByPk.mockResolvedValue(null);

      const res = await request(app)
        .put('/api/products/999')
        .send({ name: 'Nuevo' });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Producto no encontrado');
    });
  });

  describe('deleteProduct', () => {
    it('debería eliminar un producto exitosamente', async () => {
      const mockProductData = { 
        id: 1, 
        name: 'Producto', 
        destroy: jest.fn().mockResolvedValue(true) 
      };
      mockProduct.findByPk.mockResolvedValue(mockProductData);

      const res = await request(app).delete('/api/products/1');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Product Eliminado');
      expect(mockProductData.destroy).toHaveBeenCalledTimes(1);
    });

    it('debería retornar 404 si el producto no existe', async () => {
      mockProduct.findByPk.mockResolvedValue(null);

      const res = await request(app).delete('/api/products/999');

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Producto no encontrado');
    });

    it('debería manejar errores al eliminar producto', async () => {
      const mockProductData = { 
        id: 1, 
        destroy: jest.fn().mockRejectedValue(new Error('Error')) 
      };
      mockProduct.findByPk.mockResolvedValue(mockProductData);

      const res = await request(app).delete('/api/products/1');

      expect(res.status).toBe(500);
    });
  });

  describe('getProductByName', () => {
    it('debería obtener productos por nombre exitosamente', async () => {
      const mockProducts = [
        { id: 1, name: 'Mouse Inalambrico' },
        { id: 2, name: 'Mouse Gaming' },
      ];
      
      mockProduct.findAll.mockImplementation(({ where }) => {
        return Promise.resolve(mockProducts);
      });

      const res = await request(app).get('/api/products/name/mouse');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockProducts);
    });

    it('debería manejar errores al buscar por nombre', async () => {
      mockProduct.findAll.mockRejectedValue(new Error('Error de base de datos'));

      const res = await request(app).get('/api/products/name/mouse');

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Error de base de datos');
    });
  });
});
