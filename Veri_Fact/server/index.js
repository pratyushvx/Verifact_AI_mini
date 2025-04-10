const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const newsRoutes = require("./routes/newsRoutes");

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URI = "mongodb://localhost:27017/fakenews";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected to fakenews"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/api/news", newsRoutes);

const PORT = 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
