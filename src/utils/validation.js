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

module.exports = { validateUserData };