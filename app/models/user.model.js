module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    username: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    firstName: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    emailId: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    mobile: {
      type: Sequelize.STRING(15),
      allowNull: false,
    },
    role: {
      type: Sequelize.STRING(10),
      allowNull: false,
    },
    isActive: {
      type: Sequelize.BOOLEAN,
    },
  });
  return User;
};

