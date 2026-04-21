const express=require("express")
const expenseRouter=express.Router()
const expenseController=require("../controllers/expenseTrackerController")
const auth = require("../middleware/authMiddleware");

expenseRouter.post("/add",auth,expenseController.addlist)
expenseRouter.put("/update/:id",auth,expenseController.updatelist)
expenseRouter.delete("/delete/:id",auth,expenseController.deletelist)
expenseRouter.get("/",auth,expenseController.getlist)


module.exports=expenseRouter
