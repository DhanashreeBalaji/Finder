// Here we write the code to connect to the database from our app using Mongoose library

const mongoose = require("mongoose");

// When this function is called, the db will connect to our app
const connectDB =  async () => {
    await mongoose.connect(
        "mongodb+srv://dhanashreeblj:JPEObLFs8xKqQmny@cluster0.3yvbzhr.mongodb.net/DevTinder"
    );
    
};

module.exports = connectDB;
