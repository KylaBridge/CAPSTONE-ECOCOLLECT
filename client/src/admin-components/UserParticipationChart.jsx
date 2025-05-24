import './styles/UserParticipationChart.css'
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import axios from 'axios';

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

const yearOptions = [2023, 2024, 2025, 2026];

export default function UserParticipationChart() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewType, setViewType] = useState("Daily");
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "User Engagement Rate",
        data: [],
        fill: false,
        borderColor: "#284c42",
        tension: 0.3,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/ecocollect/analytics/participation?year=${selectedYear}&viewType=${viewType}`);
        const { submissions, redemptions, signups } = response.data;

        // Combine all activities for each time period
        const combinedData = {};
        const allDates = new Set([
          ...submissions.map(s => s._id),
          ...redemptions.map(r => r._id),
          ...signups.map(s => s._id)
        ]);

        allDates.forEach(date => {
          const submission = submissions.find(s => s._id === date)?.count || 0;
          const redemption = redemptions.find(r => r._id === date)?.count || 0;
          const signup = signups.find(s => s._id === date)?.count || 0;
          combinedData[date] = submission + redemption + signup;
        });

        // Sort dates and prepare chart data
        const sortedDates = Object.keys(combinedData).sort();
        const counts = sortedDates.map(date => combinedData[date]);

        setChartData({
          labels: sortedDates,
          datasets: [
            {
              label: "User Engagement Rate",
              data: counts,
              fill: false,
              borderColor: "#284c42",
              tension: 0.3,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching participation data:', error);
      }
    };

    fetchData();
  }, [selectedYear, viewType]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `Engagements: ${ctx.raw}`,
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Submissions + Redemptions + Sign-ups ",
          color: "#234b35",
        },
        beginAtZero: true,
        ticks: {
          stepSize: 5,
          callback: function (value) {
            return value;
          },
        },
      },
      x: {
        title: {
          display: true,
          text: viewType === "Daily" ? "Day of Month" : viewType === "Weekly" ? "Week" : "Month",
        },
      },
    },
  };

  return (
    <div className="user-participation-card">
      <div className="top-bar">
        <h3>User Participation Rates</h3>
        <select
          className="year-dropdown"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="toggle-group">
        {["Daily", "Weekly", "Monthly"].map((type) => (
          <button
            key={type}
            onClick={() => setViewType(type)}
            className={viewType === type ? "active" : ""}
          >
            {type}
          </button>
        ))}
      </div>

      <Line data={chartData} options={chartOptions} />

      <p className="card-note">
        This chart shows how users interact with the system. Metrics include submissions, redemptions,
        and sign-ups. Use the dropdown and toggle to explore data trends for different timeframes and years.
      </p>
    </div>
  );
}
