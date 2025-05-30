import React from 'react';
import './styles/BinTable.css';

const COLUMN_LABELS = {
  binId: 'Bin ID',
  binName: 'Bin Name',
  location: 'Location',
  status: 'Status',
  category: 'Category',
  lastUpdated: 'Last Updated',
  action: 'Action'
};

const BinTable = ({ columns, data, maxHeight = '220px' }) => {
  return (
    <div className="bin-table-container">
      
      <div className="table-wrapper" style={{ maxHeight }}>
        <table className="bin-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{COLUMN_LABELS[col] || col}</th>
              ))}
            </tr>
          </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="no-data">
                    No bins to display. Try adding one!
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => (
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col}>{row[col]}</td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default BinTable;
