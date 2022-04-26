const express = require("express");
const router = express.Router();
const User = require("../models/user");
const cryptoJs = require('crypto-js');
const user = require("../models/user");
const jwt = require('jsonwebtoken');

// Register

router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: cryptoJs.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
  });
  try {
    const saveUser = await newUser.save();
    res.status(201).json(saveUser);
    console.log(saveUser);
  } catch (err) {
      res.status(500).json(err)
    console.log(err);
  }
});

//Login

router.post('/login',async(req,res)=>{
    try{
        const user = await User.findOne({email:req.body.email});
        !user && res.status(401).json("Wrong Credential!")
        const hashPassword = cryptoJs.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        )
        const originalPassword = hashPassword.toString(cryptoJs.enc.Utf8);
        originalPassword!== req.body.password && res.status(401).json("Wrong Credential!")

        const accessToken= jwt.sign({
            id:user._id,
            isAdmin:user.isAdmin
        },process.env.ACCESS_TOKEN,{expiresIn:'8h'})

        const {password, ...others}=user._doc;

        res.status(200).json({...others,accessToken});
        console.log('output',others,accessToken);
    }catch(err){
        res.status(500).json(err)
    };
})

module.exports = router;
