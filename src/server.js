// Server configuration
const express = require('express');
const { connectDB } = require('./config/database');
const app = express();
const cookieParser = require('cookie-parser');

app.use(express.json())
app.use(cookieParser())

const authRouter = require('./routes/authRoute');
const profileRouter = require('./routes/profileRoute');
const requestRouter = require('./routes/requestRoute');

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)


// Connect to database and start server
connectDB().then(() => {
    console.log('Database connected.. !!')
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    })
})
    .catch((err) => {
        console.error('Error in connecting database !!')
    })

