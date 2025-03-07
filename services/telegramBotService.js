import TelegramBot from "node-telegram-bot-api";
import "dotenv/config";
import { signinHelper } from "./authServices.js";
import { commands } from "./commands.js";

const { BOT_TOKEN } = process.env;

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const users = {};
const userStates = {};

async function updateUserCommands(chatId, command) {
  let commands = [];

  switch (command) {
    case "start":
      commands = [{ command: "/start", description: "Запуск бота" }];
      break;
    case "login":
      commands = [{ command: "/login", description: "Авторизация" }];
      break;
    case "logout":
      commands = [{ command: "/logout", description: "Выход" }];
      break;
    default:
      commands = [{ command: "/start", description: "Запуск бота" }];
  }

  await bot.setMyCommands(commands, {
    scope: { type: "chat", chat_id: chatId },
  });
}

console.log("🤖 Telegram Bot launched!");

export const startBot = () => {
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    if (userStates[chatId] !== "start") return;
    // console.log("userStates[chatId]: ", userStates[chatId]);
    userStates[chatId] = "login";
    await updateUserCommands(chatId, userStates[chatId]);
    bot.sendMessage(chatId, "Добро пожаловать! Теперь введите /login");
    return;
  });

  bot.onText(/\/login/, async (msg) => {
    const chatId = msg.chat.id;
    if (userStates[chatId] !== "login") return;
    userStates[chatId] = "logout";
    // console.log("userStates[chatId]: ", userStates[chatId]);
    await updateUserCommands(chatId, userStates[chatId]);
    bot.sendMessage(chatId, "Enter your email:");
    users[chatId] = { step: "email" };
    // console.log("users: ", users);
    // console.log("users[chatId]: ", users[chatId]);
  });

  bot.onText(/\/logout/, async (msg) => {
    const chatId = msg.chat.id;
    if (userStates[chatId] !== "logout") return;
    userStates[chatId] = "start";
    // console.log("userStates[chatId]: ", userStates[chatId]);
    await updateUserCommands(chatId, userStates[chatId]);
    bot.sendMessage(chatId, "Вы вышли. Теперь можете только начать заново.");
    return;
  });

  bot.on("polling_error", console.log);
  // Processing messages (email -> password -> JWT)
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (!userStates[chatId]) {
      userStates[chatId] = "start";
    }
    // console.log("userStates[chatId]: ", userStates[chatId]);
    // console.log("chatId: ", chatId);
    // console.log("userStates[chatId]: ", userStates[chatId]);
    if (users[chatId]) {
      if (users[chatId].step === "email") {
        users[chatId].email = text;
        users[chatId].step = "password";
        bot.sendMessage(chatId, "Now Enter your password:");
        // console.log("users[chatId]: ", users[chatId]);
      } else if (users[chatId].step === "password") {
        users[chatId].password = text;
        users[chatId].step = null;
        // console.log("users[chatId]: ", users[chatId]);

        try {
          // console.log("Calling signinHelper from bot...");
          const result = await signinHelper(
            users[chatId].email,
            users[chatId].password
          );
          // console.log("📨 Result from signinHelper:", result);
          if (result?.tokens) {
            bot.sendMessage(chatId, "✅ User logged in successfully!");
            // console.log("You logged in successfully:", result);
            return;
          } else {
            bot.sendMessage(
              chatId,
              `❌ Error: ${result?.error || "Unknown error"}`
            );
          }
        } catch (error) {
          console.error("🔥 Authorization error:", error);
          bot.sendMessage(chatId, "❌ Server error. Try later.");
        }
        delete users[chatId];
      }
    }
  });
};
