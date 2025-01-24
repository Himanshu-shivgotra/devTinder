const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const USER_SAFE_DATA = "firstName lastName gender photoUrl about skills age";

const router = express.Router();

router.get('/user/requests/recieved', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", USER_SAFE_DATA)
        // }).populate("fromUserId", ["firstName", "lastName"])

        res.json({ message: "All requests fetched successfully ", data: connectionRequests })
    }
    catch (err) {
        res.status(400).json({
            message: "Error: " + err.message,
        })
    }
})


router.get('/user/connection', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA)

        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.equals(loggedInUser._id)) {
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({ data })

    } catch (err) {
        res.status(400).json("Error: " + err.message,)
    }
})

router.get('/feed', userAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page || 1)
        let limit = parseInt(req.query.limit || 10)
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * 2
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId")

        const hideUserFromFeed = new Set();
        connectionRequests.forEach((request) => {
            hideUserFromFeed.add(request.fromUserId.toString());
            hideUserFromFeed.add(request.toUserId.toString());
        })


        const feedUsers = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUserFromFeed) } },
                // { _id: { $ne: loggedInUser._id } },
            ]
        })
            .select(USER_SAFE_DATA)
            .limit(limit)
            .skip(skip)

        res.send(feedUsers)
    }
    catch (err) {
        res.status(400).json("Error: " + err.message)
    }
})


module.exports = router;