import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import { loadBookingData, getUniqueValues } from './utils/dataLoader';
import { applyFilters } from './utils/filterUtils';
import {
  calculateStats,
  getBookingsByStatus,
  getBookingsByVehicleType,
  getBookingsByPaymentMethod,
  getBookingsByHour,
  getTopLocations,
  getRevenueByVehicleType,
  getBookingsByDate
} from './utils/statsUtils';
import { exportStatsToCSV } from './utils/exportUtils';

import StatsCard from './components/StatsCard';
import FilterPanel from './components/FilterPanel';
import DataTable from './components/DataTable';
import {
  BookingStatusChart,
  VehicleTypeChart,
  PaymentMethodChart,
  BookingsByHourChart,
  TopLocationsChart,
  RevenueByVehicleChart,
  BookingsTrendChart
} from './components/Charts';

function App() {
  const [rawData, setRawData] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await loadBookingData();
      setRawData(data);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load booking data. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredData = useMemo(() => {
    return applyFilters(rawData, filters);
  }, [rawData, filters]);

  const stats = useMemo(() => {
    return calculateStats(filteredData);
  }, [filteredData]);

  const chartData = useMemo(() => {
    return {
      bookingStatus: getBookingsByStatus(filteredData),
      vehicleType: getBookingsByVehicleType(filteredData),
      paymentMethod: getBookingsByPaymentMethod(filteredData),
      bookingsByHour: getBookingsByHour(filteredData),
      topPickupLocations: getTopLocations(filteredData, 'pickup', 10),
      topDropLocations: getTopLocations(filteredData, 'drop', 10),
      revenueByVehicle: getRevenueByVehicleType(filteredData),
      bookingsTrend: getBookingsByDate(filteredData)
    };
  }, [filteredData]);

  const availableOptions = useMemo(() => {
    return {
      bookingStatuses: getUniqueValues(rawData, 'Booking Status'),
      vehicleTypes: getUniqueValues(rawData, 'Vehicle Type'),
      paymentMethods: getUniqueValues(rawData, 'Payment Method'),
      pickupLocations: getUniqueValues(rawData, 'Pickup Location'),
      dropLocations: getUniqueValues(rawData, 'Drop Location')
    };
  }, [rawData]);

  const handleResetFilters = () => {
    setFilters({});
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading booking data...</p>
          <p className="loading-subtitle">This may take a moment for large datasets</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error">
          <h2>Error loading data</h2>
          <p>{error}</p>
          <button onClick={loadData} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>Booking Analytics Dashboard</h1>
            <p className="subtitle">
              Comprehensive analysis of {rawData.length.toLocaleString()} booking records
            </p>
          </div>
          <button onClick={loadData} className="refresh-btn" title="Refresh data">
            ↻ Refresh
          </button>
        </div>
      </header>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'charts' ? 'active' : ''}`}
          onClick={() => setActiveTab('charts')}
        >
          Charts
        </button>
        <button
          className={`tab ${activeTab === 'data' ? 'active' : ''}`}
          onClick={() => setActiveTab('data')}
        >
          Data Table
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="stats-grid">
            <StatsCard
              title="Total Bookings"
              value={stats.totalBookings.toLocaleString()}
              subtitle={`${stats.completedBookings.toLocaleString()} completed`}
              color="#3b82f6"
            />
            <StatsCard
              title="Completion Rate"
              value={`${stats.completionRate}%`}
              subtitle="Successfully completed rides"
              color="#10b981"
            />
            <StatsCard
              title="Cancellation Rate"
              value={`${stats.cancellationRate}%`}
              subtitle={`${stats.totalCancelled.toLocaleString()} total cancelled`}
              color="#ef4444"
            />
            <StatsCard
              title="Total Revenue"
              value={`$${parseFloat(stats.totalRevenue).toLocaleString()}`}
              subtitle={`Avg: $${stats.avgRevenue} per ride`}
              color="#f59e0b"
            />
            <StatsCard
              title="Avg Driver Rating"
              value={stats.avgDriverRating}
              subtitle="Out of 5.0"
              color="#8b5cf6"
            />
            <StatsCard
              title="Avg Customer Rating"
              value={stats.avgCustomerRating}
              subtitle="Out of 5.0"
              color="#ec4899"
            />
            <StatsCard
              title="Total Distance"
              value={`${parseFloat(stats.totalDistance).toLocaleString()} km`}
              subtitle={`Avg: ${stats.avgDistance} km per ride`}
              color="#14b8a6"
            />
            <StatsCard
              title="Cancelled by Customer"
              value={stats.cancelledByCustomer.toLocaleString()}
              subtitle="Customer cancellations"
              color="#f97316"
            />
            <StatsCard
              title="Cancelled by Driver"
              value={stats.cancelledByDriver.toLocaleString()}
              subtitle="Driver cancellations"
              color="#ef4444"
            />
          </div>

          <div className="export-stats-section">
            <button
              onClick={() => exportStatsToCSV(stats)}
              className="export-stats-btn"
            >
              Export Statistics
            </button>
          </div>

          <div className="charts-grid">
            <BookingStatusChart data={chartData.bookingStatus} />
            <VehicleTypeChart data={chartData.vehicleType} />
            <PaymentMethodChart data={chartData.paymentMethod} />
            <RevenueByVehicleChart data={chartData.revenueByVehicle} />
          </div>
        </>
      )}

      {activeTab === 'charts' && (
        
        <div className="charts-layout">
          <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          availableOptions={availableOptions}
          onReset={handleResetFilters}
          />
          <div className="charts-grid">
            <BookingStatusChart data={chartData.bookingStatus} />
            <VehicleTypeChart data={chartData.vehicleType} />
            <PaymentMethodChart data={chartData.paymentMethod} />
            <BookingsByHourChart data={chartData.bookingsByHour} />
            <TopLocationsChart
              data={chartData.topDropLocations}
              title="Top 10 Drop Locations"
            />

            <TopLocationsChart
              data={chartData.topDropLocations}
              title="Top 10 Pickup Locations"
            />
            
          </div>
        </div>
      )}

      {activeTab === 'data' && <DataTable data={filteredData} />}

      <footer className="app-footer">
        <p>
          Showing {filteredData.length.toLocaleString()} of {rawData.length.toLocaleString()} bookings
        </p>
        <p>Statify Booking Analytics Dashboard © 2025</p>
      </footer>
    </div>
  );
}

export default App;
