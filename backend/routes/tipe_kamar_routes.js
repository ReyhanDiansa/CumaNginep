const express = require("express");
var body = require("body-parser");

const app = express();

app.use(express.json());


const tipeController = require("../controller/tipe_kamar_controller");
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

app.get(
  "/findOneById/:idTipe",
  auth.authVerify,
  checkRole(['admin', 'resepsionis']),
  tipeController.findTypeById
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

app.post("/getAvailableTypeRoom",auth.authVerify,
checkRole(["admin","resepsionis"]),tipeController.getAvailable)
module.exports = app;
