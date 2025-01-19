const express = require('express');

const app = express();

// order matter in routing


app.get('/user', (req, res) => {
    console.log(req.query);
    res.send({ firstName: "Himanshu", lastName: "Shivgotra" });
})

app.get('/user/:id', (req, res) => {
    console.log(req.params);
    res.send({ firstName: "Himanshu", lastName: "Shivgotra" });
})



app.listen(3000, () => {
    console.log('Server is running on port 3000');
})