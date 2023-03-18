const express = require("express");
// var body = require("body-parser");

const app = express();

app.use(express.json());

var bodyParser = require("body-parser");
app.use(bodyParser.json());
// // penggunaan body-parser untuk ekstrak data request dari body
app.use(bodyParser.urlencoded({ extended: true }));

const roomController = require("../controller/kamar_controller");
// const upload = require('../controller/upload-cover');
const auth = require(`../auth/auth`);
const { checkRole } = require("../middleware/checkRole");

app.get(
  "/getAll",
  auth.authVerify,
  checkRole(['admin', 'resepsionis']),
  roomController.getAllRoom
);
app.post(
  "/getAvailable",
  checkRole(['admin', 'resepsionis']),
  auth.authVerify,
  roomController.availableRoom
);
app.post(
  "/findOne",
  checkRole(["admin"]),
  auth.authVerify,
  roomController.findRoom
);
app.post("/", auth.authVerify, checkRole(["admin"]), roomController.addRoom);
app.delete(
  "/:id",
  auth.authVerify,
  checkRole(["admin"]),
  roomController.deleteRoom
);
app.put(
  "/:id",
  auth.authVerify,
  checkRole(["admin"]),
  roomController.updateRoom
);

module.exports = app;
