// Brings the database up to date on every start: sync() creates missing
// tables, then each step below that isn't recorded in schema_migrations runs
// once and is recorded. Add new steps to the end of MIGRATIONS.

// Adds settings that don't exist yet. Runs once per step, so a setting
// deleted later from the Settings screen doesn't come back.
const seedAppSettings = (settings) => async (db) => {
  for (const setting of settings) {
    await db.appSettings.findOrCreate({
      where: {name: setting.name},
      defaults: {...setting, createdBy: 1, updatedBy: 1},
    });
  }
};

const THERMAL_PRINT_ENABLED_DESCRIPTION =
  "Default for the \"Thermal printer\" checkbox on the order screen, and the printer used for reprints. " +
  "Only the exact value \"false\" makes this PC's own printer (print dialog) the default.";
const PRINTER_HOST_DESCRIPTION =
  "IP address of the thermal printer on the shop network. Required: if blank, bills open in the normal A5 print dialog.";
const PRINTER_PORT_DESCRIPTION =
  "Raw printing port of the thermal printer, almost always 9100. Blank / invalid = 9100.";

const MIGRATIONS = [
  {
    name: "add-products-printName",
    up: async (db) => {
      const queryInterface = db.sequelize.getQueryInterface();
      const products = await queryInterface.describeTable("products");
      if (products.printName) return;
      await queryInterface.addColumn("products", "printName", {
        type: db.Sequelize.STRING(100),
        allowNull: true,
      });
      await db.sequelize.query("UPDATE products SET printName = name WHERE printName IS NULL");
    },
  },
  {
    name: "seed-bill-footer-setting",
    up: seedAppSettings([
      {
        name: "BILL_FOOTER_MESSAGE",
        value: "இனிய தீபாவளி வாழ்த்துக்கள்",
        description: "Message printed at the bottom of the bill copy, below the QR code. Blank = no message.",
      },
    ]),
  },
  {
    name: "seed-printer-settings",
    up: seedAppSettings([
      {
        name: "THERMAL_PRINT_ENABLED",
        value: "true",
        description: THERMAL_PRINT_ENABLED_DESCRIPTION,
      },
      {
        name: "PRINTER_HOST",
        value: "192.168.29.135",
        description: PRINTER_HOST_DESCRIPTION,
      },
      {
        name: "PRINTER_PORT",
        value: "9100",
        description: PRINTER_PORT_DESCRIPTION,
      },
      {
        name: "PRINTER_PAPER_WIDTH_MM",
        value: "80",
        description: "Thermal paper width in mm: 80 (RP3230) or 58. Anything else = 80.",
      },
      {
        name: "PRINTER_FONT_SIZE",
        value: "24",
        description: "Text size on the thermal bill, in printer dots (16-40). Blank / invalid = 24.",
      },
      {
        name: "PRINTER_DARKNESS",
        value: "160",
        description: "How dark the thermal bill prints (100-220). Higher = bolder text. Blank / invalid = 160.",
      },
      {
        name: "PRINTER_COPIES",
        value: "1",
        description: "Copies of each bill printed on the thermal printer (1-5). Blank / invalid = 1.",
      },
    ]),
  },
  {
    // The print server no longer has a default printer address of its own.
    name: "update-printer-host-port-descriptions",
    up: async (db) => {
      await db.appSettings.update({description: PRINTER_HOST_DESCRIPTION}, {where: {name: "PRINTER_HOST"}});
      await db.appSettings.update({description: PRINTER_PORT_DESCRIPTION}, {where: {name: "PRINTER_PORT"}});
    },
  },
  {
    // The order screen now has a "Thermal printer" checkbox; this setting is its default.
    name: "update-thermal-print-enabled-description",
    up: async (db) => {
      await db.appSettings.update(
          {description: THERMAL_PRINT_ENABLED_DESCRIPTION},
          {where: {name: "THERMAL_PRINT_ENABLED"}},
      );
    },
  },
];

module.exports = async (db) => {
  await db.sequelize.sync();

  const applied = new Set((await db.schemaMigrations.findAll()).map((m) => m.name));
  for (const migration of MIGRATIONS) {
    if (applied.has(migration.name)) continue;
    await migration.up(db);
    await db.schemaMigrations.create({name: migration.name});
    console.log(`Migrated: ${migration.name}`);
  }
};
