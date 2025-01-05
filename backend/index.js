const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/dasboard.route")
require('dotenv').config();
const cors = require("cors");


const app = express();

app.use(express.json())
app.use(cors({
    origin: "*",
    credentials: true
}))

app.use(userRoute)


app.listen(5000, async() => {
    try {
        console.log("Server running on port 5000")
        await mongoose.connect(process.env.DB_CONNECTION_URI);
    } catch (error) {
        console.log(`This is a server connection error ${error}`)
    }
})