const express=require("express")
const expenseRouter=express.Router()
const expenseController=require("../controllers/expenseTrackerController")

expenseRouter.post("/add",expenseController.addlist)
expenseRouter.put("/update/:id",expenseController.updatelist)
expenseRouter.delete("/delete/:id",expenseController.deletelist)
expenseRouter.get("/",expenseController.getlist)


module.exports=expenseRouter