import './styles/EwasteCollectedChart.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const ewasteData = {
  labels: ['Phones', 'Laptops', 'Cable', 'Chargers', 'Batteries', 'Routers', 'USB', 'Powerbank', 'Telephone', 'Tablet'],
  datasets: [
    {
      data: [10, 5, 6, 20, 15, 10, 5, 6, 20, 15],
      backgroundColor: [  
        '#0b3d0b', // dark forest green
        '#145214', // rich deep green
        '#1c6e1c', // strong jungle green
        '#268a26', // healthy leaf green
        '#32a836', // vibrant grass green
        '#42bf48', // bright lime green
        '#5edc6c', // soft neon green
        '#7eea8a', // minty fresh green
        '#a2f5ad', // pale green
        '#cdfcd3', // almost pastel green,
      ],
      borderWidth: 0,
    },
  ],
};

export default function EwasteCollectedChart() {
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
