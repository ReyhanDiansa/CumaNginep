const express = require('express')
var body = require("body-parser");

const app = express()

app.use(express.json())

// var bodyParser = require("body-parser");
// app.use(bodyParser.json());
// // penggunaan body-parser untuk ekstrak data request dari body
// app.use(bodyParser.urlencoded({extended: true}));

const userController = require("../controller/user_controller");
// const upload = require('../controller/upload-cover');

app.get("/getAll", userController.getAllUser)
app.post("/findOne", userController.findUser)
app.post("/",userController.addUser)
app.delete("/:id", userController.deleteUser)
app.put("/:id", userController.updateUser)

module.exports=app