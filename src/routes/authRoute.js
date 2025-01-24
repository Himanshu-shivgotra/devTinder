const express = require('express');
const { validateUserData } = require('../utils/validation')
const User = require('../models/user')
const bcrypt = require('bcrypt');
const router = express.Router();

// User signup route
router.post("/signup", async (req, res) => {
    try {
        //validation of data
        validateUserData(req)

        const { firstName, lastName, emailId, password, skills, age, gender } = req.body;

        //Encrypt the password
        const hassedPassword = await bcrypt.hash(password, 10)

        //creating a new instance of user data
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hassedPassword,
            skills,
            age,
            gender,
        })
        const savedUser = await user.save()
        const token = await savedUser.getJWT()
        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
        });

        res.json({ message: "User Added successfully!", data: savedUser });
    }
    catch (err) {
        res.status(400).send('Error : ' + err.message)
    }
})

router.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error('Invalid credentials')
        }
        const isPasswordValid = await user.validPassword(password)
        if (isPasswordValid) {
            const token = await user.getJWT();
            res.cookie('token', token), {
                expires: new Date(Date.now() + 8 * 3600000),
            }
            res.send(user)
        } else {
            throw new Error('Invalid credentials')
        }
    }
    catch (err) {
        res.status(400).send('Error : ' + err.message)
    }
})

router.post('/logout', async (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
    })
    res.send('Logout successful')
})


module.exports = router;