const {DataTypes}=require("sequelize")
const sequelize=require("../Utils/db-connection")
const expenseTable=sequelize.define("expensetrackertable",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false,
    },
      typeSelect: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [["income", "expense"]] 
    }
  },
    category:{
        type:DataTypes.STRING,
        allowNull:false
    },
    title:{
        type:DataTypes.STRING,
        allowNull:false
    },
    amount:{
        type:DataTypes.DECIMAL(10,2),
        allowNull:false
    }
},
    {
  timestamps: true // 🔥 REQUIRED
}
)

module.exports=expenseTable