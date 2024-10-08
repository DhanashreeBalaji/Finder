const express = require("express");
const app = express();


const connectDB = require("./config/database");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");

// The connectDB() returns a promise so then and catch is required
connectDB()
.then(() => {
    console.log("Database connected established...");
    app.listen(7777, () => {
        console.log("Server is successfully running on port 7777");
    });    
})
.catch((err) => {
    console.error("Database connection failed...")
});
 app.use(express.json());

//  ---------- SIGNUP API ----------  Encrypting password ------------
app.post("/signup", async (req,res) => {  

  //  --------- Validating the user Input ---------

    validateSignUpData(req);

    //  const {firstName,lastName,emailId,password} = req.body;

    //  if(!firstName || !lastName) {
    //   throw new Error ("Name is not valid");
    //  } else if (!validator.isEmail(emailId)) {
    //   throw new Error ("Email is not valid")
    //  } else if (!validator.isStrongPassword(password)) {
    //   throw new Error ("Please enter a Strong password")
    //  }
       
        try{
          const data = req.body;
          const {firstName, lastName,emailId,password} = data;
          // ------------ First Encrypt password then store in DB --------------
            const passwordHash = await bcrypt.hash(password,10);
            console.log(passwordHash)
            // ----------- Creating a new Instance of the User Model in database-----------
          const user = new User({
            firstName,
            lastName,
            emailId,
            password:passwordHash
          });
          await user.save();
          res.send("User Saved")
       } catch(err){
        res.status(400).send("Error registering the user: " + err.message);
    }
})

 //  ---------lOGIN API ----------- 
    app.post("/login", async (req,res) => {
      try{
        const {emailId, password} = req.body;
        const user = await User.findOne({email: emailId});
        if(!user) {
          throw new Error("Invalid credentials")
        }
        //  -------- If email is present in DB, then check if password is entered correctly -----------
        const isPasswordvalid = await bcrypt.compare(password,user.password);

        if(!isPasswordvalid){
          throw new Error("Invalid Credentials");
        } else {
          res.send("Login Successful")
        }

      } catch(err) {
        res.status(400).send("ERROR : " + err.message);
      }
    })
  



app.get("/user", async (req,res) => {
    const email = req.body.email;
    try{
        // const user = await User.findOne({});
        // if(!user){
        //     res.status(404).send("User not found");
        // }
        // else{
        //     res.send(user);
        // }
 

        // const user = await User.find({lastName: /singh/}, null, {skip: 1});
        // if(!user){
        //     res.status(404).send("User not found");
        // }
        // else{
        //     res.send(user);
        // }
 

          const userId = null;
        const user = await User.findById(userId, 'firstName lastName');
        if(!user){
            res.status(404).send("User not found");
        }
        else{
            res.send(user);
        }
    } 
    catch(err){
        res.status(400).send("Something went wrong");
    }
    
});
// Feed API - GET /feed - get all the users from the database
app.get("/feed", async (req, res) => {
    try {
      const users = await User.find({});
      res.send(users);
    } catch (err) {
      res.status(400).send("Something went wrong ");
    }
  });

// Delete a user from the database
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
    //   const user = await User.findByIdAndDelete({ _id: userId });
      //const user = await User.findByIdAndDelete(userId);
      const user = await User.findOneAndDelete({ _id: userId });
  
      res.send("User deleted successfully");
    } catch (err) {
      res.status(400).send("Something went wrong ");
    }
  });

  // Update data of the user using ID
app.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try {
      const user = await User.findByIdAndUpdate({ _id: userId }, data, {
        returnDocument: "after",
      });
      console.log(user);
      res.send("User updated successfully");
    } catch (err) {
      res.status(400).send("Something went wrong ");
    }
  });

//   Update the data of user using emailId
app.patch("/users", async (req, res) => {
    const {emailId} = req.body.emailId;
    const data = req.body;
    try {
      const user = await User.findOneAndUpdate(emailId, data, {
        returnDocument: "after",
      });
      console.log(user);
      res.send("User updated successfully");
    } catch (err) {
      res.status(400).send("Something went wrong ");
      console.error(err);
    }
  });

  // ------------------ Adding API Level validation to Patch -------------------------
  app.patch("/user:/userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    try {
      // API LEVEL VALIDATION
      const ALLOWED_UPDATES = ["photoUrl","about","gender","age","skills"];
      const isUpdateAllowed = Object.keys(data).every((k) => 
      ALLOWED_UPDATES.includes(k)
    );
    if(!isUpdateAllowed){
      throw new Error("Update not allowed");
    }
    // if(data?.skills.length > 10) {
    //   throw new Error("No: of skills cannot be more than 10");
    // }
      const user = await User.findByIdAndUpdate({_id: userId}, data, {
        returnDocument: "after",
        runValidators :true,
      });
      console.log(user);
      res.send("User updated successfully");
    } catch (err) {
      res.status(400).send("UPDATE FAILED:" + err.message);
      console.error(err);
    }
  });