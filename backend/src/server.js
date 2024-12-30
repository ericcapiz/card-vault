const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const uploadRoutes = require("./routes/upload");
const collectionRoutes = require("./routes/collectionRoutes");
const authRoutes = require("./routes/authRoutes");
const batchRoutes = require("./routes/batchRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Middleware
app.use(express.json());

// Routes
app.use("/api/upload", uploadRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/batches", batchRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is running!" });
});

// Add this near your other routes
app.get("/", (req, res) => {
  res.json({ message: "Card Vault API is running" });
});

// Connect to MongoDB
connectDB();

app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
