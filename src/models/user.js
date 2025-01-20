const mongoose = require('mongoose');

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
    },
    password: {
        minLength: 5,
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        min: 16,
        trim: true,
    },
    gender: {
        type: String,
        lowercase: true,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender data is not valid")
            }
        },
    },
    photoUrl: {
        type: String,
        trim: true,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png "
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


module.exports = mongoose.model("User", userSchema)