const express = require('express');
const { connectDB } = require('./config/database');
const app = express();
const User = require('./models/user')

app.use(express.json())

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


connectDB().then(() => {
    console.log('Database connected.. !!')
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    })
})
    .catch((err) => {
        console.error('Error in connecting database !!')
    })

