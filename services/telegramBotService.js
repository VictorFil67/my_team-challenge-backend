import TelegramBot from "node-telegram-bot-api";
import "dotenv/config";
import { signinHelper } from "./authServices.js";
// import { commands } from "./commands.js";
import { findUser, findUsers, updateUser } from "./userServices.js";
// import e from "express";
import { addUserAddresByBot } from "../botrequests/userRequests.js";

const { BOT_TOKEN } = process.env;

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const users = {};
const userStates = {};

async function updateUserCommands(chatId, command = "start") {
  let commands = [];

  switch (command) {
    case "start":
      commands = [{ command: "/start", description: "Launching the bot" }];
      break;
    case "login":
      commands = [{ command: "/login", description: "Authorization" }];
      break;
    case "logout":
      commands = [{ command: "/logout", description: "Exit" }];
      break;
    default:
      commands = [{ command: "/start", description: "Launching the bot" }];
  }

  await bot.setMyCommands(commands, {
    scope: { type: "chat", chat_id: chatId },
  });
}

console.log("🤖 Telegram Bot launched!");

export const startBot = () => {
  let userId = "";
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    if (userStates[chatId] !== "start") return;
    userStates[chatId] = "login";
    await updateUserCommands(chatId, userStates[chatId]);
    bot.sendMessage(chatId, "Welcome! Now enter /login");
    return;
  });

  bot.onText(/\/login/, async (msg) => {
    const chatId = msg.chat.id;
    if (userStates[chatId] !== "login") return;
    userStates[chatId] = "logout";
    await updateUserCommands(chatId, userStates[chatId]);
    bot.sendMessage(chatId, "Enter your email:");
    users[chatId] = { step: "email" };
  });

  bot.onText(/\/logout/, async (msg) => {
    const chatId = msg.chat.id;
    if (userStates[chatId] !== "logout") return;
    userStates[chatId] = "start";
    await updateUserCommands(chatId, userStates[chatId]);
    bot.sendMessage(chatId, "Confirm log out, please", {
      reply_markup: {
        keyboard: [[{ text: "✅ Confirm" }, { text: "❌ Cancel" }]],
        resize_keyboard: true,
      },
    });
    users[chatId].step = "logout";
    console.log("users[chatId].step: ", users[chatId].step);
  });

  bot.on("polling_error", console.log);
  // Processing messages (email -> password -> JWT)
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if (!userStates[chatId]) {
      userStates[chatId] = "start";
    }

    if (users[chatId]) {
      if (users[chatId].step === "email") {
        users[chatId].email = text;
        users[chatId].step = "password";
        bot.sendMessage(chatId, "Now Enter your password:");
      } else if (users[chatId].step === "password") {
        users[chatId].password = text;
        users[chatId].step = null;

        try {
          const result = await signinHelper(
            users[chatId].email,
            users[chatId].password
          );
          if (result?.tokens) {
            userId = result._id;
            console.log("result.tokens: ", result.tokens);
            const user = await updateUser(
              userId,
              { botChatId: chatId },
              { projection: { password: 0 } }
            );
            console.log("user: ", user);
            await bot.sendMessage(chatId, "✅ User logged in successfully!");
            // console.log("You logged in successfully:", result);
            // return;
          } else {
            bot.sendMessage(
              chatId,
              `❌ Error: ${result?.error || "Unknown error"}`
            );
            // userStates[chatId] = "start";
          }
        } catch (error) {
          console.error("🔥 Authorization error:", error);
          bot.sendMessage(chatId, "❌ Server error. Try later.");
          // userStates[chatId] = "start";
        }
        delete users[chatId].step;
      } else if (users[chatId].step === "logout") {
        if (text == "❌ Cancel") {
          bot.sendMessage(chatId, "You canceled log out", {
            reply_markup: {
              remove_keyboard: true,
            },
          });

          delete users[chatId].step;
        } else if (text == "✅ Confirm") {
          try {
            const user = await updateUser(
              userId,
              { $unset: { botChatId: "" } },
              { projection: { password: 0 } }
            );
            console.log("user: ", user);
            bot.sendMessage(chatId, "You confirmed log out", {
              reply_markup: {
                remove_keyboard: true,
              },
            });
            delete users[chatId];
          } catch (error) {
            console.log(error);
            bot.sendMessage(chatId, "❌ Log out error.");
          }
        }
      } else if (users[chatId].step === "residential_complex") {
        users[chatId].residential_complex = text;
        users[chatId].step = "building";
        bot.sendMessage(chatId, "Enter your building:");
      } else if (users[chatId].step === "building") {
        users[chatId].building = text;
        users[chatId].step = "entrance";
        bot.sendMessage(chatId, "Enter your entrance:");
      } else if (users[chatId].step === "entrance") {
        users[chatId].entrance = text;
        users[chatId].step = "apartment";
        bot.sendMessage(chatId, "Enter your apartment:");
      }
    }
  });
};

export async function sendComplexes(data) {
  // const user = await findUser({ botChatId: { $exists: true } });
  const users = await findUsers({ botChatId: { $exists: true } });
  const userBotChatIds = users.map((user) => user.botChatId);
  console.log("userBotChatIds: ", userBotChatIds);
  const botData = data.map((elem) => elem.name).join("\n");
  console.log("botData: ", botData);
  const message = `🏢 List of complexes:\n${botData}`;
  if (users) {
    for (const user of users) {
      if (user.botChatId) {
        bot.sendMessage(user.botChatId, message);
      }
    }
  }
}

bot.onText(/\/getprofile/, async (msg) => {
  const chatId = msg.chat.id;
  const { name, email, phone } = await findUser({ botChatId: chatId });
  // const userStr = JSON.stringify(user);
  console.log("name,email,phone,avatar: ", name, email, phone);

  bot.sendMessage(chatId, `😟 User:\n${name}\n${email}\n${phone}`);
});

bot.onText(/\/addAddress/, async (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Enter your residential complex:");
  users[chatId] = { step: "residential_complex" };
});
