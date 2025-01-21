const validator = require('validator');

const validateUserData = (req) => {
    const { firstName, lastName, emailId, password, } = req.body;
    if (!firstName || !lastName) {
        throw new Error("Name is required");
    }
    else if (firstName.length < 2 || firstName.length > 30) {
        throw new Error(" First name length must be between 2 and 30 characters");
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password");
    }
}

const validateProfileEdit = (req) => {
    const allowedEditFields = ["firstName", "lastName", "age", "about", "gender", "photoUrl", "skills"];
    const { photoUrl, skills, age, about } = req.body;
    const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));
    if (!isEditAllowed) {
        throw new Error("Invalid edit field")
    }
    else if (photoUrl && !validator.isURL(photoUrl)) {
        throw new Error("Invalid photo URL");
    }
    else if (skills && (!Array.isArray(skills) || skills.length > 10)) {
        throw new Error("Skills must be an array with a maximum of 10 items");
    }
    else if (age && !validator.isInt(age.toString(), { min: 16, max: 120 })) {
        throw new Error("Age must be a number between 16 and 120")
    }
    else if (about && about.length > 500) {
        throw new Error("About section must not exceed 500 characters");
    }
    return isEditAllowed;
}


module.exports = { validateUserData, validateProfileEdit };