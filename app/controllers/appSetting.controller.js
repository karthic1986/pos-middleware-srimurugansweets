/* eslint-disable */
const db = require("../models");
const AppSetting = db.appSettings;

const NAME_PATTERN = /^[A-Z0-9_]+$/;

// Create and Save a new App Setting
exports.create = (req, res) => {
  const name = (req.body.name || "").trim();
  // User ids can be 0, so check for missing rather than falsy.
  if (!name || req.body.createdBy == null) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  if (!NAME_PATTERN.test(name)) {
    res.status(400).send({
      message: "Name can only contain capital letters, numbers and _",
    });
    return;
  }
  const appSetting = {
    name: name,
    value: req.body.value,
    description: req.body.description,
    createdBy: req.body.createdBy,
    updatedBy: req.body.createdBy,
  };
  AppSetting.create(appSetting)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        if (err.name === "SequelizeUniqueConstraintError") {
          res.status(400).send({
            message: `A setting named ${name} already exists.`,
          });
          return;
        }
        res.status(500).send({
          message:
              err.message || "Some error occurred while creating the App Setting.",
        });
      });
};

// Retrieve all App Settings from the database.
exports.findAll = (req, res) => {
  AppSetting.findAll({order: [["name", "ASC"]]})
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving app settings.",
        });
      });
};

// Update an App Setting by the id in the request. The name is the key the
// app looks settings up by, so it can't be changed here.
exports.update = (req, res) => {
  const id = req.params.id;
  if (req.body.updatedBy == null) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }
  AppSetting.update({
    value: req.body.value,
    description: req.body.description,
    updatedBy: req.body.updatedBy,
  }, {
    where: {id: id},
  })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "App Setting was updated successfully.",
          });
        } else {
          res.status(404).send({
            message: `Cannot update App Setting with id=${id}. Maybe App Setting was not found!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error updating App Setting with id=" + id,
        });
      });
};

// Delete an App Setting with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  AppSetting.destroy({
    where: {id: id},
  })
      .then((num) => {
        if (num == 1) {
          res.send({
            message: "App Setting was deleted successfully!",
          });
        } else {
          res.status(404).send({
            message: `Cannot delete App Setting with id=${id}. Maybe App Setting was not found!`,
          });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: "Could not delete App Setting with id=" + id,
        });
      });
};
