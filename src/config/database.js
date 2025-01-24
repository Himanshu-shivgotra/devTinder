const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("MongoDB connection established")
    }
    catch (err) {
        console.log("Database failed to connect")
    }
}

module.exports = { connectDB }
