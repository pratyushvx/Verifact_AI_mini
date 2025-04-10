import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Background from "./components/Background/Background";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Check from "./components/Check/Check";
import Check1 from "./components/Check1/Check1";
import Feedback from "./components/Feedback/Feedback";
import ModelAccuracy from "./components/ModelAccuracy/ModelAccuracy";
import TrendingNews from "./components/TrendingNews/TrendingNews";
import ConfirmRetrain from "./components/ConfirmRetrain/ConfirmRetrain";
import Admin from "./components/Admin/Admin"; // ✅ Import Admin

const App = () => {
  const heroData = [
    { text1: "Detect, Verify ", text2: "Expose" },
    { text1: "Indulge", text2: "your passion" },
    { text1: "Give in to", text2: "your passions" },
  ];

  const [heroCount, setHeroCount] = useState(0);
  const [playStatus, setPlayStatus] = useState(false);

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Background playStatus={playStatus} heroCount={heroCount} />
                <Hero
                  setPlayStatus={setPlayStatus}
                  heroData={heroData[heroCount]}
                  heroCount={heroCount}
                  setHeroCount={setHeroCount}
                  playStatus={playStatus}
                />
              </>
            }
          />
          <Route path="/check-news" element={<Check />} />
          <Route path="/check-newss" element={<Check1 />} />
          <Route path="/feedback/:newsId" element={<Feedback />} />
          <Route path="/model-accuracy" element={<ModelAccuracy />} />
          <Route path="/trending-news" element={<TrendingNews />} />
          <Route path="/confirm-retrain" element={<ConfirmRetrain />} />
          <Route path="/admin" element={<Admin />} /> {/* ✅ Admin route */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
