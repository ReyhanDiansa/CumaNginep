const express = require('express')
var body = require("body-parser");

const app = express()

app.use(express.json())


const userController = require("../controller/user_controller");
const auth = require(`../auth/auth`)
const { checkRole } = require("../middleware/checkRole");


app.post("/login", userController.login)
app.get("/getAll", auth.authVerify, checkRole(["admin","resepsionis"]), userController.getAllUser)
app.get("/findOne/:id", auth.authVerify, checkRole(["admin","resepsionis"]),userController.findUser)
app.post("/",  userController.addUser)
app.delete("/:id", auth.authVerify, checkRole(["admin"]),userController.deleteUser)
app.put("/:id", userController.updateUser)
app.get("/findAllCustomer", userController.findAllCustomer)
app.get("/findAllExcCustomer", userController.findAllExcCustomer)
app.post("/RegisterCustomer", userController.RegisterCustomer)

module.exports=app