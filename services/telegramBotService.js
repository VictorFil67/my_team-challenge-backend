import TelegramBot from "node-telegram-bot-api";
import "dotenv/config";
import authControllers from "../controllers/authControllers.js";
import { signinHelper } from "./authServices.js";

const { BOT_TOKEN } = process.env;
const { signin } = authControllers;

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const users = {};

console.log("🤖 Telegram Bot launched!");

export const startBot = () => {
  //User's email request
  bot.onText(/\/login/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Enter your email:");
    users[chatId] = { step: "email" };
    console.log("users: ", users);
    console.log("users[chatId]: ", users[chatId]);
  });

  // Processing messages (email -> password -> JWT)
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
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

        // try {
        // Create a request object as if it came to Express
        const req = {
          body: {
            email: users[chatId].email,
            password: users[chatId].password,
          },
        };
        // Create a response object that returns a JWT
        // const res = {
        //   json: async (data) => {
        //     if (data) {
        //       // Сохраняем chatId менеджера или клиента
        //       // await User.findOneAndUpdate(
        //       //   { email: users[chatId].email },
        //       //   { chatId },
        //       //   { new: true }
        //       // );
        //       console.log("data: ", data);
        //       bot.sendMessage(chatId, "✅ Successful authorization!");
        //     } else {
        //       sendErrorMessage(
        //         chatId,
        //         `❌ Error: ${data.message || "Unknown error"}`
        //       );
        //     }
        //   },
        //   status: (code) => ({
        //     json: (data) =>
        //       sendErrorMessage(
        //         chatId,
        //         `❌ Error: ${code}, ${data.message || "Something went wrong"}`
        //       ),
        //   }),
        // };
        try {
          //   const result = await new Promise((resolve, reject) => {
          //     signin(req, res);
          //   });
          console.log("Calling signin from bot...");
          const result = await signinHelper(
            users[chatId].email,
            users[chatId].password
          );
          if (result) {
            // Processing result, if it exists
            console.log("User logged in successfully:", result);
          } else {
            sendErrorMessage(chatId, "Unknown error in result");
          }
          console.log("result: ", result);
        } catch (error) {
          sendErrorMessage(
            chatId,
            `❌ Error: ${error.message || "Unknown server error"}`
          );
        }
        // } catch (error) {
        //   console.error("Ошибка авторизации:", error);
        //   bot.sendMessage(chatId, "❌ Ошибка сервера. Попробуйте позже.");
        // }
        delete users[chatId];
      }
    }
  });
  const sendErrorMessage = (chatId, message) => {
    bot.sendMessage(chatId, message);
  };
};
