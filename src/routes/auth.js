const express = require("express");
const authRouter = express.Router();

const User = require("../models/User")

const {validateSignUpData} = require("../utils/validation")
const bcrypt = require("bcrypt");


//  ---------- SIGNUP API 
authRouter.post("/signup", async (req,res) => {  
    try{
                 //  --------- Validating the user Input ---------
            validateSignUpData(req);
  
            const data = req.body;
            const {firstName, lastName,emailId,password} = data;
            // ------------ First Encrypt password then store in DB --------------
              const passwordHash = await bcrypt.hash(password,10);
            
              // ----------- Creating a new Instance of the User Model in database-----------
            const user = new User({
              firstName,
              lastName,
              emailId,
              password:passwordHash
            });
            // savedUser will be the db returned object
            const savedUser = await user.save();
            const token = await user.getJWT();
             res.cookie("token", token, {
              expires: new Date(Date.now() + 8 * 3600000),
            })
            res.json({ message: "User Added successfully!", data: savedUser });
         } catch(err){
          res.status(400).send("Error registering the user: " + err.message);
      }
  })
  
   //  ---------lOGIN API ----------- 
authRouter.post("/login", async (req,res) => {
        try{
     
          const {emailId,password} = req.body;
          const user = await User.findOne({emailId});
          if(!user) {
            throw new Error("Invalid Credentials")
          }
          //  -------- If email is present in DB, then check if password is entered correctly -----------
          // const isPasswordvalid = await bcrypt.compare(password, user.password);
             
            //  Go to User schema methods to check for user password validation
            const isPasswordvalid = await user.validatePassword(password);
  
          if(!isPasswordvalid){
            throw new Error("Invalid Credentials",);
          } 
          else {
  
            // --------------- Now its clear that the user is valid. So create jwt token and send it with cookies  ----------
            //  const token = await jwt.sign({_id: user.id}, "DEV@Tinder$790", {
            //   expiresIn: "7d",
            //  });

            const token = await user.getJWT();
            //  Send the token in response of login request by inserting it into the cookie
            res.cookie("token", token, {
              expires: new Date(Date.now() + 8 * 3600000),
            } )
            res.send(user)
          }
  
        } catch(err) {
          res.status(400).send("ERROR : " + err.message);
        }
      })

//    ----------- LOGOUT API -----------
authRouter.post("/logout", async(req,res) => {
//  Cleanup activities are done here

    res.cookie("token", null, {
        expires: new Date(Date.now()),
      }) 
      .send("Logout Successful")
})

      module.exports = authRouter;