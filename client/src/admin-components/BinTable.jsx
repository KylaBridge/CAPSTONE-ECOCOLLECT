import React from 'react';
import './styles/BinTable.css';

const COLUMN_LABELS = {
  binId: 'Bin ID',
  binName: 'Bin Name',
  location: 'Location',
  status: 'Status',
  category: 'Category',
};

const BinTable = ({ columns, data }) => {
  return (
    <div className="bin-table-container">
      
      <div className="table-wrapper">
        <table className="bin-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{COLUMN_LABELS[col] || col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={col}>
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BinTable;
