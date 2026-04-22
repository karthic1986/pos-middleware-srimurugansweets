module.exports = (app) => {
  const orders = require("../controllers/order.controller.js");
  const router = require("express").Router();

  // Create a new Order
  router.post("/", orders.create);

   // Create a new Order
   router.post("/v1", orders.create_v1);

  // Retrieve all Orders
  router.get("/", orders.findAll);

  // Retrieve a single Order with id
  router.get("/:id", orders.findOne);

  // Update a Order with id
  router.put("/:id", orders.update);

  // Delete a Order with id
  router.delete("/:id", orders.delete);

  app.use("/api/orders", router);
};
