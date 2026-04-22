module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("product", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    categoryId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    shortName: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    price: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    imageUrl: {
      type: Sequelize.STRING(300),
      allowNull: true,
    },
    description: {
      type: Sequelize.STRING(500),
      allowNull: true,
    },
    isActive: {
      type: Sequelize.BOOLEAN,
    },
  });
  return Product;
};

