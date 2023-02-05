const express = require('express')
var body = require("body-parser");

const app = express()

app.use(express.json())

// var bodyParser = require("body-parser");
// app.use(bodyParser.json());
// // penggunaan body-parser untuk ekstrak data request dari body
// app.use(bodyParser.urlencoded({extended: true}));

const tipeController = require("../controller/tipe_kamar_controller");
// const upload = require('../controller/upload-cover');

app.get("/getAll", tipeController.getAllType)
app.post("/findOne", tipeController.findType)
app.post("/",tipeController.addType)
app.delete("/:id", tipeController.deleteType)
app.put("/:id", tipeController.updateType)

module.exports=app