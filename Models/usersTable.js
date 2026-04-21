const {DataTypes}=require("sequelize")
const sequelize=require("../Utils/db-connection")
const userTable=sequelize.define("users",{
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    email:{
         type: DataTypes.STRING,
        allowNull: false,
        unique: true, 
        validate: {
            isEmail: true
        }
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    }
})



module.exports = userTable;