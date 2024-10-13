const express = require("express");
const app = express();

const connectDB = require("./config/database");
const User = require("./models/User");
const { validateSignUpData } = require("./utils/validation");
 const {userAuth} = require ("./middleware/auth") ;

const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require ("jsonwebtoken"); 
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")

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
 app.use(cookieParser());


//  ----------- Managing the Routes -------------- 
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);










// Feed API - GET /feed - get all the users from the database
app.get("/feed", async (req, res) => {
    try {

      //  ------------- Veryfying Token for each API request -------------
      

      const {token} = req.cookies;
        if(!token) {
          throw new Error("Token is not valid!!!!!!!!!");
        }
           const decodedObj = await jwt.verify(token, "DEV@Tinder$790");
           const{_id} = decodedObj;
           const user = await User.findById(_id);
           if(!user){
               res.status(404).send("User not found");
           }
           else {
               res.send(user);
           }


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