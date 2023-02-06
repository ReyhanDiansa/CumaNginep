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
const auth = require(`../auth/auth`)

app.post("/login", userController.login)
app.get("/getAll", auth.authVerify,userController.getAllUser)
app.post("/findOne",auth.authVerify, userController.findUser)
app.post("/", auth.authVerify, userController.addUser)
app.delete("/:id",auth.authVerify, userController.deleteUser)
app.put("/:id",auth.authVerify, userController.updateUser)

module.exports=app