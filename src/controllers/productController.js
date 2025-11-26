const { Op } = require('sequelize');
const { Product } = require('../models');

const productController = {
  // Get all products
  getAllProducts: async (req, res) => {
    try {
      //   const valor = 5/0;
      const products = await Product.findAll();
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ message: `Error en getallProducts: ${err.message}` });
    }
  },

  // Get a single product by ID
  getProductById: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Create a new product
  createProduct: async (req, res) => {
    try {
      const { name, description, price, category, stock, imageUrl } = req.body;
      console.log(req.body);
      const newProduct = await Product.create({
        name,
        description,
        price,
        category,
        stock,
        imageUrl
      });
      res.status(201).json(
        {
          message: "creacion exitosa",
          data: newProduct
        });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Update a product by ID
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, price, category, stock, image } = req.body;
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      await product.update({
        name,
        description,
        price,
        category,
        stock,
        image,
      });
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar producto' });
    }
  },

  // Delete a product by ID
  deleteProduct: async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      await product.destroy();
      res.status(200).json({ message: 'Product Eliminado' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getProductByName: async (req, res) => {
    try {
      const { name } = req.params;
      const products = await Product.findAll({
        where: {
          name: {
            [Op.like]: `%${name}%`
          }
        }
      });
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = productController;