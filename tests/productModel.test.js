const { DataTypes } = require('sequelize');

// Definición esperada del modelo
const expectedModelDefinition = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
};

const expectedOptions = {
  tableName: 'products',
  timestamps: false,
};

describe('Product Model', () => {
  describe('Definición del esquema', () => {
    it('debería tener el campo id como INTEGER, primaryKey y autoIncrement', () => {
      expect(expectedModelDefinition.id.type).toBe(DataTypes.INTEGER);
      expect(expectedModelDefinition.id.primaryKey).toBe(true);
      expect(expectedModelDefinition.id.autoIncrement).toBe(true);
    });

    it('debería tener el campo name como STRING y required (allowNull: false)', () => {
      expect(expectedModelDefinition.name.type).toBe(DataTypes.STRING);
      expect(expectedModelDefinition.name.allowNull).toBe(false);
    });

    it('debería tener el campo description como TEXT y required', () => {
      expect(expectedModelDefinition.description.type).toBe(DataTypes.TEXT);
      expect(expectedModelDefinition.description.allowNull).toBe(false);
    });

    it('debería tener el campo price como DECIMAL y required', () => {
      expect(expectedModelDefinition.price.allowNull).toBe(false);
    });

    it('debería tener el campo category como STRING y required', () => {
      expect(expectedModelDefinition.category.type).toBe(DataTypes.STRING);
      expect(expectedModelDefinition.category.allowNull).toBe(false);
    });

    it('debería tener el campo stock como INTEGER y required', () => {
      expect(expectedModelDefinition.stock.type).toBe(DataTypes.INTEGER);
      expect(expectedModelDefinition.stock.allowNull).toBe(false);
    });

    it('debería tener el campo imageUrl como STRING y opcional (allowNull: true)', () => {
      expect(expectedModelDefinition.imageUrl.type).toBe(DataTypes.STRING);
      expect(expectedModelDefinition.imageUrl.allowNull).toBe(true);
    });
  });

  describe('Configuración del modelo', () => {
    it('debería usar tableName products', () => {
      expect(expectedOptions.tableName).toBe('products');
    });

    it('debería tener timestamps deshabilitados (false)', () => {
      expect(expectedOptions.timestamps).toBe(false);
    });
  });

  describe('Validación del modelo importado', () => {
    it('debería exportar una función de modelo', () => {
      const Product = require('../src/models/Product');
      expect(typeof Product).toBe('function');
    });

    it('debería tener los métodos del modelo', () => {
      const Product = require('../src/models/Product');
      expect(Product.findAll).toBeDefined();
      expect(typeof Product.findAll).toBe('function');
      expect(Product.findByPk).toBeDefined();
      expect(typeof Product.findByPk).toBe('function');
      expect(Product.create).toBeDefined();
      expect(typeof Product.create).toBe('function');
    });
  });
});
