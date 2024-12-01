import express from "express";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
// import { createServer } from "node:http";
// import swaggerDocument from "./docs/swagger.json" assert { type: "json" };
// import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";
// import complexRouter from "./routes/complexRouter.js";
// import * as chatControllers from "./controllers/chatControllers.js";
// import notificationsRouter from "./routes/notificationsRouter.js";
// import votingsRouter from "./routes/votingsRouter.js";

dotenv.config();

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use(express.static("upload/images"));

app.use("/auth", authRouter);
// app.use("/notifications", notificationsRouter);
// app.use("/api/contacts", contactsRouter);
// app.use("/api", complexRouter);
// app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.use("/chat", chatRouter);
// app.use("/votings", votingsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

const { DB_HOST, PORT = 3000 } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Database connection successful");

    app.listen(PORT, () => {
      console.log(`Server is running. Use our API on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
