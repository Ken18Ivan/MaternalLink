import React, { useState, useEffect } from 'react';
import { formatDate } from '../utils';

const MothersInfoBoard = () => {
  const [infos, setInfos] = useState([
    { id: 1, title: "Prenatal Visit", content: "Checkup at Brgy Hall, Friday 8AM.", date: new Date().toISOString(), type: "alert" },
    { id: 2, title: "Hydration Tip", content: "Drink 8-10 glasses of water daily.", date: new Date().toISOString(), type: "info" }
  ]);

  // Styles used directly to avoid missing CSS files during demo
  const styles = {
    container: { background: '#fff', padding: '20px', borderRadius: '2rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', marginBottom: '20px', border: '1px solid #f3f4f6' },
    card: (type) => ({
      padding: '15px', borderRadius: '12px', marginBottom: '10px', background: type === 'alert' ? '#FEF2F2' : '#EFF6FF',
      borderLeft: `4px solid ${type === 'alert' ? '#EF4444' : '#3B82F6'}`
    })
  };

  return (
    <div style={styles.container}>
      <h3 className="font-bold text-gray-700 uppercase text-xs tracking-widest mb-4">📢 Mommy Updates</h3>
      <div>
        {infos.map((info) => (
          <div key={info.id} style={styles.card(info.type)}>
            <div className="flex justify-between mb-1">
              <span className="font-bold text-sm text-gray-800">{info.title}</span>
              <span className="text-xs text-gray-500">{formatDate(info.date)}</span>
            </div>
            <p className="text-xs text-gray-600">{info.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MothersInfoBoard;