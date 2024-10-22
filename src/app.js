const express = require("express");
const app = express();

const connectDB = require("./config/database");
const User = require("./models/User");
const { validateSignUpData } = require("./utils/validation");
 const {userAuth} = require ("./middleware/auth") ;


const cookieParser = require("cookie-parser");
const jwt = require ("jsonwebtoken"); 
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const userRouter =  require("./routes/user")

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
app.use("/",userRouter)










