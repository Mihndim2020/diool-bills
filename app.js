require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const router = require('./router/routes');

const PORT = process.env.PORT || 8080;

const app = express();

app.use(bodyParser.json());

app.use("/", router)

app.listen(PORT, () => {
    console.log(`The server is listening on Port: ${PORT}`);
});