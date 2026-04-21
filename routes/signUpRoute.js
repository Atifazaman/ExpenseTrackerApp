const express=require("express")
const userRoute=express.Router()
const userController=require("../controllers/signUp.Controller")


userRoute.post("/signup",userController.addUser)
userRoute.post("/login",userController.checkUser)

module.exports=userRoute