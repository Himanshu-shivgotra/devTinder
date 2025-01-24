const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://himanshushivgotra:Shivhimanshu@himanshu.wuu5a.mongodb.net/")
}

module.exports = { connectDB }
