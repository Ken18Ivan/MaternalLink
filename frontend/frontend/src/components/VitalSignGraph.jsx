import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const VitalSignGraph = ({ data }) => {
  const chartData = data && data.length > 0 ? data : [];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mt-6">
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip />
            <Legend verticalAlign="top" height={36}/>
            <Line name="Systolic" type="monotone" dataKey="systolic" stroke="#FF6384" strokeWidth={4} dot={{ r: 4 }} />
            <Line name="Diastolic" type="monotone" dataKey="diastolic" stroke="#36A2EB" strokeWidth={4} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default VitalSignGraph;