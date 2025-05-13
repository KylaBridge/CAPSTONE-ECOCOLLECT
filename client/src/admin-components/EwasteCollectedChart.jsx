import './styles/EwasteCollectedChart.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const categoryLabels = [
  { key: 'mobileCount', label: 'Phones', color: '#0b3d0b' },
  { key: 'laptopCount', label: 'Laptops', color: '#145214' },
  { key: 'cordCount', label: 'Cable', color: '#1c6e1c' },
  { key: 'chargerCount', label: 'Chargers', color: '#268a26' },
  { key: 'batteryCount', label: 'Batteries', color: '#32a836' },
  { key: 'routerCount', label: 'Routers', color: '#42bf48' },
  { key: 'usbCount', label: 'USB', color: '#5edc6c' },
  { key: 'powerbankCount', label: 'Powerbank', color: '#7eea8a' },
  { key: 'telephoneCount', label: 'Telephone', color: '#a2f5ad' },
  { key: 'tabletCount', label: 'Tablet', color: '#cdfcd3' },
];

export default function EwasteCollectedChart() {
  const [ewasteData, setEwasteData] = useState(null);

  useEffect(() => {
    axios.get('/api/ecocollect/user/ewastes') // Adjust if your API base is different
      .then(res => {
        const data = res.data;
        const labels = categoryLabels.map(c => c.label);
        const backgroundColor = categoryLabels.map(c => c.color);
        const chartData = categoryLabels.map(c => data[c.key] || 0);

        setEwasteData({
          labels,
          datasets: [{
            data: chartData,
            backgroundColor,
            borderWidth: 0,
          }],
        });
      })
      .catch(err => {
        console.error("Failed to fetch ewaste data", err);
      });
  }, []);

  if (!ewasteData) return <div>Loading chart...</div>;

  const total = ewasteData.datasets[0].data.reduce((acc, val) => acc + val, 0);

  return (
    <div className="ewaste-card">
      <div className="ewaste-header">
        <h3>E-Waste Collected</h3>
      </div>

      <div className="ewaste-content">
        <div className="ewaste-left">
          <div className="total-box">Total: {total}</div>
          <h4 className="legend-title">Legend:</h4>
          <div className="legend-grid">
            {ewasteData.labels.map((label, index) => (
              <div className="legend-item" key={label}>
                <span
                  className="legend-color"
                  style={{ backgroundColor: ewasteData.datasets[0].backgroundColor[index] }}
                ></span>
                <span className="legend-label">{label}: {ewasteData.datasets[0].data[index]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-container">
          <Pie
            data={ewasteData}
            options={{
              plugins: {
                legend: { display: false },
                datalabels: {
                  color: '#000',
                  formatter: (value, context) => {
                    const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                    const percent = ((value / total) * 100).toFixed(1);
                    return `${percent}%`;
                  },
                  font: {
                    weight: 'bold',
                    size: 12,
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <p className="card-note">
        This chart shows a breakdown of the total e-waste submissions categorized by type. Each category is color-coded in the pie chart and legend for quick reference.
      </p>
    </div>
  );
}
