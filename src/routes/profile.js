const express = require("express")
const profileRouter = express.Router();

const {userAuth} = require("../middleware/auth")
const {validateEditProfileData} = require("../utils/validation")

profileRouter.get("/profile/view", userAuth, (req,res) => {
    try{
        //  Auth middleware has attached the details of the user from db to the request
         const user = req.user;
         res.send(user);
    }  catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  
  });

//    --------- Profile Edit API --------------------
  profileRouter.patch("/profile/edit", userAuth, async (req,res) => {

    //  First Data validation and Data Sanitization
    //  Dont trust req.body and user input
    //  Allow only selected fields to be edited by user
   try{
    if(!validateEditProfileData(req)){
      res.status(400).send("ERROR: Invalid Request");
    }
      const loggedInUser = req.user;
    //   Updation with new value for each key
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    // Save in DB
    await loggedInUser.save();

    res.json({
        message: `${loggedInUser.firstName}, your profile updated successfully`,
        data: loggedInUser,
    });

   } catch(err) {
      res.status(400).send("ERROR: " + err.message);
   }
  });

  module.exports = profileRouter;