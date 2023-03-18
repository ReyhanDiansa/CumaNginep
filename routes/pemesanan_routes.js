const express = require("express");
// var body = require("body-parser");

const app = express();

app.use(express.json());

var bodyParser = require("body-parser");
app.use(bodyParser.json());
// // penggunaan body-parser untuk ekstrak data request dari body
app.use(bodyParser.urlencoded({ extended: true }));

const pemesananController = require("../controller/pemesanan_controller");
// const upload = require('../controller/upload-cover');
const auth = require(`../auth/auth`);
const { checkRole } = require("../middleware/checkRole");


app.get(
  "/getAll",
  checkRole(["admin", "resepsionis"]),
  auth.authVerify,
  pemesananController.getAllPemesanan
);
app.get(
  "/findOne/:id",
  auth.authVerify,
  checkRole(["admin", "resepsionis"]),
  pemesananController.find
);
app.post(
  "/",
  auth.authVerify,
  checkRole(["admin", "resepsionis"]),
  pemesananController.addPemesanan
);
app.delete(
  "/:id",
  auth.authVerify,
  checkRole(["admin", "resepsionis"]),
  pemesananController.deletePemesanan
);
app.put(
  "/:id",
  auth.authVerify,
  checkRole(["admin", "resepsionis"]),
  pemesananController.updatePemesanan
);

module.exports = app;
