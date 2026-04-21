const {Sequelize}=require("sequelize")
const sequelize=new Sequelize("mydailyexpenses","root","aaaa",{
    host:"localhost",
    dialect:"mysql"
});

(async()=>{
    try {
        await sequelize.authenticate()
        console.log("Sequelize connected to the db")
    } catch (error) {
        console.log(error)
        console.log("Sequelize failed connected to the db")
    }
})()

module.exports=sequelize