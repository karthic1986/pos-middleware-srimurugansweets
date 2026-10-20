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
const THERMAL_PRINT_METHOD_DESCRIPTION =
  "How thermal bills reach the printer. \"driver\" (default): the browser prints an 80mm bill through the printer's " +
  "own driver; make it this PC's default printer. \"print-server\": sent through print-server/server.js, " +
  "which must be running on this PC.";
const PRINTER_HOST_DESCRIPTION =
  "Only for THERMAL_PRINT_METHOD \"print-server\": IP address of the thermal printer on the shop network. " +
  "Required for that method: if blank, bills open in the normal A5 print dialog.";
const PRINTER_PORT_DESCRIPTION =
  "Only for THERMAL_PRINT_METHOD \"print-server\": raw printing port of the thermal printer, almost always 9100. " +
  "Blank / invalid = 9100.";
const PRINTER_DARKNESS_DESCRIPTION =
  "For THERMAL_PRINT_METHOD \"print-server\" and Bluetooth printers (with the driver, set darkness in the " +
  "printer's driver settings): how dark the thermal bill prints (100-220). Higher = bolder text. Blank / invalid = 160.";

const BLUETOOTH_PRINTER_CHUNK_BYTES_DESCRIPTION =
  "Bytes sent to the Bluetooth printer per write (20-512). Higher prints faster: try 180, then 244, " +
  "then 512; go back if bills print garbled or the printer stops. Blank / invalid = 100.";
const BLUETOOTH_PRINTER_TEXT_MODE_DESCRIPTION =
  "\"true\" (default): Bluetooth bills print English lines in the printer's own font, Tamil lines as small " +
  "images and the QR code as the printer's own symbol, which is many times faster. \"false\": the whole bill " +
  "is sent as one image, like the print server (looks the same as the PC bill, but slow over Bluetooth).";

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
        description: PRINTER_DARKNESS_DESCRIPTION,
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
  {
    // Thermal bills now print through the printer's driver by default; the
    // printer address and darkness only matter for the print server.
    name: "seed-thermal-print-method",
    up: async (db) => {
      await seedAppSettings([
        {
          name: "THERMAL_PRINT_METHOD",
          value: "driver",
          description: THERMAL_PRINT_METHOD_DESCRIPTION,
        },
      ])(db);
      await db.appSettings.update({description: PRINTER_HOST_DESCRIPTION}, {where: {name: "PRINTER_HOST"}});
      await db.appSettings.update({description: PRINTER_PORT_DESCRIPTION}, {where: {name: "PRINTER_PORT"}});
      await db.appSettings.update({description: PRINTER_DARKNESS_DESCRIPTION}, {where: {name: "PRINTER_DARKNESS"}});
    },
  },
  {
    // Phones can print bills on a Bluetooth (BLE) printer, chosen per device on the order screen.
    name: "seed-bluetooth-printer-settings",
    up: async (db) => {
      await seedAppSettings([
        {
          name: "BLUETOOTH_PRINTER_PAPER_WIDTH_MM",
          value: "58",
          description: "Paper width in mm of the Bluetooth printer used from phones: 58 or 80. Anything else = 58.",
        },
        {
          name: "BLUETOOTH_PRINTER_CHUNK_BYTES",
          value: "",
          description: BLUETOOTH_PRINTER_CHUNK_BYTES_DESCRIPTION,
        },
      ])(db);
      await db.appSettings.update({description: PRINTER_DARKNESS_DESCRIPTION}, {where: {name: "PRINTER_DARKNESS"}});
    },
  },
  {
    // Bluetooth bills now go out as writes without response, 20 bytes each by default.
    name: "update-bluetooth-chunk-description",
    up: async (db) => {
      await db.appSettings.update(
          {description: BLUETOOTH_PRINTER_CHUNK_BYTES_DESCRIPTION},
          {where: {name: "BLUETOOTH_PRINTER_CHUNK_BYTES"}},
      );
    },
  },
  {
    // Bluetooth bills are now mostly text, and always wait for the printer's
    // reply: writes that don't wait corrupted the RP3230's bills. The fast-write
    // setting was added by hand on the Settings screen and is no longer read.
    name: "seed-bluetooth-text-mode",
    up: async (db) => {
      await seedAppSettings([
        {
          name: "BLUETOOTH_PRINTER_TEXT_MODE",
          value: "true",
          description: BLUETOOTH_PRINTER_TEXT_MODE_DESCRIPTION,
        },
      ])(db);
      await db.appSettings.destroy({where: {name: "BLUETOOTH_PRINTER_FAST_WRITE_DELAY_MS"}});
      await db.appSettings.update(
          {description: BLUETOOTH_PRINTER_CHUNK_BYTES_DESCRIPTION},
          {where: {name: "BLUETOOTH_PRINTER_CHUNK_BYTES"}},
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
