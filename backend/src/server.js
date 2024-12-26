const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const uploadRoutes = require("./routes/upload");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/upload", uploadRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is running!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
