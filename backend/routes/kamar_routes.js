const express = require("express");

const app = express();

app.use(express.json());

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const roomController = require("../controller/kamar_controller");
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
  auth.authVerify,
  checkRole(['admin', 'resepsionis']),
  roomController.availableRoom
);
app.post(
  "/getAvailableWType",
  roomController.availableRoomWithType
);

app.get(
  "/checkAvailable/:tgl_akses",
  auth.authVerify,
  checkRole(['admin', 'resepsionis']),
  roomController.availableRoomSingleDate
);
app.get(
  "/findOne/:nomor_kamar",
  auth.authVerify,
  checkRole(["admin","resepsionis"]),
  roomController.findRoom
);

app.get(
  "/findOneById/:id",
  auth.authVerify,
  checkRole(["admin","resepsionis"]),
  roomController.findRoomById
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
app.get("/getRoomCount", roomController.getRoomLength)

module.exports = app;
