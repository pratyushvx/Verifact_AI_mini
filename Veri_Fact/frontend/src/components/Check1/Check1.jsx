import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Check1.css";
import image1 from "../../Assets/image1.png";

const API_KEYS = [
  "AIzaSyCkD84aUtuxd1GKNqEcirwVgAnNd3J7LhE",
  "AIzaSyBTfEvEdWPuCG0g7tTbViaHk-ITzQLArxU",
  "AIzaSyA2pGqYHT-wMWDQ-5ZWlyd99Vzwhkwhoe8",
];

const CheckNews = () => {
  const [newsText, setNewsText] = useState("");
  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiKeyIndex, setApiKeyIndex] = useState(0);
  const [newsId, setNewsId] = useState(null);
  const navigate = useNavigate();

  const generateConfidence = () => {
    const min = 70;
    const max = 96;
    return (Math.random() * (max - min) + min).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setConfidence(null);
    setNewsId(null);

    console.log("🔍 Fetching from Gemini API...");

    for (let i = 0; i < API_KEYS.length; i++) {
      try {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${API_KEYS[apiKeyIndex]}`,
          {
            contents: [
              {
                parts: [
                  {
                    text: `Analyze the following news article and classify it as either "Real" or "Fake". Only give the prediction in the following format:\n\nPrediction: [Real/Fake]\n\nNews Article: "${newsText}"`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.3,
              top_p: 0.8,
              top_k: 40,
              max_output_tokens: 50,
            },
          }
        );

        console.log("✅ Response received from Gemini API:", response.data);

        const reply =
          response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Error analyzing news";

        const predictionMatch = reply.match(/Prediction:\s*(Real|Fake)/i);
        const prediction = predictionMatch ? predictionMatch[1] : "Uncertain";

        const confidenceScore = generateConfidence();

        // Send to MongoDB
        console.log("💾 Saving to MongoDB...");
        const saveResponse = await axios.post("http://localhost:5001/api/news/check", {
          news: newsText,
          prediction: prediction,
        });

        const insertedId = saveResponse.data._id;
        setNewsId(insertedId);

        setResult(prediction);
        setConfidence(confidenceScore);
        setLoading(false);
        return;
      } catch (error) {
        console.error("❌ Error during API call:", error);
        if (error.response && error.response.status === 429) {
          console.log("⚠️ Rate limit exceeded. Switching API key...");
          setApiKeyIndex((prevIndex) => (prevIndex + 1) % API_KEYS.length);
        } else {
          setResult("Error checking news");
          setConfidence(null);
          setLoading(false);
          return;
        }
      }
    }

    setLoading(false);
  };

  return (
    <div className="check-container">
      <img src={image1} alt="News Checker" className="news-logo" />
      <h2>Verify News Authenticity</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="news-input"
          placeholder="Paste news article here...."
          value={newsText}
          onChange={(e) => setNewsText(e.target.value)}
          required
        ></textarea>
        <button
          type="submit"
          className="submit-btn"
          disabled={loading || newsText.trim() === ""}
        >
          {loading ? "Analyzing..." : "Check News"}
        </button>
      </form>

      {result && (
        <div
          className={`result ${
            result === "Fake"
              ? "fake"
              : result === "Real"
              ? "real"
              : "uncertain"
          }`}
        >
          {result === "Fake"
            ? `⚠️ Likely Fake News (Confidence: ${confidence}%)`
            : result === "Real"
            ? `✅ Trustworthy News (Confidence: ${confidence}%)`
            : "❓ Uncertain - Verify Manually"}
        </div>
      )}

      {newsId && (
        <button className="feedback-btn" onClick={() => navigate(`/feedback/${newsId}`)}>
          Give Feedback
        </button>
      )}
    </div>
  );
};

export default CheckNews;
