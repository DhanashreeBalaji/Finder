const jwt = require("jsonwebtoken");
const User = require("../models/User")


const userAuth = async(req,res,next) => {
    try{
        const token = req.cookies.token || req.body.token;
        if(!token) {
        //   throw new Error("Token is not valid!!!!!!!!!");
           return res.status(401).send("Please Login! Token not available");
        }
        //  Get the userId from the Token
           const decodedObj = await jwt.verify(token, "DEV@Tinder$790");
           const{_id} = decodedObj;

//  Check if such a user is present in database by extracting the userId from the token -------
        // const userId = null;
        const user = await User.findById(_id);
        if(!user){
            res.status(404).send("User not found");
        }
 // --------  The user details are kept inside the incoming request itself after verification of token ----------
        req.user = user;
        next();
    }
    catch(err) {
        res.status(400).send("ERROR: "+ err.message);
      
    }
};

module.exports = {
    userAuth,
}