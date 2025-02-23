// import TelegramBot from "node-telegram-bot-api";
// import "dotenv/config";

// const { BOT_TOKEN } = process.env;

export const sendErrorMessage = (chatId, message) => {
  bot.sendMessage(chatId, `❌ Ошибка: ${message}`);
};
//   const bot = new TelegramBot(BOT_TOKEN, { polling: true });
