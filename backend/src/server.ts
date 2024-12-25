import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is running!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
