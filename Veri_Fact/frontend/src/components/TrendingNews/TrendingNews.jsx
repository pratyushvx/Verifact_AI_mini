import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TrendingNews.css";
import { useNavigate } from "react-router-dom";

const TrendingNews = () => {
    const [newsList, setNewsList] = useState([]);
    const [selectedNews, setSelectedNews] = useState([]);
    const [page, setPage] = useState(1);
    const limit = 10;

    const navigate = useNavigate();

    useEffect(() => {
        console.log(`🟢 Fetching news - Page: ${page}, Limit: ${limit}`);

        axios.get(`http://localhost:5001/api/news/all?page=${page}&limit=${limit}`)
            .then(response => {
                if (Array.isArray(response.data.news)) {
                    console.log(`✅ News received. Total: ${response.data.news.length}`);
                    setNewsList(response.data.news);
                } else {
                    console.warn("⚠️ Unexpected response format", response.data);
                    setNewsList([]);
                }
            })
            .catch(error => {
                console.error("❌ Failed to load news:", error);
                alert("Failed to load news.");
            });
    }, [page]);

    const handleCheckboxChange = (item) => {
        setSelectedNews(prev => {
            const alreadySelected = prev.find(news => news._id === item._id);
            if (alreadySelected) {
                return prev.filter(news => news._id !== item._id);
            } else {
                return [...prev, item];
            }
        });
    };

    const handleConfirmClick = () => {
        if (selectedNews.length === 0) {
            alert("Please select at least one news item.");
            return;
        }
        navigate("/confirm-retrain", { state: { selectedNews } });
    };

    return (
        <div>
            <h1>Trending News Analysis</h1>
            {newsList.map(item => (
                <div key={item._id} className="news-card">
                    <input
                        type="checkbox"
                        onChange={() => handleCheckboxChange(item)}
                        checked={selectedNews.some(news => news._id === item._id)}
                    />
                    <p>📰 News: {item.news}</p>
                    <p>🔍 Prediction: {item.prediction}</p>
                    {item.feedback && <p>🗣️ Feedback: {item.feedback}</p>}
                </div>
            ))}
            <div className="pagination-buttons">
                <button 
                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                    disabled={page === 1}
                >
                    Prev
                </button>
                <button onClick={() => setPage(prev => prev + 1)}>
                    Next
                </button>
            </div>
            <div style={{ marginTop: "20px" }}>
                <button onClick={handleConfirmClick} className="confirm-button">
                    ✅ Confirm Retrain
                </button>
            </div>
        </div>
    );
};

export default TrendingNews;
