module.exports = (app) => {
  const users = require("../controllers/user.controller.js");
  const router = require("express").Router();

  // validate user
  router.post("/validate", users.validate);

  app.use("/api/users", router);
};
