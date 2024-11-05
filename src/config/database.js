// Here we write the code to connect to the database from our app using Mongoose library

const mongoose = require("mongoose");
require("dotenv").config();

// When this function is called, the db will connect to our app
const connectDB =  async () => {
    await mongoose.connect(
       process.env.MONGODB_URL
    );
};

module.exports = connectDB;
