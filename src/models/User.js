const mongoose = require("mongoose");
const validator = require("validator")
const bcrypt = require("bcrypt");
const jwt = require ("jsonwebtoken"); 

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
    },
    lastName: {
        type:String,
        required: true,
        minLength: 4,
        maxLength: 50,
    },
    emailId:{
        type:String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email Address : " + value);
            }
        }
    },
    password:{
        type: String,
        required: true,
        // Custom validation
        validate(value) {
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a Strong Password: " + value);
            }
        }
    },
    age: {
        type:Number,
        min: 18,
    },
    gender: {
        type:String,
         // Custom validation function in schema
      validate(value) {
    if(!["male","female","others"].includes(value)){
        throw new Error("Gender data not valid")
    }
},
    },
    photoUrl: {
        type: String,
        default: "https://geographyandyou.com/images/user-profile.png",
        validate(value){ 
            if(!validator.isURL(value)) {
                throw new Error("Invalid Photo URL: " + value);
            }
        },
    },
    about:{
        type: String,
        default: "This is default about of user!",
    },
    skills: {
        type: [String],
        maxLength: 10
    },
},
   {
    timestamps: true,
    }
);

// ------------- Schema Methods -----------------

// ------- The schema method is to create a jwt token while logging in ----------------
  userSchema.methods.getJWT = async function () {
     const user = this;
     const token = await jwt.sign({_id: user.id}, "DEV@Tinder$790", {
        expiresIn: "7d",
       });
       return token;
  };

  
//  --------- The schema method is to validate password entered by user to login ---------
userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordvalid = await bcrypt.compare(
        passwordInputByUser, 
        passwordHash);

       return isPasswordvalid;
};

module.exports = mongoose.model("User", userSchema);

