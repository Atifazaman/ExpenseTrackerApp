const express=require("express")
const cors=require("cors")
const app=express()
const db=require("./Utils/db-connection")
require("./Models/expensetrackertable")
require("./Models/usersTable")
const expenseRouter=require("./routes/expenseRoutes")
const userRouter=require("./routes/signUpRoute")


app.use(cors())
app.use(express.json())
app.use(express.static("public"))

app.use("/user",userRouter)
app.use("/expensetracker",expenseRouter)


db.sync({force:false}).then(()=>{
app.listen(3000,()=>{
    console.log("Server is running")
})
}).catch((err)=>console.log(err))

