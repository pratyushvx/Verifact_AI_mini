import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Check.css";
import image1 from "../../Assets/image1.png"; // ✅ make sure this path is correct

const Check = () => {
  const [newsText, setNewsText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newsId, setNewsId] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      console.log("📡 Sending news to ML model...");
      const mlResponse = await axios.post("http://localhost:5000/predict", {
        news: newsText,
      });

      const prediction = mlResponse.data.prediction;
      const rawConfidence = mlResponse.data.confidence;
      const confidence = parseFloat(rawConfidence).toFixed(2);

      console.log("✅ ML Prediction:", prediction, "Confidence:", confidence);

      console.log("📡 Saving news in MongoDB...");
      const saveResponse = await axios.post(
        "http://localhost:5001/api/news/check",
        { news: newsText, prediction }
      );

      setNewsId(saveResponse.data._id);
      setResult({ prediction, confidence });
    } catch (error) {
      console.error("❌ Error checking news:", error);
      setResult({ prediction: "Error", confidence: null });
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

      {result && result.prediction && (
        <div
          className={`result ${
            result.prediction === "Fake"
              ? "fake"
              : result.prediction === "Real"
              ? "real"
              : "uncertain"
          }`}
        >
          {result.prediction === "Fake"
            ? `⚠️ Likely Fake News (Confidence : ${result.confidence}%)`
            : result.prediction === "Real"
            ? `✅ Trustworthy News (Confidence : ${result.confidence}%)`
            : "❓ Uncertain - Try Again"}
        </div>
      )}

      {newsId && (
        <button
          className="feedback-btn"
          onClick={() => navigate(`/feedback/${newsId}`)}
        >
          Give Feedback
        </button>
      )}
    </div>
  );
};

export default Check;
