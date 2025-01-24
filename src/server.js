// Server configuration
const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./config/database');
const app = express();

const cookieParser = require('cookie-parser');
const cors = require('cors');

dotenv.config();
connectDB()

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

const authRouter = require('./routes/authRoute');
const profileRouter = require('./routes/profileRoute');
const requestRouter = require('./routes/requestRoute');
const userRouter = require('./routes/userRoute');

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)

app.listen(process.env.PORT, () => console.log('Server is running on port 3000'));

