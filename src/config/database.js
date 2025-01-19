const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://himanshushivgotra:shivhimanshu@himanshu.wuu5a.mongodb.net/devTinder")
}

module.exports = { connectDB }
