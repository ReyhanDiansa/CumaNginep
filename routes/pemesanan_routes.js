const express = require('express')
// var body = require("body-parser");

const app = express()

app.use(express.json())

var bodyParser = require("body-parser");
app.use(bodyParser.json());
// // penggunaan body-parser untuk ekstrak data request dari body
app.use(bodyParser.urlencoded({extended: true}));

const pemesananController = require("../controller/pemesanan_controller")
// const upload = require('../controller/upload-cover');

app.get("/getAll", pemesananController.getAllPemesanan)
app.get("/findOne/:id", pemesananController.find)
app.post("/",pemesananController.addPemesanan)
app.delete("/:id", pemesananController.deletePemesanan)
app.put("/:id", pemesananController.updatePemesanan)

module.exports=app