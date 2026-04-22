module.exports = (app) => {
  const delivery = require("../controllers/delivery.controller.js");
  const router = require("express").Router();

  // Get Delivery
  router.get("/", delivery.deliveryBySearchQry);

  // Get Delivery By Order ID
  router.get("/:id", delivery.deliveryById);

  app.use("/api/delivery", router);
};
