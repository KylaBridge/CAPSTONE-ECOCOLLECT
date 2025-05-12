import './styles/RewardRedemptionChart.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { useState } from 'react';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

const weeklyData = {
  labels: ['Tumbler', 'Tote Bag', 'Notebook', 'Shirt', 'Umbrella'],
  datasets: [
    {
      label: 'Weekly Redemptions',
      data: [15, 10, 5, 20, 3],
      backgroundColor: ['#077553', '#1c9352', '#1c9352', '#1f5319', '#145a32'],
      borderRadius: 5,
    },
  ],
};

const monthlyData = {
  labels: ['Tumbler', 'Tote Bag', 'Notebook', 'Shirt', 'Umbrella'],
  datasets: [
    {
      label: 'Monthly Redemptions',
      data: [50, 40, 20, 60, 10],
      backgroundColor: ['#077553', '#1c9352', '#1c9352', '#1f5319', '#145a32'],
      borderRadius: 5,
    },
  ],
};

export default function RewardRedemptionChart() {
  const [view, setView] = useState('weekly');
  const data = view === 'weekly' ? weeklyData : monthlyData;

  const maxReward = data.labels[data.datasets[0].data.indexOf(Math.max(...data.datasets[0].data))];
  const minReward = data.labels[data.datasets[0].data.indexOf(Math.min(...data.datasets[0].data))];

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
                <div className='reward-count'>   {Math.max(...data.datasets[0].data)}</div> 
                 <div className='reward-name'> {maxReward} </div>
            </div>
            <div className="summary-item">
                <span className="summary-label">Least Redeemed</span><br />
                <div className='reward-count'> {Math.min(...data.datasets[0].data)} </div>
                 <div className='reward-name'> {minReward} </div>
            </div>
        </div>


        <div className="bar-chart-container">
        <Bar
            data={data}
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
