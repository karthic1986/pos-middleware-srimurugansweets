module.exports = (sequelize, Sequelize) => {
  const Customer = sequelize.define("customer", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    mobile: {
      type: Sequelize.STRING(50),
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(50),
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
  return Customer;
};

