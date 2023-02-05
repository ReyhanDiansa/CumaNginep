const express = require('express')
// var body = require("body-parser");

const app = express()

app.use(express.json())

var bodyParser = require("body-parser");
app.use(bodyParser.json());
// // penggunaan body-parser untuk ekstrak data request dari body
app.use(bodyParser.urlencoded({extended: true}));

const roomController = require("../controller/kamar_controller");
// const upload = require('../controller/upload-cover');

app.get("/getAll", roomController.getAllRoom)
app.post("/getAvailable", roomController.availableRoom)
app.post("/findOne", roomController.findRoom)
app.post("/",roomController.addRoom)
app.delete("/:id", roomController.deleteRoom)
app.put("/:id", roomController.updateRoom)

module.exports=app