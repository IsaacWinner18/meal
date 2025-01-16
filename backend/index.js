const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/dasboard.route")
const telegramBot = require("node-telegram-bot-api")

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


const token = "7933372816:AAHaz_nQBCyUqYiJiGYy4we7bRh222dglco"
const bot = new telegramBot(token, {polling: true})
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, " welcome to mealcoin coin", {
        reply_markup: {
            inline_keyboard: [
                [{text: "visit mealcoin",
                    url: "https://t.me/mealcoinbot/mealcoin"
                }]
            ]
        }
    })

})