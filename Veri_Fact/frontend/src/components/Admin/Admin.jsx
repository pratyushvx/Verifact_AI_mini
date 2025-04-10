import { useState } from "react";
import axios from "axios";
import "./Admin.css";

const Admin = () => {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [retrainMessage, setRetrainMessage] = useState("");
  const [retrainDetails, setRetrainDetails] = useState("");

  const handleSubmit = () => {
    if (password === "verifact_admin") {
      setAuthenticated(true);
    } else {
      alert("❌ Incorrect password");
    }
  };

  const handleRetrain = async () => {
    try {
      const response = await axios.post("http://localhost:5000/retrain", {
        data: []
      });
      setRetrainMessage(response.data.message);
      setRetrainDetails(response.data.details || "");
    } catch (err) {
      console.error("❌ Error retraining model:", err);
      setRetrainMessage("❌ Error retraining model");
      setRetrainDetails("");
    }
  };

  return (
    <div className="admin-container">
      {!authenticated ? (
        <div className="admin-box">
          <h2>Admin Login</h2>
          <p className="admin-userid">User ID: VeriFact_admin</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
          />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      ) : (
        <div className="admin-box">
          <h2>Welcome Admin 👨‍💻</h2>
          <p className="admin-userid">User ID: VeriFact_admin</p>
          <button onClick={handleRetrain}>Retrain Model</button>
          {retrainMessage && <p className="admin-message">{retrainMessage}</p>}
          {retrainDetails && (
            <pre className="admin-details">
              {retrainDetails}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
