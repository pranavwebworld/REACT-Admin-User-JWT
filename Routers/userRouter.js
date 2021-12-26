const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../models/middileware/auth")
router.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const { email, password, passwordverify } = req.body;

    //validation
    if (!email || !password || !passwordverify) {
      console.log("enter all");

      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({ errorMessage: "Password is too short " });
    }

    if (password != passwordverify) {
      return res
        .status(400)
        .json({ errorMessage: "please enter the same password twice" });
    }

    const existingUser = await User.findOne({ email: email });

    console.log(existingUser);

    if (existingUser) {
      return res.status(400).json({ errorMessage: "Email already exist" });
    }

    //hash password

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    //enter user to db

    const newUser = new User({
      email,
      passwordHash,
    });

    const savedUser = await newUser.save();

    //sign the token

    const token = jwt.sign(
      {
        user: savedUser._id,
      },
      process.env.JWT_SECRET
    );

    console.log(token);

    //send the token

    res.cookie("token", token, { httpOnly: true }).send();
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
      console.log("enter all");

      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields" });
    }

    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      return res.status(401).json({ errorMessage: "Wrong login Credentials" });
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );

    if(!passwordCorrect){

    return res.status(401).json({ errorMessage: "Wrong login Credentials" });
    

    }


     //sign the token login

     const token = jwt.sign(
        {
          user: existingUser._id,
        },
        process.env.JWT_SECRET
      );
  
      console.log(token);
  
      //send the token
  
      res.cookie("token", token, { httpOnly: true }).send();




  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});



router.get("/logout",(req,res)=>{


    console.log('inlog out');

    res.cookie('token',"",{

        httpOnly:true, 
        expires:new Date(0)

    }).send()



})



router.get("/trial",auth,(req,res)=>{

    console.log('trial');

    
})
module.exports = router;
 