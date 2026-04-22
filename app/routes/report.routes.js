module.exports = (app) => {
  const reports = require("../controllers/report.controller.js");
  const router = require("express").Router();

  // Retrieve Delivery report by date
  router.get("/delivery", reports.deliveryReport);

  router.get("/nondelivery", reports.nondeliveryReport);

  // Retrieve Product Wise Sales Report by date
  router.get("/productwisesales", reports.productWiseSalesReport);

  // Retrieve Customer Wise Sales Report by date
  router.get("/customerwisesales", reports.customerWiseSalesReport);

  // Retrieve Date Wise Sales Report by date
  router.get("/datewisesales", reports.dateWiseSalesReport);

  app.use("/api/reports", router);
};
