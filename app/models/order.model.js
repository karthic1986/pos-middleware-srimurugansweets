module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("order", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    customerId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    totalQty: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    totalAmount: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    payment: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    discount: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    orderDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    isDelivery: {
      type: Sequelize.BOOLEAN,
    },
    deliveryDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    deliveryTime: {
      type: Sequelize.STRING(50),
      allowNull: true,
    },
    notes: {
      type: Sequelize.STRING(500),
      allowNull: true,
    },
    createdBy: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    updatedBy: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });
  return Order;
};

