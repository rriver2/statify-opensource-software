import React, { useState } from 'react';
import './FilterPanel.css';

const FilterPanel = React.memo(({
  filters,
  onFiltersChange,
  availableOptions,
  onReset
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const minDistanceValidity = (value) => {
    const maxDistance = filters.maxDistance;

    if (!maxDistance && maxDistance !== 0) {
      return value;
    }

    if (value > maxDistance) {
      return maxDistance;
    }

    return value;
  };

  const maxDistanceValidity = (value) => {
    const minDistance = filters.minDistance;

    if (!minDistance && minDistance !== 0) {
      return value;
    }

    if (value < minDistance) {
      return minDistance;
    }

    return value;
  }

  const minPriceValidity = (value) => {
    const maxPrice = filters.maxPrice;

    if (!maxPrice && maxPrice !== 0) {
      return value;
    }

    if (value > maxPrice) {
      return maxPrice;
    }

    return value;
  };

  const maxPriceValidity = (value) => {
    const minPrice = filters.minPrice;

    if (!minPrice && minPrice !== 0) {
      return value;
    }

    if (value < minPrice) {
      return minPrice;
    }

    return value;
  }

  // Count active filters
  const activeFilterCount = Object.keys(filters).reduce((count, key) => {
    const value = filters[key];
    if (!value) return count;
    if (Array.isArray(value) && value.length === 0) return count;
    if (typeof value === 'string' && value === '') return count;
    if (typeof value === 'number' && value === 0 && !['minDistance', 'minPrice', 'minDriverRating', 'minCustomerRating'].includes(key)) return count;
    return count + 1;
  }, 0);

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

  const setDatePreset = (preset) => {
    {/* changed today variable's criteria */ }
    const today = new Date(filters.endDate);
    const dateStr = date => date.toISOString().split('T')[0];
    switch (preset) {
      case 'last7':
        const last7 = new Date(today);
        last7.setDate(today.getDate() - 7);
        onFiltersChange({
          ...filters,
          startDate: dateStr(last7),
          endDate: dateStr(today)
        });
        break;
      case 'last30':
        const last30 = new Date(today);
        last30.setDate(today.getDate() - 30);
        onFiltersChange({
          ...filters,
          startDate: dateStr(last30),
          endDate: dateStr(today)
        });
        break;
      case 'all':
        const newFilters = { ...filters };
        delete newFilters.startDate;
        delete newFilters.endDate;
        onFiltersChange({
          ...filters,
          startDate: "2023-12-31",
          endDate: "2024-12-31"
        });
        break;
    }
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>
          필터
          {activeFilterCount > 0 && (
            <span className="filter-badge">{activeFilterCount}</span>
          )}
        </h3>
        <div className="filter-actions">
          <button onClick={onReset} className="btn-reset">
            전체 초기화
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
            <label className="filter-label">검색</label>
            <input
              type="text"
              className="filter-input"
              placeholder="ID, 위치, 차량으로 검색..."
              value={filters.searchText || ''}
              onChange={(e) => handleInputChange('searchText', e.target.value)}
            />
          </div>

          {/* Date Range */}
          <div className="filter-section">
            <label className="filter-label">날짜 범위</label>
            <div className="date-presets">
              <button
                onClick={() => setDatePreset('last7')}
                className="preset-btn"
              >
                최근 7일
              </button>
              <button
                onClick={() => setDatePreset('last30')}
                className="preset-btn"
              >
                최근 30일
              </button>
              <button
                onClick={() => setDatePreset('all')}
                className="preset-btn"
              >
                전체 기간
              </button>
            </div>
            <div className="date-range">
              <input
                type="date"
                className="filter-input"
                value={filters.startDate || ''}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                min="2024-01-01"
                max="2024-12-31"
              />
              <span>~</span>
              <input
                type="date"
                className="filter-input"
                value={filters.endDate || ''}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                min="2024-01-01"
                max="2024-12-31"
              />
            </div>
          </div>

          {/* Booking Status */}
          <div className="filter-section">
            <label className="filter-label">예약 상태</label>
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
            <label className="filter-label">차량 유형</label>
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
            <label className="filter-label">결제 수단</label>
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
            <label className="filter-label">최소 운전자 평점</label>
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
            <label className="filter-label">최소 고객 평점</label>
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
            <label className="filter-label">거리 범위 (km)</label>
            <div className="range-inputs">
              <input
                type="number"
                placeholder="최소"
                className="filter-input small"
                value={filters.minDistance || ''}
                min={0}
                max={50}
                onChange={(e) =>
                  handleInputChange(
                    'minDistance', parseFloat(e.target.value) > 0 ? minDistanceValidity(parseFloat(e.target.value)) : ''
                  )
                }
              />
              <span>-</span>
              <input
                type="number"
                placeholder="최대"
                className="filter-input small"
                value={filters.maxDistance || ''}
                min={0}
                max={50}
                onChange={(e) =>
                  handleInputChange(
                    'maxDistance', parseFloat(e.target.value) > 0 ? maxDistanceValidity(parseFloat(e.target.value)) : '')
                }
              />
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-section">
            <label className="filter-label">가격 범위 (USD)</label>
            <div className="range-inputs">
              <input
                type="number"
                placeholder="최소"
                className="filter-input small"
                value={filters.minPrice || ''}
                onChange={(e) =>
                  handleInputChange(
                    'minPrice', parseFloat(e.target.value) > 0 ? minPriceValidity(parseFloat(e.target.value)) : '')
                }
              />
              <span>-</span>
              <input
                type="number"
                placeholder="최대"
                className="filter-input small"
                value={filters.maxPrice || ''}
                onChange={(e) => handleInputChange(
                  'maxPrice', parseFloat(e.target.value) ? maxPriceValidity(parseFloat(e.target.value)) : '')
                }
              />
            </div>
          </div>

          {/* Top Pickup Locations */}
          <div className="filter-section">
            <label className="filter-label">픽업 위치 (상위 10개)</label>
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
            <label className="filter-label">도착 위치 (상위 10개)</label>
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
});

FilterPanel.displayName = 'FilterPanel';

export default FilterPanel;
