const req = require("express/lib/request");
const res = require("express/lib/response");
const jwt = require("jsonwebtoken");

// const veryToken = (req, res, next) => {
//   const authHeader = req.headers.token;
//   if (authHeader) {
//       const token= authHeader.split('')[1];
//     jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
//       if (err) res.status(403).json("Token is Not valid!");
//       req.user = user;
//       next();
//     });
//   } else {
//     return res.status(401).json("Your not authenticated!");
//   }
// };

const verifyToekenAuthorization = (req, res, next) => {
  veryfiedToken(req, res,next, () => {      
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
};

const veryfiedToken=(req,res,next)=>{
    const token =req.header("auth-token");
    if(!token) return res.status(400).send("Access deined!")
    try{
        let verify = jwt.verify(token,process.env.ACCESS_TOKEN);
        req.user =verify;
        next();

    }catch(error){
        res.status(400).send("Invalid token")
    }
}

const verifyTokenAdmin =(req,res.next,()=>{
    veryfiedToken(req,res,()=>{
        if(req.user.isAdmin){
            next();
        }else{
            res.status(403).json("You are not allowed that")
        }
    })
})

module.exports = { veryfiedToken,verifyToekenAuthorization,verifyTokenAdmin };
