const expensetable=require("../Models/expensetrackertable")
const { Op } = require("sequelize");

const addlist=async(req,res)=>{
    try {
        const {typeSelect,category,title,amount}=req.body
        const data=await expensetable.create({
            typeSelect,
            category,
            title,
            amount,
            userId: req.user.id
        })
        res.status(201).json(data)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Failed to add expense" });
    }
}



const getlist = async (req, res) => {
  try {
    const { filter, date } = req.query;

    let whereClause = {
  userId: req.user.id
};

    if (date && filter) {
      const selectedDate = new Date(Number(date));

      if (filter === "daily") {
        const start = new Date(selectedDate.setHours(0, 0, 0, 0));
        const end = new Date(selectedDate.setHours(23, 59, 59, 999));

        whereClause.createdAt = {
          [Op.between]: [start, end],
        };
      }

      else if (filter === "monthly") {
        const start = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        const end = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59);

        whereClause.createdAt = {
          [Op.between]: [start, end],
        };
      }

      else if (filter === "yearly") {
        const start = new Date(selectedDate.getFullYear(), 0, 1);
        const end = new Date(selectedDate.getFullYear(), 11, 31, 23, 59, 59);

        whereClause.createdAt = {
          [Op.between]: [start, end],
        };
      }
    }

    const data = await expensetable.findAll({
  where: whereClause,
  order: [["createdAt", "DESC"]],
});

// ✅ CALCULATE HERE
let totalIncome = 0;
let totalExpense = 0;

data.forEach(item => {
  if (item.typeSelect === "income") {
    totalIncome += Number(item.amount);
  } else {
    totalExpense += Number(item.amount);
  }
});

const balance = totalIncome - totalExpense;

// ✅ THEN RETURN
res.status(200).json({
  transactions: data,
  totalIncome,
  totalExpense,
  balance
});

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get expense" });
  }
};

const updatelist=async(req,res)=>{
    try {
        const {id}=req.params
        const {category,title,amount}=req.body

         const existing = await expensetable.findByPk(id);
    if (!existing) {
      return res.status(404).json({ message: "Data not found" });
    }

        await expensetable.update({
            category,
            title,
            amount
        },{
            where:{
                id:id
            }
        })
        const updatedData = await expensetable.findByPk(id);

        res.status(200).json(updatedData)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Failed to update expense" });
    }
}

const deletelist=async(req,res)=>{
    try {
        const {id}=req.params
       const deleted = await expensetable.destroy({ where: { id } });

if (!deleted) {
  return res.status(404).json({ message: "Data not found" });
}
        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Failed to get expense" });
    }
}
module.exports={
    addlist,
    getlist,
    updatelist,
    deletelist
}
