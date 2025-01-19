const express = require('express');

const app = express();

app.get("/", (req, res) => {
    res.send('Namaste from the Dashboard');
})

app.get("/test", (req, res) => {
    res.send('Hello from the Server');
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})