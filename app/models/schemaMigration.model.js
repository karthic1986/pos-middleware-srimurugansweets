// One row per migration step in migrations.js that has already run.
module.exports = (sequelize, Sequelize) => {
  const SchemaMigration = sequelize.define("schemaMigration", {
    name: {
      type: Sequelize.STRING(100),
      primaryKey: true,
      allowNull: false,
    },
  }, {
    tableName: "schema_migrations",
    updatedAt: false,
  });
  return SchemaMigration;
};
