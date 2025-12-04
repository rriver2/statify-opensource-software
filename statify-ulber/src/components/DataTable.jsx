import React, { useState, useMemo } from 'react';
import { sortData } from '../utils/filterUtils';
import { exportToCSV, exportToJSON } from '../utils/exportUtils';
import './DataTable.css';

const DataTable = ({ data, t }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [sortBy, setSortBy] = useState('Date');
  const [sortOrder, setSortOrder] = useState('desc');

  const sortedData = useMemo(() => {
    return sortData(data, sortBy, sortOrder);
  }, [data, sortBy, sortOrder]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'badge-success';
      case 'Cancelled by Customer':
      case 'Cancelled by Driver':
        return 'badge-warning';
      case 'Incomplete':
      case 'No Driver Found':
        return 'badge-error';
      default:
        return 'badge-default';
    }
  };

  const columns = [
    { key: 'Date', label: t?.date || 'Date' },
    { key: 'Time', label: t?.time || 'Time' },
    { key: 'Booking ID', label: t?.bookingId || 'Booking ID' },
    { key: 'Booking Status', label: t?.status || 'Status' },
    { key: 'Vehicle Type', label: t?.vehicle || 'Vehicle' },
    { key: 'Pickup Location', label: t?.pickup || 'Pickup' },
    { key: 'Drop Location', label: t?.drop || 'Drop' },
    { key: 'bookingValueUSD', label: t?.priceUSD || 'Price (USD)' },
    { key: 'rideDistance', label: t?.distanceKm || 'Distance (km)' },
    { key: 'driverRating', label: t?.driverRating || 'Driver Rating' },
    { key: 'customerRating', label: t?.customerRating || 'Customer Rating' },
    { key: 'Payment Method', label: t?.payment || 'Payment' }
  ];

  return (
    <div className="data-table-container">
      <div className="table-header">
        <h3>{t?.bookingData || 'Booking Data'} ({sortedData.length}{t?.records || ' records'})</h3>
        <div className="table-actions">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="items-per-page-select"
          >
            <option value={25}>25{t?.perPage || ' per page'}</option>
            <option value={50}>50{t?.perPage || ' per page'}</option>
            <option value={100}>100{t?.perPage || ' per page'}</option>
            <option value={200}>200{t?.perPage || ' per page'}</option>
          </select>
          <button
            onClick={() => exportToCSV(sortedData)}
            className="export-btn"
          >
            {t?.exportCSV || 'Export CSV'}
          </button>
          <button
            onClick={() => exportToJSON(sortedData)}
            className="export-btn"
          >
            {t?.exportJSON || 'Export JSON'}
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column.key)}
                  className="sortable"
                >
                  <div className="th-content">
                    {column.label}
                    {sortBy === column.key && (
                      <span className="sort-indicator">
                        {sortOrder === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.key === 'Booking Status' ? (
                      <span className={`badge ${getStatusBadgeClass(row[column.key])}`}>
                        {row[column.key]}
                      </span>
                    ) : column.key === 'bookingValueUSD' ||
                      column.key === 'rideDistance' ||
                      column.key === 'driverRating' ||
                      column.key === 'customerRating' ? (
                      row[column.key]?.toFixed(2) || '-'
                    ) : (
                      row[column.key] || '-'
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <div className="pagination-info">
          {t?.showing || 'Showing'} {startIndex + 1} {t?.to || 'to'} {Math.min(endIndex, sortedData.length)} {t?.of || 'of'} {sortedData.length} {t?.entries || 'entries'}
        </div>
        <div className="pagination">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            ««
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            ‹
          </button>

          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            ›
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            »»
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
