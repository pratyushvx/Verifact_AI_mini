const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    news: { type: String, required: true },
    prediction: { type: String, required: true },
    feedback: { type: String, default: null },
  },
  { timestamps: true }
);

console.log("✅ News Schema Loaded");

module.exports = mongoose.model("News", newsSchema);
