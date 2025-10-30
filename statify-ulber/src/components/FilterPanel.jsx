import React, { useState } from 'react';
import './FilterPanel.css';

const FilterPanel = ({
  filters,
  onFiltersChange,
  availableOptions,
  onReset
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleMultiSelectChange = (field, value) => {
    const currentValues = filters[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    onFiltersChange({ ...filters, [field]: newValues });
  };

  const handleInputChange = (field, value) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  const isChecked = (field, value) => {
    return (filters[field] || []).includes(value);
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>Filters</h3>
        <div className="filter-actions">
          <button onClick={onReset} className="btn-reset">
            Reset All
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn-toggle"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="filter-content">
          {/* Search */}
          <div className="filter-section">
            <label className="filter-label">Search</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Search by ID, location, vehicle..."
              value={filters.searchText || ''}
              onChange={(e) => handleInputChange('searchText', e.target.value)}
            />
          </div>

          {/* Date Range */}
          <div className="filter-section">
            <label className="filter-label">Date Range</label>
            <div className="date-range">
              <input
                type="date"
                className="filter-input"
                value={filters.startDate || ''}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
              />
              <span>to</span>
              <input
                type="date"
                className="filter-input"
                value={filters.endDate || ''}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
              />
            </div>
          </div>

          {/* Booking Status */}
          <div className="filter-section">
            <label className="filter-label">Booking Status</label>
            <div className="checkbox-group">
              {availableOptions.bookingStatuses?.map(status => (
                <label key={status} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isChecked('bookingStatuses', status)}
                    onChange={() => handleMultiSelectChange('bookingStatuses', status)}
                  />
                  <span>{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Vehicle Type */}
          <div className="filter-section">
            <label className="filter-label">Vehicle Type</label>
            <div className="checkbox-group">
              {availableOptions.vehicleTypes?.map(type => (
                <label key={type} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isChecked('vehicleTypes', type)}
                    onChange={() => handleMultiSelectChange('vehicleTypes', type)}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="filter-section">
            <label className="filter-label">Payment Method</label>
            <div className="checkbox-group">
              {availableOptions.paymentMethods?.map(method => (
                <label key={method} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isChecked('paymentMethods', method)}
                    onChange={() => handleMultiSelectChange('paymentMethods', method)}
                  />
                  <span>{method}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Filters */}
          <div className="filter-section">
            <label className="filter-label">Minimum Driver Rating</label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={filters.minDriverRating || 0}
              onChange={(e) => handleInputChange('minDriverRating', parseFloat(e.target.value))}
              className="filter-range"
            />
            <span className="range-value">{filters.minDriverRating || 0}</span>
          </div>

          <div className="filter-section">
            <label className="filter-label">Minimum Customer Rating</label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={filters.minCustomerRating || 0}
              onChange={(e) => handleInputChange('minCustomerRating', parseFloat(e.target.value))}
              className="filter-range"
            />
            <span className="range-value">{filters.minCustomerRating || 0}</span>
          </div>

          {/* Distance Range */}
          <div className="filter-section">
            <label className="filter-label">Distance Range (km)</label>
            <div className="range-inputs">
              <input
                type="number"
                placeholder="Min"
                className="filter-input small"
                value={filters.minDistance || ''}
                onChange={(e) => handleInputChange('minDistance', e.target.value ? parseFloat(e.target.value) : '')}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                className="filter-input small"
                value={filters.maxDistance || ''}
                onChange={(e) => handleInputChange('maxDistance', e.target.value ? parseFloat(e.target.value) : '')}
              />
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-section">
            <label className="filter-label">Price Range (USD)</label>
            <div className="range-inputs">
              <input
                type="number"
                placeholder="Min"
                className="filter-input small"
                value={filters.minPrice || ''}
                onChange={(e) => handleInputChange('minPrice', e.target.value ? parseFloat(e.target.value) : '')}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                className="filter-input small"
                value={filters.maxPrice || ''}
                onChange={(e) => handleInputChange('maxPrice', e.target.value ? parseFloat(e.target.value) : '')}
              />
            </div>
          </div>

          {/* Top Pickup Locations */}
          <div className="filter-section">
            <label className="filter-label">Pickup Locations (Top 10)</label>
            <div className="checkbox-group scrollable">
              {availableOptions.pickupLocations?.slice(0, 10).map(location => (
                <label key={location} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isChecked('pickupLocations', location)}
                    onChange={() => handleMultiSelectChange('pickupLocations', location)}
                  />
                  <span>{location}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Top Drop Locations */}
          <div className="filter-section">
            <label className="filter-label">Drop Locations (Top 10)</label>
            <div className="checkbox-group scrollable">
              {availableOptions.dropLocations?.slice(0, 10).map(location => (
                <label key={location} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isChecked('dropLocations', location)}
                    onChange={() => handleMultiSelectChange('dropLocations', location)}
                  />
                  <span>{location}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
