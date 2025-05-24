import './styles/RewardRedemptionChart.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { useState, useEffect } from 'react';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import axios from 'axios';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

export default function RewardRedemptionChart() {
  const [view, setView] = useState('weekly');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Redemptions',
      data: [],
      backgroundColor: ['#077553', '#1c9352', '#1c9352', '#1f5319', '#145a32'],
      borderRadius: 5,
    }]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/ecocollect/rewards/redemption-stats?period=${view}`);
        const data = response.data;

        const labels = data.map(item => item._id);
        const counts = data.map(item => item.count);

        setChartData({
          labels,
          datasets: [{
            label: `${view === 'weekly' ? 'Weekly' : 'Monthly'} Redemptions`,
            data: counts,
            backgroundColor: ['#077553', '#1c9352', '#1c9352', '#1f5319', '#145a32'],
            borderRadius: 5,
          }]
        });
      } catch (error) {
        console.error('Error fetching redemption stats:', error);
      }
    };

    fetchData();
  }, [view]);

  const maxReward = chartData.labels[chartData.datasets[0].data.indexOf(Math.max(...chartData.datasets[0].data))];
  const minReward = chartData.labels[chartData.datasets[0].data.indexOf(Math.min(...chartData.datasets[0].data))];

  return (
    <div className="reward-chart-card">
      <div className="reward-header">
        <h3>Reward Redemption Stats</h3>
        <div className="toggle-buttons">
          <button className={view === 'weekly' ? 'active' : ''} onClick={() => setView('weekly')}>Weekly</button>
          <button className={view === 'monthly' ? 'active' : ''} onClick={() => setView('monthly')}>Monthly</button>
        </div>
      </div>

      <div className="reward-content">
        <div className="summary-cards">
          <div className="summary-item">
            <span className="summary-label">Most Redeemed</span><br />
            <div className='reward-count'>{Math.max(...chartData.datasets[0].data) || 0}</div>
            <div className='reward-name'>{maxReward || 'No data'}</div>
          </div>
          <div className="summary-item">
            <span className="summary-label">Least Redeemed</span><br />
            <div className='reward-count'>{Math.min(...chartData.datasets[0].data) || 0}</div>
            <div className='reward-name'>{minReward || 'No data'}</div>
          </div>
        </div>

        <div className="bar-chart-container">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                datalabels: {
                  anchor: 'end',
                  align: 'start',
                  color: '#ffffff',
                  font: {
                    weight: 'bold',
                    size: 12,
                  },
                  formatter: value => `${value}`,
                },
                tooltip: {
                  callbacks: {
                    label: context => `Redemptions: ${context.raw}`,
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { stepSize: 10 },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="reward-description">
        <p>
          This section displays the most and least redeemed rewards, along with a breakdown of redemption frequency over time. Use the toggle to switch between weekly and monthly views.
        </p>
      </div>
    </div>
  );
}
