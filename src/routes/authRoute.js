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

        const { firstName, lastName, emailId, password } = req.body;

        //Encrypt the password
        const hassedPassword = await bcrypt.hash(password, 10)

        //creating a new instance of user data
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hassedPassword,
        })
        await user.save()
        res.send("User added Successfully")
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

            res.cookie('token', token)
            res.send('Login successful!!!')
        } else {
            throw new Error('Invalid credentials')
        }

    }
    catch (err) {
        res.status(400).send('Error : ' + err.message)
    }
})


module.exports = router;