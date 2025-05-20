import React from 'react';
import "./styles/Logs.css";

export default function Logs({ submissionLogs, type = "ewaste", showTitle = true }) {
  const getTitle = () => {
    return type === "ewaste" ? "E-Waste Submissions" : "Redemption History";
  };

  return (
    <div className="log-container">
      {showTitle && (
        <div className="recent-title-container">
          <h2>{getTitle()}</h2>
        </div>
      )}

      <div className="recent-activity-container">
        <h2>Recent</h2>
        <ul className="activity-list">
          {submissionLogs.length > 0 ? submissionLogs.map((activity) => (
            <li key={activity._id} className="activity-item">
              {type === "ewaste" ? (
                <>
                  <span className="activity-id">Submission ID: {activity._id}</span>
                  <span className="activity-status">Category: {activity.category}</span>
                  <span className="activity-date">{new Date(activity.createdAt).toLocaleString()}</span>
                  <span className={`activity-result ${activity.status?.toLowerCase()}`}>Status: {activity.status || "Pending"}</span>
                </>
              ) : (
                <>
                  <span className="activity-result">{activity.category}</span>
                  <span className="activity-date">{new Date(activity.createdAt).toLocaleString()}</span>
                </>
              )}
            </li>
          )) : (
            <li>No {type === "ewaste" ? "submissions" : "redemptions"} yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
