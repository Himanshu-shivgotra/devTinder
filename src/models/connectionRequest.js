const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        status: {
            type: String,
            required: true,
            lowercase: true,
            enum: {
                values: ["ignored", "interested", "accepeted", "rejected"],
                message: `{VALUE} is incorrect status type`
            },
        },
    },
    { timestamps: true, }
);

connectionRequestSchema.pre('save', function (next) {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error('Cannot send connection request to yourself');
    }
    next();
})

//compound index ( is to make query work very fast)
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 })

const ConnectionRequestModel = new mongoose.model("connectionRequestS", connectionRequestSchema);

module.exports = ConnectionRequestModel;