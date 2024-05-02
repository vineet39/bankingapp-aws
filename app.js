import express from "express";
import mongoose from "mongoose";
import { getUsers, login, getUser,createUser } from "./dal/userDAL.js";
import { deposit, withdraw } from "./dal/accountDAL.js";
import User from "./models/User.js";
import cors from "cors";
import dotenv from "dotenv";
import { authenticateToken } from "./authMiddleware.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
const dbURI = process.env.DB_URI;

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to db");
    // seedData();
  })
  .catch((err) => console.log(err));

const seedData = async () => {
  const users = [
    {
      email: "john.doe@example.com",
      name: "johndoe",
      password: "password123",
      accountNumber: "1234567890",
      balance: 1000,
    },
    {
      email: "jane.doe@example.com",
      name: "janedoe",
      password: "password456",
      accountNumber: "0987654321",
      balance: 1500,
    },
  ];

  try {
    await User.deleteMany();
    await User.insertMany(users);
    console.log("Data seeded successfully!");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding data:", error);
    mongoose.disconnect();
  }
};

app.get("/users", authenticateToken, async (req, res) => {
  try {
    const data = await getUsers();
    const { message, users, error, status } = data;
    res.status(status).json({ message, data: users, error });
  } catch (error) {
    res.status(500).json({ message: null, data: null, error });
  }
});

app.get("/user", authenticateToken, async (req, res) => {
  try {
    const { accountNumber } = req.accountNumber;
    const data = await getUser(accountNumber);
    const { message, user, error, status } = data;
    res.status(status).json({ message, user, error });
  } catch (error) {
    res.status(500).json({ message: null, user: null, error });
  }
});

app.post("/createUser", async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const data = await createUser(email, name, password);
    const { message, user, error, status } = data;
    res.status(status).json({ message, user, error });
  } catch (error) {
    res.status(500).json({ message: null, user: null, error });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await login(email, password);
    const { message, token, error, status } = data;

    res.status(status).json({ data: token, message, error });
  } catch (error) {
    res.status(500).json({ data: null, message: null, error });
  }
});

app.post("/deposit", authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;
    const { accountNumber } = req.accountNumber;
    const data = await deposit(accountNumber, amount);
    const { message, user, error, status } = data;
    res.status(status).json({
      data: user,
      message,
      error,
    });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message, error: error });
  }
});

app.post("/withdraw", authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;
    const { accountNumber } = req.accountNumber;
    const data = await withdraw(accountNumber, amount);
    const { message, user, error, status } = data;
    res.status(status).json({
      data: user,
      message,
      error,
    });
  } catch (error) {
    res.status(500).json({ data: null, message: error.message, error: error });
  }
});

app.listen(process.env.PORT, () => console.log("Server running on port 5000"));
