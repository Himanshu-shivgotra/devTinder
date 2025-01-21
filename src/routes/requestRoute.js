const express = require('express');
const { userAuth } = require('../middlewares/auth')
const ConnectionRequest = require('../models/connectionRequest')
const User = require('../models/user')
const router = express.Router();

router.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid status type " + status
            });
        }

        const existingToUser = await User.findById(toUserId);
        if (!existingToUser) {
            return res.status(404).json({ message: "User not found" })
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ],
        });

        if (existingConnectionRequest) {
            return res.status(400).send({ message: "Connection request already exists" });
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId, toUserId, status,
        })

        const data = await connectionRequest.save();
        res.json({
            message: `${req.user.firstName} is ${status} in ${existingToUser.firstName}`,
            data,
        });
    }
    catch (err) {
        res.status(400).send('Error : ' + err.message)
    }
})

module.exports = router;