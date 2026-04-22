const db = require("../models/index");
const sequelize = require("sequelize");
// const User = db.users;
// Retrieve DeliveryReport from the database.
// exports.deliveryReport = (req, res) => {
//   const data = User.query("SELECT * FROM `orders`", { type: QueryTypes.SELECT }).then((orders) => {
//     res.send(data);
//   })
//   .catch((err) => {
//     res.status(500).send({
//       message:
//         err.message || "Some error occurred while retrieving Delivery Report.",
//     });
//   });
// };

exports.deliveryReport = (req, res) => {
  const fDate = req.query.fdate;
  const tDate = req.query.tdate;

  if (!fDate || !tDate) {
    res.status(400).send({
      message: "Date can not be empty!",
    });
    return;
  }

  const qry = `Select OD.productId, P.name, sum(OD.qty) as orderQty, IFNULL(DO.DeliveredQty,0) deliveredQty, sum(OD.qty) - IFNULL(DO.DeliveredQty,0) as pendingQty from orders O Inner Join orderDetails OD on O.id = OD.orderId Inner Join products P on P.id=OD.productId Left Join ( Select OD.productId, sum(OD.qty) as deliveredQty from orders O Inner Join orderDetails OD on O.id = OD.orderId where Date(O.deliveryDate) >= '${fDate}' AND Date(O.deliveryDate) <= '${tDate}' and O.isDelivery = true GROUP by OD.productId ) as DO on DO.productId = OD.productId where Date(O.deliveryDate) >= '${fDate}' AND Date(O.deliveryDate) <= '${tDate}' GROUP by OD.productId Order by P.name;`;
  db.sequelize
    .query(
      qry,

      { type: sequelize.QueryTypes.SELECT }
    )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving report.",
      });
    });
};

exports.nondeliveryReport = (req, res) => {
  const fDate = req.query.fdate;
  const tDate = req.query.tdate;

  if (!fDate || !tDate) {
    res.status(400).send({
      message: "Date can not be empty!",
    });
    return;
  }

  const qry = `select C.name,C.mobile,O.totalAmount,O.payment,(O.totalAmount-O.payment) as balance,O.id as orderId,O.orderDate,O.deliveryDate,O.totalQty from orders O INNER JOIN customers C on C.id = O.customerId WHERE Date(O.deliveryDate) BETWEEN '${fDate}' AND '${tDate}' AND isDelivery=0 order by O.id`;
  db.sequelize
    .query(
      qry,

      { type: sequelize.QueryTypes.SELECT }
    )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving report.",
      });
    });
};

exports.productWiseSalesReport = (req, res) => {
  const fDate = req.query.fdate;
  const tDate = req.query.tdate;

  if (!fDate || !tDate) {
    res.status(400).send({
      message: "Date can not be empty!",
    });
    return;
  }

  const qry = `select P.name,sum(OD.qty) as qty,sum(OD.totalAmount) as totalAmount from orderDetails OD INNER JOIN orders O on O.id = OD.orderId INNER JOIN products P on P.id = OD.productId WHERE Date(O.orderDate) BETWEEN '${fDate}' AND '${tDate}' GROUP BY P.id ORDER BY P.name;`;
  db.sequelize
    .query(
      qry,

      { type: sequelize.QueryTypes.SELECT }
    )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving report.",
      });
    });
};

exports.customerWiseSalesReport = (req, res) => {
  const fDate = req.query.fdate;
  const tDate = req.query.tdate;

  if (!fDate || !tDate) {
    res.status(400).send({
      message: "Date can not be empty!",
    });
    return;
  }

  const qry = `select C.name,C.mobile,sum(O.totalAmount) as totalAmount from orders O INNER JOIN customers C on C.id = O.customerId WHERE Date(O.orderDate) BETWEEN '${fDate}' AND '${tDate}' GROUP BY C.id ORDER BY C.name;`;
  db.sequelize
    .query(
      qry,

      { type: sequelize.QueryTypes.SELECT }
    )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving report.",
      });
    });
};

exports.dateWiseSalesReport = (req, res) => {
  const fDate = req.query.fdate;
  const tDate = req.query.tdate;

  if (!fDate || !tDate) {
    res.status(400).send({
      message: "Date can not be empty!",
    });
    return;
  }

  const qry = `select O.orderDate as orderDate,O.id as orderId,C.name,C.mobile,O.totalQty,O.isDelivery,O.deliveryDate,O.deliveryTime,O.totalAmount as totalAmount from orders O INNER JOIN customers C on C.id = O.customerId WHERE Date(O.orderDate) BETWEEN '${fDate}' AND '${tDate}' ORDER BY O.orderDate;`;
  db.sequelize
    .query(
      qry,

      { type: sequelize.QueryTypes.SELECT }
    )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving report.",
      });
    });
};
