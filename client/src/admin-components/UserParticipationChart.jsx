import "./styles/UserParticipationChart.css";
import { useState, useEffect, useRef } from "react";
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
import { userAPI } from "../api/user";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { FaChevronDown } from "react-icons/fa";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
);

// Function to generate year options dynamically
const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 2025; // The year when EcoCollect started
  const years = [];

  for (let year = startYear; year <= currentYear; year++) {
    years.push(year);
  }

  // If we want to include next year for planning purposes
  if (!years.includes(currentYear + 1)) {
    years.push(currentYear + 1);
  }

  return years;
};

export default function UserParticipationChart() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [viewType, setViewType] = useState("Daily");
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "User Participation Rate (%)",
        data: [],
        fill: false,
        borderColor: "#284c42",
        backgroundColor: "#284c42",
        pointBackgroundColor: "#284c42",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        tension: 0.3,
      },
    ],
  });
  const [totalUsers, setTotalUsers] = useState(0);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const exportDropdownRef = useRef(null);

  // Handle click outside for export dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        exportDropdownRef.current &&
        !exportDropdownRef.current.contains(event.target)
      ) {
        setShowExportDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const exportToPDF = () => {
    const doc = new jsPDF();
    const title = `User Participation Rates - ${viewType} View (${selectedYear}${
      viewType !== "Monthly" ? `/${selectedMonth}` : ""
    })`;
    doc.text(title, 14, 16);

    const exportData = chartData.labels.map((label, index) => [
      label,
      `${chartData.datasets[0].data[index]}%`,
    ]);

    autoTable(doc, {
      startY: 25,
      head: [["Period", "Participation Rate (%)"]],
      body: exportData,
    });

    doc.text(
      `Total Registered Users: ${totalUsers}`,
      14,
      doc.lastAutoTable.finalY + 10,
    );
    doc.save(
      `User_Participation_${viewType}_${selectedYear}${
        viewType !== "Monthly" ? `_${selectedMonth}` : ""
      }.pdf`,
    );
    setShowExportDropdown(false);
  };

  const exportToExcel = () => {
    const exportData = chartData.labels.map((label, index) => ({
      Period: label,
      "Participation Rate (%)": chartData.datasets[0].data[index],
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Add summary information
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [""],
        ["Summary Information:"],
        [`Total Registered Users: ${totalUsers}`],
        [`View Type: ${viewType}`],
        [`Year: ${selectedYear}`],
        [`Month: ${viewType !== "Monthly" ? selectedMonth : "N/A"}`],
      ],
      { origin: -1 },
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "User Participation");
    XLSX.writeFile(
      workbook,
      `User_Participation_${viewType}_${selectedYear}${
        viewType !== "Monthly" ? `_${selectedMonth}` : ""
      }.xlsx`,
    );
    setShowExportDropdown(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch participation data
        const response = await userAPI.getUserParticipationData({
          year: selectedYear,
          month: selectedMonth,
          viewType: viewType,
        });
        const { submissions, redemptions, signups } = response.data;

        // Fetch total user count for participation rate calculation
        const userCountResponse = await userAPI.getUserCount();
        const totalUserCount = userCountResponse.data.userCount || 0;
        setTotalUsers(totalUserCount);

        // Calculate participation rate for each time period
        const participationData = {};
        const dateMapping = {}; // For weekly view, map display string to actual date for sorting

        const allDates = new Set([
          ...submissions.map((s) => s._id),
          ...redemptions.map((r) => r._id),
          ...signups.map((s) => s._id),
        ]);

        allDates.forEach((date) => {
          const submission =
            submissions.find((s) => s._id === date)?.count || 0;
          const redemption =
            redemptions.find((r) => r._id === date)?.count || 0;
          const signup = signups.find((s) => s._id === date)?.count || 0;

          // Calculate total activities for the period
          const totalActivities = submission + redemption + signup;

          // Calculate participation rate as percentage
          // Assumption: Each activity represents unique user participation
          // Rate = (Active Users / Total Users) × 100
          // For simplicity, we assume each activity count represents unique active users
          const activeUsers = Math.min(totalActivities, totalUserCount); // Can't exceed total users
          const participationRate =
            totalUserCount > 0 ? (activeUsers / totalUserCount) * 100 : 0;

          participationData[date] = Math.round(participationRate * 100) / 100; // Round to 2 decimal places

          // For weekly view, store the sorting key
          if (viewType === "Weekly") {
            const weekStartData =
              submissions.find((s) => s._id === date) ||
              redemptions.find((r) => r._id === date) ||
              signups.find((s) => s._id === date);
            if (weekStartData && weekStartData.weekStart) {
              dateMapping[date] = weekStartData.weekStart;
            }
          }
        });

        // Sort dates and prepare chart data
        let sortedDates;
        if (viewType === "Weekly") {
          // Sort by actual week start date for weekly view
          sortedDates = Object.keys(participationData).sort((a, b) => {
            const dateA = new Date(dateMapping[a] || a);
            const dateB = new Date(dateMapping[b] || b);
            return dateA - dateB;
          });
        } else {
          // Regular alphabetical sort works for daily (YYYY-MM-DD) and monthly (YYYY-MM) formats
          sortedDates = Object.keys(participationData).sort();
        }

        const rates = sortedDates.map((date) => participationData[date]);

        setChartData({
          labels: sortedDates,
          datasets: [
            {
              label: "User Participation Rate (%)",
              data: rates,
              fill: false,
              borderColor: "#284c42",
              backgroundColor: "#284c42",
              pointBackgroundColor: "#284c42",
              pointBorderColor: "#ffffff",
              pointBorderWidth: 2,
              tension: 0.3,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching participation data:", error);
      }
    };

    fetchData();
  }, [selectedYear, selectedMonth, viewType]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#284c42",
        borderWidth: 1,
        callbacks: {
          label: (ctx) => `Participation Rate: ${ctx.raw}%`,
        },
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "User Participation Rate (%)",
          color: "#234b35",
        },
        beginAtZero: true,
        max: 100, // Participation rate is a percentage (0-100%)
        ticks: {
          stepSize: 10,
          callback: function (value) {
            return value + "%";
          },
        },
      },
      x: {
        title: {
          display: true,
          text:
            viewType === "Daily"
              ? "Day of Month"
              : viewType === "Weekly"
                ? "Week Ranges"
                : "Month",
        },
        ticks: {
          maxRotation: viewType === "Weekly" ? 45 : 0,
          minRotation: viewType === "Weekly" ? 45 : 0,
          font: {
            size: viewType === "Weekly" ? 10 : 12,
          },
        },
      },
    },
  };

  return (
    <div className="user-participation-card">
      <div className="top-bar">
        <h3>User Participation Rates</h3>
        <div className="date-selectors">
          <select
            className="year-dropdown"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {generateYearOptions().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {(viewType === "Daily" || viewType === "Weekly") && (
            <select
              className="month-dropdown"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {new Date(2025, month - 1).toLocaleString("default", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="toggle-group">
        <div className="toggle-buttons">
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
        <div className="export-dropdown" ref={exportDropdownRef}>
          <button
            className="export-button"
            onClick={() => setShowExportDropdown(!showExportDropdown)}
            disabled={chartData.labels.length === 0}
          >
            Export{" "}
            <FaChevronDown style={{ marginLeft: "5px", fontSize: "12px" }} />
          </button>
          {showExportDropdown && (
            <div className="export-dropdown-menu">
              <div className="export-dropdown-item" onClick={exportToPDF}>
                Export to PDF
              </div>
              <div className="export-dropdown-item" onClick={exportToExcel}>
                Export to Excel
              </div>
            </div>
          )}
        </div>
      </div>

      <Line data={chartData} options={chartOptions} />

      <p className="card-note">
        This chart shows the percentage of users actively participating in the
        system. Participation rate is calculated as (Active Users / Total
        Registered Users) × 100. Based on {totalUsers} total registered users.
        {viewType === "Weekly"
          ? " Weekly view shows participation rates for complete week ranges (Sunday-Saturday) within the selected month."
          : viewType === "Daily"
            ? " Daily view shows participation rates for each day of the selected month."
            : " Monthly view shows participation rates for each month of the selected year."}{" "}
        Use the dropdowns and toggle to explore participation trends across
        different timeframes.
      </p>
    </div>
  );
}
