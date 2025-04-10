import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Feedback.css"; // ✅ Reusing same CSS for consistent styling
import image1 from "../../Assets/image1.png"; // ✅ Match path if needed

const Feedback = () => {
  const [feedback, setFeedback] = useState("");
  const { newsId } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      alert("⚠️ Please enter feedback before submitting!");
      return;
    }

    try {
      console.log(`📡 Sending feedback for news ID: ${newsId}`);
      await axios.put(`http://localhost:5001/api/news/feedback/${newsId}`, { feedback });
      console.log("✅ Feedback submitted!");
      navigate("/");
    } catch (error) {
      console.error("❌ Error submitting feedback:", error);
    }
  };

  return (
    <div className="check-container">
      <img src={image1} alt="Feedback" className="news-logo" />
      <h2>Give Your Feedback</h2>
      <textarea
        className="news-input"
        placeholder="Share your feedback about the news article..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        required
      />
      <button
        className="submit-btn"
        onClick={handleSubmit}
        disabled={feedback.trim() === ""}
      >
        Submit Feedback
      </button>
    </div>
  );
};

export default Feedback;
