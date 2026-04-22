const db = require("../models");
const OrderDetail = db.orderDetails;
const Op = db.Sequelize.Op;
// Create and Save a new OrderDetail
exports.create = (req, res) => {
  // Validate request
  if ( !req.body.productId ||
    !req.body.qty ||
    !req.body.price ||
    !req.body.totalAmount ||
    !req.body.createdBy ||
    !req.body.updatedBy
  ) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  // Create a OrderDetail
  const orderDetail = {
    productId: req.body.productId,
    qty: req.body.qty,
    price: req.body.price,
    totalAmount: req.body.totalAmount,
    createdBy: req.body.createdBy,
    updatedBy: req.body.updatedBy,
  };
  // Save OrderDetail in the database
  OrderDetail.create(orderDetail)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
              err.message || "Some error occurred while creating the OrderDetail.",
        });
      });
};
// Retrieve all OrderDetail from the database.
exports.findAll = (req, res) => {
  const condition = null;
  OrderDetail.findAll({where: condition})
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving orderDetails.",
        });
      });
};

// Find a single OrderDetail with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  OrderDetail.findByPk(id)
      .then((data) => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find OrderDetail with id=${id}.`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error retrieving OrderDetail with id=" + id,
        });
      });
};
// Update a OrderDetail by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  OrderDetail.update(req.body, {
    where: {id: id},
  })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "OrderDetail was updated successfully.",
          });
        } else {
          res.send({
            message: `Cannot update OrderDetail with id=${id}. Maybe OrderDetail was not found or req.body is empty!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error updating OrderDetail with id=" + id,
        });
      });
};
// Delete a OrderDetail with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  OrderDetail.destroy({
    where: {id: id},
  })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "OrderDetail was deleted successfully!",
          });
        } else {
          res.send({
            message: `Cannot delete OrderDetail with id=${id}. Maybe OrderDetail was not found!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Could not delete OrderDetail with id=" + id,
        });
      });
};

