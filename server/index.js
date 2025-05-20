require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRouter = require("./routes/authRouter");
const chatRouter = require("./routes/chatRouter");
const connectDB = require("./utils/db");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 8000;

app.use("/api/chat", chatRouter);
app.use("/api/auth", authRouter);

app.all("{*splat}", (req, res, next) => {
  res.status(404).send(`the requested path: ${req.originalUrl} not found`);
  next();
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
