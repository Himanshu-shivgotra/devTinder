// Server configuration
const express = require('express');
const { connectDB } = require('./config/database');
const app = express();
const User = require('./models/user')

app.use(express.json())

// User signup route
app.post("/signup", async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        res.send("User added Successfully")
    }
    catch (err) {
        res.status(400).send('Error in saving the user', err.message)
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
        console.log(userId)
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
app.patch('/user', async (req, res) => {
    const userId = req.body.userId
    const data = req.body
    try {
        await User.findByIdAndUpdate({ _id: userId }, data)
        // await User.findByIdAndUpdate({ userId }, data)
        res.send("User updated successfully")
    } catch (err) {
        res.status(400).send('Something went wrong')
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

