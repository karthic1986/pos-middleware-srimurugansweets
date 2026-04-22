const db = require("../models/index");
const sequelize = require("sequelize");

exports.deliveryBySearchQry = (req, res) => {
  const searchQry = req.query.s;

  if (!searchQry) {
    res.status(400).send({
      message: "Search value can not be empty!",
    });
    return;
  }

  const qry = `select O.* from orders O 
                    Inner join customers C on C.Id=O.customerId
                    where (C.mobile='${searchQry}' OR O.Id='${searchQry}') and O.isDelivery=0;`;
  db.sequelize.query(qry,
    { type: sequelize.QueryTypes.SELECT })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving report.",
      });
    });
};


exports.deliveryById = async (req, res) => {
  const orderId = req.params.id;

  try {
    if (!orderId) {
      res.status(400).send({
        message: "Search value can not be empty!",
      });
      return;
    }

    let qry = `select P.*,IFNULL(OD.qty,0) As qty from products P 
                  LEFT JOIN orderDetails OD on OD.productId=P.id and OD.orderId=${orderId} 
                  where P.isActive=true || P.isActive=false AND OD.qty>0;`;
    let orderDetails = await db.sequelize.query(qry,
      { type: sequelize.QueryTypes.SELECT });


    qry = `select * from orders where id=${orderId};`;
    let orders = await db.sequelize.query(qry,
      { type: sequelize.QueryTypes.SELECT });

    qry = `select * from customers where id=${orders[0].customerId};`;
    let customers = await db.sequelize.query(qry,
      { type: sequelize.QueryTypes.SELECT });

    let respPayload = {
      "orderDetails": orderDetails,
      "order": orders[0],
      "customer": customers[0],

    }

    res.send(respPayload);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Some error occurred while get the delivery.",
    });
  }
};

