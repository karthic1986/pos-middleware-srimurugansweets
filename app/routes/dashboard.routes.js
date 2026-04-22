module.exports = (app) => {
  const dashboard = require("../controllers/dashboard.controller.js");
  const router = require("express").Router();

  // Retrieve Last 7 days report
  router.get("/last7daysSales", dashboard.last7daysSales);

  app.use("/api/dashboard", router);

};
