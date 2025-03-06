import TelegramBot from "node-telegram-bot-api";
import "dotenv/config";
import { signinHelper } from "./authServices.js";
// import { login, logout, start } from "./commands.js";

const { BOT_TOKEN } = process.env;

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const users = {};
const userStates = {};

bot.setMyCommands([
  { command: "/start", description: "Запуск бота" },
  { command: "/login", description: "Авторизация" },
  { command: "/logout", description: "Выход" },
]);

console.log("🤖 Telegram Bot launched!");
console.log("userStates: ", userStates);
export const startBot = () => {
  // let state = true;
  // const updateCommands = async (chatId, state) => {
  //   if (state === "start") {
  //     await bot.setMyCommands([{ command: "start", description: "Начать" }]);
  //   } else if (state === "login") {
  //     await bot.setMyCommands([{ command: "login", description: "Войти" }]);
  //   } else if (state === "logout") {
  //     await bot.setMyCommands([{ command: "logout", description: "Выйти" }]);
  //   }
  // };
  // const updateCommands = async (chatId, state) => {
  //   let commands = [];

  //   if (state === "start") {
  //     commands = [{ command: "start", description: "Начать" }];
  //   } else if (state === "login") {
  //     commands = [{ command: "login", description: "Войти" }];
  //   } else if (state === "logout") {
  //     commands = [{ command: "logout", description: "Выйти" }];
  //   }

  //   await bot.setMyCommands(commands, {
  //     scope: { type: "chat", chat_id: chatId },
  //   });
  // };

  // const sendKeyboard = (chatId, state) => {
  //   let keyboard;
  //   if (state === "start") {
  //     keyboard = { keyboard: [[{ text: "/start" }]], resize_keyboard: true };
  //   } else if (state === "login") {
  //     keyboard = { keyboard: [[{ text: "/login" }]], resize_keyboard: true };
  //   } else if (state === "logout") {
  //     keyboard = { keyboard: [[{ text: "/logout" }]], resize_keyboard: true };
  //   }

  //   bot.sendMessage(chatId, "Выберите действие:", { reply_markup: keyboard });
  // };

  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    if (userStates[chatId] !== "start") return;
    console.log("userStates[chatId]: ", userStates[chatId]);
    userStates[chatId] = "login";
    // await updateCommands(chatId, "login");
    // sendKeyboard(chatId, "login");
    bot.sendMessage(chatId, "Добро пожаловать! Теперь введите /login");
    return;
    // }
  });
  // mode = "login";
  // mode === "start"
  //   ? await bot.setMyCommands(start)
  //   : await bot.setMyCommands(login);
  // await bot.sendMessage(
  //   chatId,
  //   "Нажмите 'Start', чтобы продолжить",
  //   startKeyboard
  // );

  // console.log("mode: ", mode);
  // });

  //User's email request
  bot.onText(/\/login/, async (msg) => {
    const chatId = msg.chat.id;
    if (userStates[chatId] !== "login") return;
    userStates[chatId] = "logout";
    // await updateCommands(chatId, "logout");
    // sendKeyboard(chatId, "logout");
    bot.sendMessage(chatId, "Enter your email:");
    users[chatId] = { step: "email" };
    console.log("users: ", users);
    console.log("users[chatId]: ", users[chatId]);
  });

  bot.onText(/\/logout/, async (msg) => {
    const chatId = msg.chat.id;
    if (userStates[chatId] !== "logout") return;

    userStates[chatId] = "start"; // Сбрасываем состояние
    // await updateCommands(chatId, "start");
    // sendKeyboard(chatId, "start");
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
    console.log("chatId: ", chatId);

    if (users[chatId]) {
      if (users[chatId].step === "email") {
        users[chatId].email = text;
        users[chatId].step = "password";
        bot.sendMessage(chatId, "Now Enter your password:");
        console.log("users[chatId]: ", users[chatId]);
      } else if (users[chatId].step === "password") {
        users[chatId].password = text;
        users[chatId].step = null;
        console.log("users[chatId]: ", users[chatId]);

        try {
          console.log("Calling signinHelper from bot...");
          const result = await signinHelper(
            users[chatId].email,
            users[chatId].password
          );
          console.log("📨 Result from signinHelper:", result);
          if (result?.tokens) {
            bot.sendMessage(chatId, "✅ User logged in successfully!");
            console.log("You logged in successfully:", result);
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
