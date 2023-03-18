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
const { checkRole } = require("../middleware/checkRole");


app.post("/login", userController.login)
app.get("/getAll", checkRole(["admin"]),userController.getAllUser)
app.get("/findOne/:id",checkRole(["admin"]), userController.findUser)
app.post("/",checkRole(["admin"]),  userController.addUser)
app.delete("/:id",checkRole(["admin"]), userController.deleteUser)
app.put("/:id",checkRole(["admin"]), userController.updateUser)

module.exports=app