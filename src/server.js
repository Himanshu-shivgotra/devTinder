const express = require('express');
const { adminAuth, userAuth } = require('./middlewares/auth');

const app = express();

// order matter in routing


app.get('/admin/getAllData', adminAuth, (req, res,) => {
    res.send('Fetched all data !!')
})

app.get('/admin/deleteData', adminAuth, (req, res,) => {
    res.send('Data deleted')
})

app.get('/user', userAuth, (req, res,) => {
    res.send('user data send')
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})