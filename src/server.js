const express = require('express');

const app = express();

// order matter in routing

app.use("/test", (req, res) => {
    res.send('Hello from the Server');
})

app.get('/user', (req, res) => {
    res.send({ firstName: "Himanshu", lastName: "Shivgotra" });
})

app.post('/user', (req, res) => {
    res.send("Data saved to the database successfully");
})

app.delete('/user', (req, res) => {
    res.send("Data deleted from the database successfully");
})


app.listen(3000, () => {
    console.log('Server is running on port 3000');
})