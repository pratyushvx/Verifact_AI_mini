const express = require("express");
const router = express.Router();
const News = require("../models/News");

// Store analyzed news
router.post("/check", async (req, res) => {
    try {
        console.log("📩 Received request to store news...");

        const { news, prediction } = req.body;

        if (!news || typeof news !== "string" || news.trim() === "") {
            return res.status(400).json({ error: "News content is required" });
        }

        if (!["Real", "Fake"].includes(prediction)) {
            return res.status(400).json({ error: "Prediction must be 'Real' or 'Fake'" });
        }

        const newNews = new News({ news, prediction });
        const savedNews = await newNews.save();

        console.log("✅ News successfully stored:", savedNews);
        res.status(201).json(savedNews);
    } catch (error) {
        console.error("❌ Error saving news:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Fixed: Return { news: [...] }
router.get("/all", async (req, res) => {
    try {
        console.log("📡 Fetching all news from MongoDB...");
        const newsList = await News.find();
        console.log(`✅ Found ${newsList.length} news items.`);
        res.json({ news: newsList });
    } catch (error) {
        console.error("❌ Error fetching news:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Store feedback
router.put("/feedback/:id", async (req, res) => {
    try {
        const { feedback } = req.body;

        if (!feedback || typeof feedback !== "string" || feedback.trim() === "") {
            return res.status(400).json({ error: "Feedback must be a valid string" });
        }

        const updatedNews = await News.findByIdAndUpdate(
            req.params.id,
            { feedback },
            { new: true }
        );

        if (!updatedNews) {
            return res.status(404).json({ error: "News not found" });
        }

        console.log("✅ Feedback updated:", updatedNews);
        res.json(updatedNews);
    } catch (error) {
        console.error("❌ Error updating feedback:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
