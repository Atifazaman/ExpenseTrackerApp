const userTable=require("../Models/usersTable")
const bcrypt = require("bcrypt");


const addUser=async(req,res)=>{
  try {
     const {name,email,password}=req.body
      if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const emailNormalized = email.toLowerCase();

 const checkEmail=await userTable.findOne({where:{
     email: emailNormalized 
}})

if(checkEmail){
    return res.status(400).json({ message: "Email already exists" });
}
const hashedPassword=await bcrypt.hash(password,10)
const newUser = await userTable.create({
            name,
            email:emailNormalized,
            password:hashedPassword
        });

        res.status(201).json({message: "User created successfully"});

  } catch (error) {
     res.status(500).json({ error: error.message });
  }  
}

const checkUser=async(req,res)=>{
  try {
     const {email,password}=req.body
       if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const emailNormalized = email.toLowerCase();
 const user=await userTable.findOne({where:{
    email:emailNormalized
}})

if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
const isMatch=await bcrypt.compare(password,user.password)
if (isMatch) {
    return res.status(200).json({
        message: "Login successful",
    });
} else {
    return res.status(401).json({ message: "Invalid email or password" });
}

  } catch (error) {
     res.status(500).json({ error: error.message });
  }  
}



module.exports={
    addUser,checkUser
}