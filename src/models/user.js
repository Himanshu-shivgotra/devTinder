const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email :' + value);
            }
        }
    },
    password: {
        minLength: 5,
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error('Password is not strong  :' + value);
            }
        }
    },
    age: {
        type: Number,
        min: 16,
        trim: true,
    },
    gender: {
        type: String,
        lowercase: true,
        enum: {
            values: ['male', 'female', 'other'],
            message: `{VALUE} is not a valid gender type`
        },
        // validate(value) {
        //     if (!["male", "female", "others"].includes(value)) {
        //         throw new Error("Gender data is not valid")
        //     }
        // },
    },
    photoUrl: {
        type: String,
        trim: true,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png ",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Photo url is not valid " + value)
            }
        }
    },
    about: {
        type: String,
        trim: true,
        default: "This is default intro about the user"
    },
    skills: {
        type: [String],
    }
},
    {
        timestamps: true,
    }
);

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "Himanshu@devtinder555", { expiresIn: "7d" });
    return token;
}

userSchema.methods.validPassword = async function (passwordInputByUser) {
    const user = this;
    const hassedPassword = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, hassedPassword);
    return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema)