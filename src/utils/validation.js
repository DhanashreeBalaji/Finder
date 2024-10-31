const validator = require("validator")

const validateSignUpData = (req) => {
    const {firstName,lastName,emailId,password} = req.body;

    if(!firstName || !lastName) {
     throw new Error ("Name is not valid");
    } else if (!validator.isEmail(emailId)) {
     throw new Error ("Email is not valid")
    } else if (!validator.isStrongPassword(password)) {
     throw new Error ("Please enter a Strong password")
    }
};

const validateEditProfileData = (req) => {
   
     const allowedEditFields = [
        "firstName",
        "lastName",
        "photoUrl",
        "gender",
        "age",
        "about",
     ];
    //  Check all the fields of the input request and compare with allowedEditFields in one go
     const isEditAllowed = Object.keys(req.body).every((field) =>
      allowedEditFields.includes(field)
    );
    return isEditAllowed;
}

module.exports = {
    validateSignUpData,
    validateEditProfileData,
}