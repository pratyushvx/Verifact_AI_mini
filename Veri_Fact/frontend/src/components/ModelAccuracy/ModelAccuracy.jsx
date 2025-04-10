import React from "react";
import { useNavigate } from "react-router-dom";
import "./ModelAccuracy.css";
import accuracyImage from "../../Assets/accuracy.png";
import bert from "../../Assets/bert.png";
import credit from "../../Assets/credit.png";

const ModelAccuracy = () => {
  const navigate = useNavigate();

  return (
    <div className="model-accuracy-container">
      <h2>Model Accuracy</h2>
      <p className="description">
        Below are the insights into our model's accuracy and related technologies.
      </p>
      
      <div className="image-section">
        <div className="image-card">
          <img src={accuracyImage} alt="Model Accuracy" className="image" />
          <p><strong>Model Accuracy:</strong> Our AI model ensures high reliability in predictions.</p>
        </div>

        <div className="image-card">
          <img src={bert} alt="BERT Model" className="image" />
          <p><strong>BERT Model:</strong> A powerful NLP model for understanding human language.</p>
        </div>

        <div className="image-card">
          <img src={credit} alt="Credit Score" className="image" />
          <p><strong>Credit Score Prediction:</strong> AI assesses financial credibility.</p>
        </div>
      </div>

      <button className="back-btn" onClick={() => navigate("/")}>Go Back</button>
    </div>
  );
};

export default ModelAccuracy;
