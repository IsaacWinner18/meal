const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
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



// {polling: true}

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")))
 
const token = "7933372816:AAHaz_nQBCyUqYiJiGYy4we7bRh222dglco"
const bot = new telegramBot(token);

const webhookUrl = "https://meal-production.up.railway.app/bot" + token;

bot.setWebHook(webhookUrl)

app.post(`/bot${token}`, (req, res) => {
    bot.processUpdate(req.body)
    res.sendStatus(200);
});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const photoUrl = "https://meal-production.up.railway.app/uploads/transformers-molie.jpeg"
    bot.sendPhoto(chatId, photoUrl, { 
        caption: " Welcome to Mealcoin: A crypto dedicated to ending hunger worldwide.",
        reply_markup: {
            inline_keyboard: [
                [{text: "Visit Mealcoin",
                    url: "https://t.me/mealcoinbot/mealcoin"
                }]
            ]
        }
    })

})