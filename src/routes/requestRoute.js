const express = require('express');
const { userAuth } = require('../middlewares/auth')
const router = express.Router();

router.post('/sendConnectionRequest', userAuth, async (req, res) => {
    try {
        const user = req.user;
        console.log("Connection request sending...")
        res.send(user.firstName + ' sent connection request successfully')
    }
    catch (err) {
        res.status(400).send('Error : ' + err.message)
    }
})

module.exports = router;