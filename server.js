const express = require("express");
const cors = require("cors");
const app = express();
const basicAuth = require("express-basic-auth");
require('dotenv').config()

app.use(cors(),function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const corsOptions = {
  origin: "http://localhost:8080",
};
 const api_Username = process.env.API_BASIC_AUTH_USERNAME;
 const api_Password = process.env.API_BASIC_AUTH_PASSWORD;

//Set API Basic Auth Username and password
const user = {};
user[api_Username] = api_Password;
const users={users:user};
app.use(basicAuth(users));

//app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

// simple route
app.get("/", (req, res) => {
  res.json({message: "Welcome to POS Middleware application."});
});



// set port, listen for requests
require("./app/routes/user.routes")(app);
require("./app/routes/product.routes")(app);
require("./app/routes/customer.routes")(app);
require("./app/routes/order.routes")(app);
require("./app/routes/orderDetail.routes")(app);
require("./app/routes/report.routes")(app);
require("./app/routes/dashboard.routes")(app);
require("./app/routes/delivery.routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const db = require("./app/models");
db.sequelize.sync()
    .then(() => {
      console.log("Synced db.");
    })
    .catch((err) => {
      console.log("Failed to sync db: " + err.message);
    });
