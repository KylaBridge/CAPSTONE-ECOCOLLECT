import "./styles/RewardRedemptionChart.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useState, useEffect, useRef } from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { rewardsAPI } from "../api/rewards";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { FaChevronDown } from "react-icons/fa";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartDataLabels,
);

export default function RewardRedemptionChart() {
  const currentDate = new Date();
  const [view, setView] = useState("weekly");
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1,
  );
  const [selectedMonthForMonthlyView, setSelectedMonthForMonthlyView] =
    useState(0); // 0 means all months
  const [selectedWeek, setSelectedWeek] = useState(0); // 0 means all weeks
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const exportDropdownRef = useRef(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Redemptions",
        data: [],
        backgroundColor: [
          "#077553",
          "#1c9352",
          "#1c9352",
          "#1f5319",
          "#145a32",
        ],
        borderRadius: 5,
      },
    ],
  });

  // Generate year options
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 2023; // More realistic start year for when the app might have been launched
    const years = [];

    // Only show years from start year to current year
    for (let year = startYear; year <= currentYear; year++) {
      years.push(year);
    }

    return years;
  };

  // Generate week ranges for selected month and year
  const generateWeekRanges = () => {
    const weeks = [{ value: 0, label: "All Weeks" }];
    const year = selectedYear;
    const month = selectedMonth - 1; // JavaScript months are 0-indexed
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of today for comparison

    // Get the first day of the month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Don't show any weeks for future months
    if (firstDay > today) {
      return weeks;
    }

    // Find the first Monday of the month (or the first day if it's already Monday)
    let currentDate = new Date(firstDay);
    const firstMonday = new Date(firstDay);

    // Adjust to find the Monday of the week containing the first day
    const dayOfWeek = firstDay.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 0, Monday = 1
    firstMonday.setDate(firstDay.getDate() - daysToMonday);

    currentDate = new Date(firstMonday);
    let weekNumber = 1;

    while (
      currentDate <= lastDay ||
      (currentDate.getMonth() === month && weekNumber <= 5)
    ) {
      const weekEnd = new Date(currentDate);
      weekEnd.setDate(currentDate.getDate() + 6); // Add 6 days to get Sunday

      // Only include weeks that have days in the selected month AND have already started
      if (currentDate <= lastDay && currentDate <= today) {
        const weekEndDisplay = weekEnd > lastDay ? new Date(lastDay) : weekEnd;
        // Also don't show weeks that start in the future
        const actualWeekEnd = weekEndDisplay > today ? today : weekEndDisplay;

        const startStr = currentDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        const endStr = actualWeekEnd.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        weeks.push({
          value: weekNumber,
          label: `${startStr} - ${endStr}`,
          startDate: new Date(currentDate),
          endDate: new Date(actualWeekEnd),
        });
      }

      currentDate.setDate(currentDate.getDate() + 7);
      weekNumber++;

      // Safety check to prevent infinite loops
      if (weekNumber > 6) break;
    }

    return weeks;
  };

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

  // Validate selected dates and adjust if needed
  useEffect(() => {
    const selectedDate = new Date(selectedYear, selectedMonth - 1, 1);
    if (selectedDate > currentDate) {
      // If selected date is in the future, reset to current month/year
      setSelectedYear(currentDate.getFullYear());
      setSelectedMonth(currentDate.getMonth() + 1);
      setSelectedWeek(0);
    }
  }, [selectedYear, selectedMonth, currentDate]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    const title = `Reward Redemption Stats - ${
      view === "weekly" ? "Weekly" : "Monthly"
    } View (${selectedYear}${view === "weekly" ? `/${selectedMonth}` : ""})`;
    doc.text(title, 14, 16);

    const exportData = chartData.labels.map((label, index) => [
      label,
      chartData.datasets[0].data[index],
    ]);

    autoTable(doc, {
      startY: 25,
      head: [["Period", "Redemptions"]],
      body: exportData,
    });

    const totalRedemptions = chartData.datasets[0].data.reduce(
      (sum, count) => sum + count,
      0,
    );
    doc.text(
      `Total Redemptions: ${totalRedemptions}`,
      14,
      doc.lastAutoTable.finalY + 10,
    );
    doc.save(
      `Reward_Redemptions_${view}_${selectedYear}${
        view === "weekly" ? `_${selectedMonth}` : ""
      }.pdf`,
    );
    setShowExportDropdown(false);
  };

  const exportToExcel = () => {
    const exportData = chartData.labels.map((label, index) => ({
      Period: label,
      Redemptions: chartData.datasets[0].data[index],
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Add summary information
    const totalRedemptions = chartData.datasets[0].data.reduce(
      (sum, count) => sum + count,
      0,
    );
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [""],
        ["Summary Information:"],
        [`Total Redemptions: ${totalRedemptions}`],
        [`View Type: ${view}`],
        [`Year: ${selectedYear}`],
        [`Month: ${view === "weekly" ? selectedMonth : "N/A"}`],
      ],
      { origin: -1 },
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reward Redemptions");
    XLSX.writeFile(
      workbook,
      `Reward_Redemptions_${view}_${selectedYear}${
        view === "weekly" ? `_${selectedMonth}` : ""
      }.xlsx`,
    );
    setShowExportDropdown(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          period: view,
          year: selectedYear.toString(),
          ...(view === "weekly" && {
            month: selectedMonth.toString(),
            ...(selectedWeek > 0 && { week: selectedWeek.toString() }),
          }),
          ...(view === "monthly" &&
            selectedMonthForMonthlyView > 0 && {
              month: selectedMonthForMonthlyView.toString(),
            }),
        });

        const response = await rewardsAPI.getRewardRedemptionStats(
          Object.fromEntries(params),
        );
        const data = response.data;

        const labels = data.map((item) => item._id);
        const counts = data.map((item) => item.count);

        setChartData({
          labels,
          datasets: [
            {
              label: `${view === "weekly" ? "Weekly" : "Monthly"} Redemptions`,
              data: counts,
              backgroundColor: [
                "#077553",
                "#1c9352",
                "#1c9352",
                "#1f5319",
                "#145a32",
              ],
              borderRadius: 5,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching redemption stats:", error);
        // Set empty state on error
        setChartData({
          labels: [],
          datasets: [
            {
              label: `${view === "weekly" ? "Weekly" : "Monthly"} Redemptions`,
              data: [],
              backgroundColor: [
                "#077553",
                "#1c9352",
                "#1c9352",
                "#1f5319",
                "#145a32",
              ],
              borderRadius: 5,
            },
          ],
        });
      }
    };

    fetchData();
  }, [
    view,
    selectedYear,
    selectedMonth,
    selectedWeek,
    selectedMonthForMonthlyView,
  ]);

  const hasData =
    chartData.datasets[0].data.length > 0 &&
    chartData.datasets[0].data.some((count) => count > 0);

  const totalRedemptions = chartData.datasets[0].data.reduce(
    (sum, count) => sum + count,
    0,
  );

  const maxReward = hasData
    ? chartData.labels[
        chartData.datasets[0].data.indexOf(
          Math.max(...chartData.datasets[0].data),
        )
      ]
    : null;

  const minReward = hasData
    ? chartData.labels[
        chartData.datasets[0].data.indexOf(
          Math.min(...chartData.datasets[0].data.filter((x) => x > 0)),
        )
      ]
    : null;

  const maxRedemptionCount = hasData
    ? Math.max(...chartData.datasets[0].data)
    : 0;
  const minRedemptionCount = hasData
    ? Math.min(...chartData.datasets[0].data.filter((x) => x > 0)) || 0
    : 0;

  return (
    <div className="reward-chart-card">
      <div className="reward-header">
        <div className="header-top">
          <h3>Reward Redemption Stats</h3>
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

        <div className="controls-row">
          <div className="toggle-buttons">
            <button
              className={view === "weekly" ? "active" : ""}
              onClick={() => setView("weekly")}
            >
              Weekly
            </button>
            <button
              className={view === "monthly" ? "active" : ""}
              onClick={() => setView("monthly")}
            >
              Monthly
            </button>
          </div>

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
            {view === "weekly" && (
              <>
                <select
                  className="month-dropdown"
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(parseInt(e.target.value));
                    setSelectedWeek(0); // Reset week when month changes
                  }}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
                    const monthDate = new Date(selectedYear, month - 1, 1);
                    const isValidMonth = monthDate <= currentDate;

                    return (
                      <option
                        key={month}
                        value={month}
                        disabled={!isValidMonth}
                        style={!isValidMonth ? { color: "#999" } : {}}
                      >
                        {new Date(2025, month - 1).toLocaleString("default", {
                          month: "long",
                        })}
                        {!isValidMonth ? " (Future)" : ""}
                      </option>
                    );
                  })}
                </select>
                <select
                  className="week-dropdown"
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
                >
                  {generateWeekRanges().map((week) => (
                    <option key={week.value} value={week.value}>
                      {week.label}
                    </option>
                  ))}
                </select>
              </>
            )}
            {view === "monthly" && (
              <select
                className="month-dropdown"
                value={selectedMonthForMonthlyView}
                onChange={(e) =>
                  setSelectedMonthForMonthlyView(parseInt(e.target.value))
                }
              >
                <option value={0}>All Months</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
                  const monthDate = new Date(selectedYear, month - 1, 1);
                  const isValidMonth = monthDate <= currentDate;

                  return (
                    <option
                      key={month}
                      value={month}
                      disabled={!isValidMonth}
                      style={!isValidMonth ? { color: "#999" } : {}}
                    >
                      {new Date(2025, month - 1).toLocaleString("default", {
                        month: "long",
                      })}
                      {!isValidMonth ? " (Future)" : ""}
                    </option>
                  );
                })}
              </select>
            )}
          </div>
        </div>
      </div>

      <div className="reward-content">
        <div className="summary-section">
          <div className="total-redemptions-text">
            <strong>Total Redemptions: {totalRedemptions}</strong>
            <span className="time-period">
              {view === "weekly"
                ? selectedWeek > 0
                  ? ` (${
                      generateWeekRanges().find((w) => w.value === selectedWeek)
                        ?.label || "Selected Week"
                    })`
                  : ` (All weeks in ${new Date(
                      2025,
                      selectedMonth - 1,
                    ).toLocaleString("default", {
                      month: "long",
                    })} ${selectedYear})`
                : selectedMonthForMonthlyView > 0
                  ? ` (${new Date(
                      2025,
                      selectedMonthForMonthlyView - 1,
                    ).toLocaleString("default", {
                      month: "long",
                    })} ${selectedYear})`
                  : ` (All months in ${selectedYear})`}
            </span>
          </div>

          <div className="summary-cards">
            <div className="summary-item">
              <span className="summary-label">Most Redeemed</span>
              <br />
              <div className="reward-count">{maxRedemptionCount}</div>
              <div className="reward-name">{maxReward || "No data"}</div>
              <div className="reward-percentage">
                {hasData && totalRedemptions > 0
                  ? `${((maxRedemptionCount / totalRedemptions) * 100).toFixed(
                      1,
                    )}%`
                  : "0.0%"}
              </div>
            </div>
            <div className="summary-item">
              <span className="summary-label">Least Redeemed</span>
              <br />
              <div className="reward-count">{minRedemptionCount}</div>
              <div className="reward-name">{minReward || "No data"}</div>
              <div className="reward-percentage">
                {hasData && totalRedemptions > 0
                  ? `${((minRedemptionCount / totalRedemptions) * 100).toFixed(
                      1,
                    )}%`
                  : "0.0%"}
              </div>
            </div>
          </div>
        </div>

        <div className="bar-chart-container">
          {chartData.labels.length === 0 ||
          chartData.datasets[0].data.reduce((sum, count) => sum + count, 0) ===
            0 ? (
            <div className="no-data-message">
              <div className="no-data-icon">📊</div>
              <h4>No Data Available</h4>
              <p>
                {view === "weekly"
                  ? selectedWeek > 0
                    ? `No redemptions found for ${
                        generateWeekRanges().find(
                          (w) => w.value === selectedWeek,
                        )?.label || "selected week"
                      } in ${new Date(2025, selectedMonth - 1).toLocaleString(
                        "default",
                        { month: "long" },
                      )} ${selectedYear}.`
                    : `No redemptions found for ${new Date(
                        2025,
                        selectedMonth - 1,
                      ).toLocaleString("default", {
                        month: "long",
                      })} ${selectedYear}.`
                  : selectedMonthForMonthlyView > 0
                    ? `No redemptions found for ${new Date(
                        2025,
                        selectedMonthForMonthlyView - 1,
                      ).toLocaleString("default", {
                        month: "long",
                      })} ${selectedYear}.`
                    : `No redemptions found for ${selectedYear}.`}
              </p>
              <p className="suggestion">
                Try selecting a different time period or check back later.
              </p>
            </div>
          ) : (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  datalabels: {
                    anchor: "end",
                    align: "start",
                    color: "#ffffff",
                    font: {
                      weight: "bold",
                      size: 12,
                    },
                    formatter: (value) => `${value}`,
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => `Redemptions: ${context.raw}`,
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
          )}
        </div>
      </div>

      <div className="reward-description">
        <p>
          This section displays the most and least redeemed rewards, along with
          a breakdown of redemption frequency over time. Use the toggle to
          switch between weekly and monthly views.
        </p>
      </div>
    </div>
  );
}
