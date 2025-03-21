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
 
const token = process.env.TELEGRAM_TOKEN
const bot = new telegramBot(token, {polling: true});
const webhookUrl = `${process.env.NEXT_PUBLIC_API_URL}/bot` + token;
// console.log(webhookUrl)
// bot.setWebHook(webhookUrl)

// app.post(`/bot${token}`, (req, res) => {
//     try {
//         bot.processUpdate(req.body)
//         res.sendStatus(200);
//     } catch (err) {
//         console.log("Error processing update:", err)
//         res.sendStatus(500)
//     }
// });

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const photoUrl = `https://${process.env.NEXT_PUBLIC_API_URL}/uploads/transformers-molie.jpeg`;
    console.log(photoUrl)
    bot.sendPhoto(chatId, photoUrl, { 
        caption: " Welcome to Mealcoin: The native currency of the Mealcity platform. Mealcity is a decentralized digital metropolis on TON, accessible via Telegram Web Apps, where wallets, exchanges, swapping networks, and secure messaging converge to power a vibrant ecosystem.",
        reply_markup: {
            inline_keyboard: [
                [{text: "🎁 Claim Mealcoin",
                    url: "https://t.me/mealcoinbot/mealcoin"
                }],
                [{text: "🫂 Visit Channel",
                    url: "https://t.me/mealcoinai"
                }]
            ]
        }
    })

})
