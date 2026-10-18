module.exports = (app) => {
  const appSettings = require("../controllers/appSetting.controller.js");
  const router = require("express").Router();

  // Create a new App Setting
  router.post("/", appSettings.create);

  // Retrieve all App Settings
  router.get("/", appSettings.findAll);

  // Update an App Setting with id
  router.put("/:id", appSettings.update);

  // Delete an App Setting with id
  router.delete("/:id", appSettings.delete);

  app.use("/api/settings", router);
};
