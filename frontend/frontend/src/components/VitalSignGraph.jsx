import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const VitalSignGraph = ({ data }) => {
  // Default data so the graph isn't empty during testing
  const chartData = data || [
    { date: 'Mon', systolic: 110, diastolic: 70 },
    { date: 'Tue', systolic: 115, diastolic: 72 },
    { date: 'Wed', systolic: 112, diastolic: 71 },
    { date: 'Thu', systolic: 120, diastolic: 80 },
    { date: 'Fri', systolic: 118, diastolic: 78 },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-6" style={{ background: '#fff', padding: '20px', borderRadius: '12px' }}>
      <h3 className="text-lg font-bold text-gray-700 mb-4">Blood Pressure History</h3>
      
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip />
            <Legend verticalAlign="top" height={36}/>

            {/* Thick Red Line */}
            <Line
              name="Systolic"
              type="monotone"
              dataKey="systolic"
              stroke="#FF6384" 
              strokeWidth={4} 
              dot={{ r: 5, strokeWidth: 2, fill: '#fff' }}
              activeDot={{ r: 8 }}
            />

            {/* Thick Blue Line */}
            <Line
              name="Diastolic"
              type="monotone"
              dataKey="diastolic"
              stroke="#36A2EB" 
              strokeWidth={4} 
              dot={{ r: 5, strokeWidth: 2, fill: '#fff' }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VitalSignGraph;