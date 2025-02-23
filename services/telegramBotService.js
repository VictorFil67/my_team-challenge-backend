import TelegramBot from "node-telegram-bot-api";
import "dotenv/config";

const { BOT_TOKEN } = process.env;

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const users = {};

console.log("🤖 Telegram Bot launched!");

export const startBot = () => {
  //User's email request
  bot.onText(/\/login/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Enter your email:");
    users[chatId] = { step: "email" };
  });

  // Processing messages (email -> password -> JWT)
  bot.on("message", async (msg) => {
    console.log("msg: ", msg);
  });
};
