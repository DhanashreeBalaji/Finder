const express = require("express");
const app = express();

const connectDB = require("./config/database");
const User = require("./models/User");

const cookieParser = require("cookie-parser");
const cors = require("cors");
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

//  app.use(cors);
//  Whitelisting the origin domain name
 app.use(cors({
    origin : "http://localhost:5173",
    credentials: true,
 }));


//  ----------- Managing the Routes -------------- 
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter)










