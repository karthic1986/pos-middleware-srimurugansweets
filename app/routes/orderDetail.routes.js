module.exports = (app) => {
  const orderDetails = require("../controllers/orderDetail.controller.js");
  const router = require("express").Router();

  // Create a new OrderDetail
  router.post("/", orderDetails.create);

  // Retrieve all OrderDetails
  router.get("/", orderDetails.findAll);

  // Retrieve a single OrderDetail with id
  router.get("/:id", orderDetails.findOne);

  // Update a OrderDetail with id
  router.put("/:id", orderDetails.update);

  // Delete a OrderDetail with id
  router.delete("/:id", orderDetails.delete);

  app.use("/api/orderDetails", router);
};
