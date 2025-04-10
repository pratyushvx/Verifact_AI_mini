import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Check1.css";
import image1 from "../../Assets/image1.png";

//const API_KEY = "AIzaSyCkD84aUtuxd1GKNqEcirwVgAnNd3J7LhE";
const API_KEY = "AIzaSyBTfEvEdWPuCG0g7tTbViaHk-ITzQLArxU";
//const API_KEY = "AIzaSyA2pGqYHT-wMWDQ-5ZWlyd99Vzwhkwhoe8";


const CheckNews = () => {
  const [newsText, setNewsText] = useState("");
  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setConfidence(null);

    console.log("Fetching from Gemini API...");

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Analyze the following news article and classify it as either "Real" or "Fake". Also, provide a confidence score between 0-100% for your prediction. 
                  
                  Format your response exactly as:
                  Prediction: [Real/Fake] 
                  Confidence: [XX]% 
                  
                  News Article: "${newsText}"`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.3, // Lower randomness for more consistent results
            top_p: 0.8,
            top_k: 40,
            max_output_tokens: 100
          }
        }
      );

      console.log("Response received from Gemini API:", response.data);

      const reply =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Error analyzing news";

      // Extracting Prediction and Confidence Score
      const predictionMatch = reply.match(/Prediction:\s*(Real|Fake)/i);
      const confidenceMatch = reply.match(/Confidence:\s*(\d+)%/i);

      const prediction = predictionMatch ? predictionMatch[1] : "Uncertain";
      const confidenceScore = confidenceMatch ? confidenceMatch[1] : "Unknown";

      setResult(prediction);
      setConfidence(confidenceScore);
    } catch (error) {
      console.error("Error fetching from API:", error);
      setResult("Error checking news");
      setConfidence(null);
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
        <button type="submit" className="submit-btn" disabled={loading || newsText.trim() === ""}>
          {loading ? "Analyzing...." : "Check News"}
        </button>
      </form>

      {result && (
        <div className={`result ${result === "Fake" ? "fake" : result === "Real" ? "real" : "uncertain"}`}>
          {result === "Fake"
            ? `⚠️ Likely Fake News (Confidence: ${confidence}%)`
            : result === "Real"
            ? `✅ Trustworthy News (Confidence: ${confidence}%)`
            : "❓ Uncertain - Verify Manually"}
        </div>
      )}

      {result && (
        <button className="feedback-btn" onClick={() => navigate("/feedback")}>
          Give Feedback
        </button>
      )}
    </div>
  );
};

export default CheckNews;
