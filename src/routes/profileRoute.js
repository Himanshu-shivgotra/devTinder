const express = require('express');
const { userAuth } = require('../middlewares/auth');
const router = express.Router();
const validator = require('validator');
const bcrypt = require('bcrypt');
const { validateProfileEdit } = require('../utils/validation')


router.get('/profile/view', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user)
    }
    catch (err) {
        res.status(400).send('Error : ' + err.message)
    }
})

// update profile
router.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        if (!validateProfileEdit(req)) {
            throw new Error('Invalid profile edit request')
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        })
        await loggedInUser.save()
        res.json({
            message: `${loggedInUser.firstName} , your profile has been updated successfully`,
            data: loggedInUser
        });
    }
    catch (err) {
        res.status(400).send('Error found: ' + err.message)
    }
})

router.patch('/profile/password', userAuth, async (req, res) => {
    try {
        const user = req.user;
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            throw new Error('Both Current and New Password are required')
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
        if (!isPasswordValid) {
            throw new Error('Current password is incorrect')
        }
        if (!validator.isStrongPassword(newPassword)) {
            throw new Error("Please enter a strong password");
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save();

        res.send('Password Updated Successfully!!!')
    }
    catch (err) {
        res.status(400).send('Error : ' + err.message)
    }
})

module.exports = router;