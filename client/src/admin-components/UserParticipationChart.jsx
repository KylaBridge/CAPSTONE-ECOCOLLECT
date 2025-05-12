import './styles/UserParticipationChart.css'
import { useState } from "react";
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

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

const yearOptions = [2025, 2026, 2027, 2028];

const dummyData = {
  Daily: {
    labels: ["Feb 1", "Feb 2", "Feb 3", "Feb 4", "Feb 5", "Feb 6", "Feb 7"],
    data: [3, 7, 5, 10, 4, 8, 6],
  },
  Weekly: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    data: [25, 33, 28, 40],
  },
  Monthly: {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    data: [90, 120, 110, 135],
  },
};

export default function UserParticipationChart() {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [viewType, setViewType] = useState("Daily");

  const chartData = {
    labels: dummyData[viewType].labels,
    datasets: [
      {
        label: "User Engagement Rate",
        data: dummyData[viewType].data,
        fill: false,
        borderColor: "#284c42",
        tension: 0.3,
      },
    ],
  };

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
