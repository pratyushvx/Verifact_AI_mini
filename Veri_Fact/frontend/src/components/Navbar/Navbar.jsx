import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const [timer, setTimer] = useState(null);

  const handleCheckNewsClick = () => {
    if (clickCount === 0) {
      setClickCount(1);
      const newTimer = setTimeout(() => {
        navigate("/check-news"); // Single click redirects to Check
        setClickCount(0);
      }, 300); // 300ms delay for detecting double-click
      setTimer(newTimer);
    } else {
      clearTimeout(timer);
      navigate("/check-newss"); // Double-click redirects to Check1
      setClickCount(0);
    }
  };

  return (
    <nav className="nav">
      <div className="nav-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        VeriFact-AI
      </div>
      <ul className="nav-menu">
        <li onClick={() => navigate("/admin")} style={{ cursor: "pointer" }}>Admin- AI</li>
        <li onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Home</li>
        <li onClick={() => navigate("/trending-news")} style={{ cursor: "pointer" }}>Trending News</li>
        <li onClick={handleCheckNewsClick} style={{ cursor: "pointer" }}>Check News</li>
        <li className="nav-contact" onClick={() => navigate("/model-accuracy")} style={{ cursor: "pointer" }}>
          Model Accuracy
        </li>
        <li onClick={() => navigate("/")} style={{ cursor: "pointer" }}>      More </li>
      </ul>
    </nav>
  );
};

export default Navbar;
