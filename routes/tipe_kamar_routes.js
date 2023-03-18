const express = require("express");
var body = require("body-parser");

const app = express();

app.use(express.json());

// var bodyParser = require("body-parser");
// app.use(bodyParser.json());
// // penggunaan body-parser untuk ekstrak data request dari body
// app.use(bodyParser.urlencoded({extended: true}));

const tipeController = require("../controller/tipe_kamar_controller");
// const upload = require('../controller/upload-cover');
const auth = require(`../auth/auth`);
const { checkRole } = require("../middleware/checkRole");


app.get(
  "/getAll",
  auth.authVerify,
  checkRole(['admin', 'resepsionis']),
  tipeController.getAllType
);
app.post(
  "/findOne",
  auth.authVerify,
  checkRole(['admin', 'resepsionis']),
  tipeController.findType
);
app.post("/", auth.authVerify, checkRole(["admin"]), tipeController.addType);
app.delete(
  "/:id",
  auth.authVerify,
  checkRole(["admin"]),
  tipeController.deleteType
);
app.put(
  "/:id",
  auth.authVerify,
  checkRole(["admin"]),
  tipeController.updateType
);

module.exports = app;
