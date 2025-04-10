import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const ConfirmRetrain = () => {
  const location = useLocation();
  const selectedNews = location.state?.selectedNews || [];

  const [label, setLabel] = useState("Fake");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!selectedNews.length) {
      setError("No news selected.");
      return;
    }

    const payload = {
      data: selectedNews.map(item => ({
        news: item.news,
        label: label,
      })),
    };

    console.log("🧾 Payload being sent:", JSON.stringify(payload, null, 2));

    try {
      const response = await axios.post("http://localhost:5000/feedback", payload);
      console.log("✅ Feedback sent:", response.data);
      setFeedbackSent(true);
      setError(null);
    } catch (err) {
      console.error("❌ Feedback request failed:", err);
      setError("Failed to send feedback.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "30px" }}>
      <h2>📌 Confirm News Feedback</h2>

      {selectedNews.length > 0 ? (
        <div
          style={{
            border: "2px solid #ccc",
            borderRadius: "10px",
            padding: "20px",
            maxWidth: "700px",
            margin: "20px auto",
            backgroundColor: "#f9f9f9",
          }}
        >
          {selectedNews.map((item, index) => (
            <div key={index} style={{ marginBottom: "15px" }}>
              <p style={{ fontSize: "16px" }}>📰 {item.news}</p>
            </div>
          ))}

          <div style={{ marginTop: "20px" }}>
            <label style={{ fontWeight: "bold" }}>Label: </label>
            <select
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              style={{ padding: "5px", fontSize: "16px" }}
            >
              <option value="Fake">Fake</option>
              <option value="Real">Real</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Submit Feedback
          </button>

          {feedbackSent && (
            <p style={{ color: "green", marginTop: "10px" }}>
              ✅ Feedback submitted successfully!
            </p>
          )}
          {error && (
            <p style={{ color: "red", marginTop: "10px" }}>
              ❌ {error}
            </p>
          )}
        </div>
      ) : (
        <p style={{ color: "gray", marginTop: "20px" }}>⚠️ No news selected.</p>
      )}
    </div>
  );
};

export default ConfirmRetrain;
