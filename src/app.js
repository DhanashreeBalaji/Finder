const express = require("express");
const app = express();

const connectDB = require("./config/database");
const User = require("./models/User");

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

app.post("/signup", async (req,res) => {
    const user = new User({
        firstName: "A",
        lastName: "B",
        emailId: "C",
        password: "D",
    });
    await user.save();
    res.send("USER ADDED");
})