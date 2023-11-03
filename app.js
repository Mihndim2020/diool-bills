require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const router = require('./router/routes');

const PORT = process.env.PORT || 3000;

const app = express();

app.use((req, res, next) => {
    res.set({
        'Content-Type': 'text/xml',
      })
    next();
});

app.use("/", router)

app.listen(PORT, () => {
    console.log(`The server is listening on Port: ${PORT}`);
});