const userTable=require("../Models/usersTable")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
const hashedPassword = await bcrypt.hash(password.trim(), 10);
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

const checkUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailNormalized = email.trim().toLowerCase();

    const user = await userTable.findOne({
      where: { email: emailNormalized }
    });

    const INVALID_MSG = "Invalid email or password";

    if (!user) {
      return res.status(401).json({ message: INVALID_MSG });
    }

    const isMatch = await bcrypt.compare(password.trim(), user.password);
    console.log("Match:", isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: INVALID_MSG });
    }
  

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      }
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



module.exports={
    addUser,checkUser
}
