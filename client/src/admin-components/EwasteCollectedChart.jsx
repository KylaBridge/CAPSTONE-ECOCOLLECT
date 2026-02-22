import "./styles/EwasteCollectedChart.css";
import { useEffect, useState, useRef } from "react";
import { ewasteAPI } from "../api/ewaste";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { FaChevronDown } from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const categoryLabels = [
  { key: "mobileCount", label: "Phones", color: "#118653" }, // EcoCollect primary green
  { key: "laptopCount", label: "Laptops", color: "#2563eb" }, // Professional blue
  { key: "cordCount", label: "Cable", color: "#dc2626" }, // Strong red
  { key: "chargerCount", label: "Chargers", color: "#7c3aed" }, // Deep purple
  { key: "batteryCount", label: "Batteries", color: "#ea580c" }, // Vibrant orange
  { key: "routerCount", label: "Routers", color: "#0891b2" }, // Teal blue
  { key: "usbCount", label: "USB", color: "#be185d" }, // Deep pink/magenta
  { key: "powerbankCount", label: "Powerbank", color: "#a16207" }, // Golden brown
  { key: "telephoneCount", label: "Telephone", color: "#374151" }, // Dark gray
  { key: "tabletCount", label: "Tablet", color: "#059669" }, // Emerald green
  { key: "othersCount", label: "Others", color: "#581c87" }, // Deep indigo
];

export default function EwasteCollectedChart() {
  const [ewasteData, setEwasteData] = useState(null);
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
    if (!ewasteData) return;

    const doc = new jsPDF();
    doc.text("E-Waste Collection Report", 14, 16);

    const total = ewasteData.datasets[0].data.reduce(
      (acc, val) => acc + val,
      0,
    );

    const exportData = ewasteData.labels.map((label, index) => {
      const count = ewasteData.datasets[0].data[index];
      const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
      return [label, count, `${percentage}%`];
    });

    autoTable(doc, {
      startY: 25,
      head: [["Category", "Count", "Percentage"]],
      body: exportData,
    });

    doc.text(
      `Total E-Waste Items: ${total}`,
      14,
      doc.lastAutoTable.finalY + 10,
    );
    doc.save(
      `E-Waste_Collection_Report_${new Date().toISOString().split("T")[0]}.pdf`,
    );
    setShowExportDropdown(false);
  };

  const exportToExcel = () => {
    if (!ewasteData) return;

    const total = ewasteData.datasets[0].data.reduce(
      (acc, val) => acc + val,
      0,
    );

    const exportData = ewasteData.labels.map((label, index) => {
      const count = ewasteData.datasets[0].data[index];
      const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
      return {
        Category: label,
        Count: count,
        "Percentage (%)": percentage,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Add summary information
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [""],
        ["Summary Information:"],
        [`Total E-Waste Items: ${total}`],
        [`Report Generated: ${new Date().toLocaleDateString()}`],
      ],
      { origin: -1 },
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "E-Waste Collection");
    XLSX.writeFile(
      workbook,
      `E-Waste_Collection_Report_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
    setShowExportDropdown(false);
  };

  useEffect(() => {
    ewasteAPI
      .getEwasteCounts()
      .then((res) => {
        const data = res.data;
        const labels = categoryLabels.map((c) => c.label);
        const backgroundColor = categoryLabels.map((c) => c.color);
        const chartData = categoryLabels.map((c) => data[c.key] || 0);

        setEwasteData({
          labels,
          datasets: [
            {
              data: chartData,
              backgroundColor,
              borderWidth: 0,
            },
          ],
        });
      })
      .catch((err) => {
        console.error("Failed to fetch ewaste data", err);
      });
  }, []);

  if (!ewasteData) return <div>Loading chart...</div>;

  const total = ewasteData.datasets[0].data.reduce((acc, val) => acc + val, 0);

  return (
    <div className="ewaste-card">
      <div className="ewaste-header">
        <h3>E-Waste Collected</h3>
        <div className="export-dropdown" ref={exportDropdownRef}>
          <button
            className="export-button"
            onClick={() => setShowExportDropdown(!showExportDropdown)}
            disabled={
              !ewasteData ||
              ewasteData.datasets[0].data.reduce((acc, val) => acc + val, 0) ===
                0
            }
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

      <div className="ewaste-content">
        <div className="ewaste-left">
          <div className="total-box">Total: {total}</div>
          <h4 className="legend-title">Legend:</h4>
          <div className="legend-grid">
            {ewasteData.labels.map((label, index) => (
              <div className="legend-item" key={label}>
                <span
                  className="legend-color"
                  style={{
                    backgroundColor:
                      ewasteData.datasets[0].backgroundColor[index],
                  }}
                ></span>
                <span className="legend-label">
                  {label}: {ewasteData.datasets[0].data[index]}
                </span>
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
                  color: "#ffffff",
                  formatter: (value, context) => {
                    const total = context.chart.data.datasets[0].data.reduce(
                      (a, b) => a + b,
                      0,
                    );
                    const percent = ((value / total) * 100).toFixed(1);
                    return `${percent}%`;
                  },
                  font: {
                    weight: "bold",
                    size: 12,
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <p className="card-note">
        This chart shows a breakdown of the total e-waste submissions
        categorized by type. Each category is color-coded in the pie chart and
        legend for quick reference.
      </p>
    </div>
  );
}
