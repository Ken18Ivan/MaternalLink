import React, { useState, useEffect } from 'react';
import { formatDate } from '../utils'; // <--- Importing from utils.js
import './MothersInfoBoard.css'; 

const MothersInfoBoard = () => {
  const [infos, setInfos] = useState([]);

  useEffect(() => {
    // Mock Data
    setInfos([
      { id: 1, title: "Prenatal Visit", content: "Checkup at Brgy Hall, Friday 8AM.", date: "2025-12-18T08:00:00Z", type: "alert" },
      { id: 2, title: "Hydration", content: "Drink 8-10 glasses of water daily.", date: "2025-12-16T09:00:00Z", type: "info" },
      { id: 3, title: "Vitals Normal", content: "Your BP is healthy.", date: "2025-12-15T14:30:00Z", type: "success" }
    ]);
  }, []);

  return (
    <div className="info-board-container">
      <div className="info-board-header">
        <h3>📢 Mommy Updates</h3>
      </div>
      <div className="info-list">
        {infos.map((info) => (
          <div key={info.id} className={`info-card ${info.type}`}>
            <div className="card-top">
              <span className="card-title">{info.title}</span>
              {/* Using the imported utility function here */}
              <span className="card-date">{formatDate(info.date)}</span>
            </div>
            <p className="card-content">{info.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MothersInfoBoard;