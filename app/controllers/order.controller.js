const db = require("../models");
const Order = db.orders;
const OrderDetail = db.orderDetails;
const Customer = db.customers;
// Create and Save a new Order

async function createOrder(req, res) {
  if (!req.body.order.customerNumber || req.body.order.totalQty === "" || req.body.order.totalAmount === "" || req.body.order.payment === "" || req.body.order.discount === "" || !req.body.order.orderDate || !req.body.order.deliveryDate || !req.body.order.createdBy || !req.body.order.updatedBy) {
    res.status(400).send({
      message: req.body.order,
    });
    return;
  }

  req.body.orderDetails.forEach((ob) => {
    if (!ob.productId || !ob.qty || !ob.price || !ob.totalAmount || !ob.createdBy || !ob.updatedBy) {
      res.status(400).send({
        message: "Order details content can not be empty!",
      });
      return;
    }
  });
  try {
    // Check Customer
    let customerMobile = req.body.order.customerNumber;
    let customerName = req.body.order.customerName;
    const cusWherecondition = {
      mobile: customerMobile,
    };
    let customer;
    await Customer.findAll({ where: cusWherecondition })
      .then((data) => {
        customer = data[0];
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error retrieving Customer with mobile {customerMobile}",
        });
      });

    if (typeof customer === "undefined" || customer === null) {
      // Create a Customer
      customer = {
        name: customerName,
        mobile: customerMobile,
        isActive: true,
      };
      // Save Customer in the database
      await Customer.create(customer, { raw: true })
        .then((data) => {
          customer = data;
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Some error occurred while creating the Customer.",
          });
        });
    }

    // Create a Order
    const order = {
      customerId: customer.id,
      productId: req.body.order.productId,
      totalQty: req.body.order.totalQty,
      totalAmount: req.body.order.totalAmount,
      payment: req.body.order.payment,
      discount: req.body.order.discount,
      orderDate: req.body.order.orderDate,
      isDelivery: req.body.order.isDelivery,
      deliveryDate: req.body.order.deliveryDate,
      deliveryTime: req.body.order.deliveryTime,
      notes: req.body.order.notes,
      createdBy: req.body.order.createdBy,
      updatedBy: req.body.order.updatedBy,
    };

    // Save Order in the database
    let orderResp;
    await Order.create(order).then((data) => {
      orderResp = data;
    });

    for (const ob of req.body.orderDetails) {
      const orderDetail = {
        orderId: orderResp.id,
        productId: ob.productId,
        qty: ob.qty,
        price: ob.price,
        totalAmount: ob.totalAmount,
        createdBy: ob.createdBy,
        updatedBy: ob.updatedBy,
      };

      // Save OrderDetail in the database
      await OrderDetail.create(orderDetail);
    }

    res.send(orderResp);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: error,
    });
  }
}

async function updateOrder(req, res) {
  if (!req.body.order.id || req.body.order.payment === "" || req.body.order.discount === "" || !req.body.order.deliveryDate || !req.body.order.updatedBy) {
    res.status(400).send({
      message: "Order content can not be empty!",
    });
    return;
  }

  let orderData = {
    id: req.body.order.id,
    isDelivery: req.body.order.isDelivery,
    deliveryDate: req.body.order.deliveryDate,
    payment: req.body.order.payment,
    discount: req.body.order.discount,
    updatedBy: req.body.order.updatedBy,
    totalQty: req.body.order.totalQty,
    totalAmount: req.body.order.totalAmount,
    notes: req.body.order.notes,
    deliveryTime: req.body.order.deliveryTime,
  };

  try {
    OrderDetail.findAll({ where: { orderId: orderData.id } }).then((data) => {
      if (data) {
        for (const ob of data) {
          let isFound = false;
          for (const ob1 of req.body.orderDetails) {
            if (ob.productId == ob1.productId) {
              isFound = true;
              break;
            }
          }
          if (!isFound) {
            OrderDetail.destroy({
              where: { id: ob.id },
            });
          }
        }
      }
    });

    for (const ob of req.body.orderDetails) {
      OrderDetail.findOne({ where: { orderId: orderData.id, productId: ob.productId } }).then((data) => {
        if (data) {
          ob.id = data.id;
          OrderDetail.update(ob, {
            where: { id: ob.id },
          });
        } else {
          const orderDetail = {
            orderId: orderData.id,
            productId: ob.productId,
            qty: ob.qty,
            price: ob.price,
            totalAmount: ob.totalAmount,
            createdBy: ob.createdBy,
            updatedBy: ob.updatedBy,
          };

          OrderDetail.create(orderDetail);
        }
      });
    }

    const id = orderData.id;
    await Order.update(orderData, {
      where: { id: id },
    }).then((data) => {
      orderResp = data;
    });
    //res.send(orderResp);
    if (orderResp[0] >= 1) {
      res.status(200).send({
        message: "Order updated successfully",
        orderId: orderData.id,
      });
    } else {
      res.status(500).send({
        message: "something went wrong please try again",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: error,
    });
  }
}

exports.create_v1 = async (req, res) => {
  // Validate request
  //console.log(req.body);

  if (req.body.order.id == 0) await createOrder(req, res);
  else await updateOrder(req, res);
};

// Create and Save a new Order
exports.create = (req, res) => {
  // Validate request
  if (!req.body.customerId || !req.body.totalQty || !req.body.totalAmount || !req.body.orderDetailDate || !req.body.isDelivery || !req.body.deliveryDate || !req.body.createdBy || !req.body.updatedBy) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  // Create a Order
  const order = {
    customerId: req.body.customerId,
    productId: req.body.productId,
    totalQty: req.body.totalQty,
    totalAmount: req.body.totalAmount,
    orderDate: req.body.orderDate,
    isDelivery: req.body.isDelivery,
    deliveryDate: req.body.deliveryDate,
    createdBy: req.body.createdBy,
    updatedBy: req.body.updatedBy,
  };
  // Save Order in the database
  Order.create(order)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Order.",
      });
    });
};

// Retrieve all Order from the database.
exports.findAll = (req, res) => {
  const condition = null;
  Order.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving orders.",
      });
    });
};

// Find a single Order with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Order.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Order with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Order with id=" + id,
      });
    });
};
// Update a Order by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Order.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Order was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Order with id=${id}. Maybe Order was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Order with id=" + id,
      });
    });
};
// Delete a Order with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Order.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Order was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Order with id=${id}. Maybe Order was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Order with id=" + id,
      });
    });
};
