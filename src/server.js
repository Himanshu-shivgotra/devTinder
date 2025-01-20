// Server configuration
const express = require('express');
const { connectDB } = require('./config/database');
const app = express();
const User = require('./models/user')
const { validateUserData } = require('./utils/validation')
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth')

app.use(express.json())
app.use(cookieParser())

// User signup route
app.post("/signup", async (req, res) => {
    try {
        //validation of data
        validateUserData(req)

        const { firstName, lastName, emailId, password } = req.body;

        //Encrypt the password
        const hassedPassword = await bcrypt.hash(password, 10)


        //creating a new instance of user data
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hassedPassword,
        })
        await user.save()
        res.send("User added Successfully")
    }
    catch (err) {
        res.status(400).send('Error : ' + err.message)
    }
})

app.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error('Invalid credentials')
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {

            const token = await jwt.sign({ _id: user._id }, "Himanshu@devtinder555")

            res.cookie('token', token)
            res.send('Login successful!!!')
        } else {
            throw new Error('Invalid credentials')
        }

    }
    catch (err) {
        res.status(400).send('Error : ' + err.message)
    }
})

app.get('/profile', userAuth, async (req, res) => {

    try {
        const user = req.user;
        res.send(user)
    }
    catch (err) {
        res.status(400).send('Error : ' + err.message)
    }
})

// Get user by email route
app.get('/user', async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        const users = await User.find({ emailId: userEmail })
        if (users.length === 0) {
            res.status(404).send('User not found')
        }
        else {
            res.send(users)
        }
    } catch (err) {
        res.status(400).send('Something went wrong')
    }
})

// Delete user route
app.delete('/user', async (req, res) => {
    const userId = req.body.userId;
    try {
        const users = await User.findByIdAndDelete(userId)
        if (!users) {
            res.status(404).send('User not found')
        }
        else {
            res.send(" User deleted successfully")
        }
    } catch (err) {
        res.status(400).send('Something went wrong')
    }
})

// Get user by ID route
app.get('/userById', async (req, res) => {
    const userId = req.body.userId;
    try {

        const users = await User.findById(userId)
        res.send(users)
    }
    catch (err) {
        res.status(400).send('Something went wrong');
    }
})

// Get all users route
app.get('/allUsers', async (req, res) => {
    try {
        const users = await User.find({})
        if (!users) {
            res.status(404).send('User not found')
        }
        else {
            res.send(users)
        }
    }
    catch (err) {
        res.status(400).send('Something went wrong')
    }
})

// update the user
app.patch('/user/:userId', async (req, res) => {
    const userId = req.params.userId
    const data = req.body
    try {
        const allowedUpdates = ["userId", "age", "gender", "photoUrl", "about", "skills"];
        const isUpdateAllowed = Object.keys(data).every((k) => allowedUpdates.includes(k))
        if (!isUpdateAllowed) {
            throw new Error("Update user not allowed")
        }
        if (data?.skills.length > 10) {
            throw new Error("Skills cannot be more than 10")
        }
        await User.findByIdAndUpdate({ _id: userId }, data, { runValidators: true })
        // await User.findByIdAndUpdate({ userId }, data)
        res.send("User updated successfully")
    } catch (err) {
        res.status(400).send('Something went wrong :' + err.message)
    }
})

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

