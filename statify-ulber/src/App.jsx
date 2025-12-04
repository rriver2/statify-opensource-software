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
import { translations } from './utils/translations';

import StatsCard from './components/StatsCard';
import FilterPanel from './components/FilterPanel';
import DataTable from './components/DataTable';
import {
  BookingStatusChart,
  VehicleTypeChart,
  PaymentMethodChart,
  BookingsByHourChart,
  TopLocationsChart,
  RevenueByVehicleChart
} from './components/Charts';

function App() {
  const [rawData, setRawData] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [lang, setLang] = useState('ko');

  const t = translations[lang];

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
          <p>{t.loadingData}</p>
          <p className="loading-subtitle">{t.loadingSubtitle}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error">
          <h2>{t.loadError}</h2>
          <p>{error}</p>
          <button onClick={loadData} className="retry-btn">
            {t.retry}
          </button>
        </div>
      </div>
    );
  }

  // 데이터길이가 0일 때 메시지 출력
  const NoDataMessage = () => {
    return (
      <div className='no-data-meeage' style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: '12px', marginTop: '20px', border: '1px solid #e5e7eb' }} >
        <h3 style={{ color: '#ef4444', marginBottom: '10px' }}>{t.noData}</h3>
        <p style={{ color: '#4b5563' }}>{t.noDataMessage}</p>
        <button onClick={handleResetFilters} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>
          {t.resetFilters}
        </button>
      </div>
    )
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>{t.dashboardTitle}</h1>
            <h3>{t.teamName}</h3>
            <p className="subtitle">
              {rawData.length.toLocaleString()}{t.recordsAnalysis}
            </p>
          </div>
          <div className="header-actions">
            <button
              onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')}
              className="lang-toggle-btn"
              title={lang === 'ko' ? 'Switch to English' : '한국어로 변경'}
            >
              {lang === 'ko' ? '한' : 'EN'}
            </button>
            <button onClick={loadData} className="refresh-btn" title={t.refresh}>
              ↻ {t.refresh}
            </button>
          </div>
        </div>
      </header>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          {t.overview}
        </button>
        <button
          className={`tab ${activeTab === 'charts' ? 'active' : ''}`}
          onClick={() => setActiveTab('charts')}
        >
          {t.charts}
        </button>
        <button
          className={`tab ${activeTab === 'data' ? 'active' : ''}`}
          onClick={() => setActiveTab('data')}
        >
          {t.dataTable}
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            availableOptions={availableOptions}
            onReset={handleResetFilters}
            t={t}
          />

          {filteredData.length === 0 ? NoDataMessage() : (
            <div className='stats-grid'>
              <StatsCard
                title={t.totalBookings}
                value={stats.totalBookings.toLocaleString()}
                subtitle={`${stats.completedBookings.toLocaleString()}${t.completed}`}
                color="#3b82f6"
              />

              <StatsCard
                title={t.completionRate}
                value={`${stats.completionRate}%`}
                subtitle={t.successfulRides}
                color="#10b981"
              />

              <StatsCard
                title={t.cancellationRate}
                value={`${stats.cancellationRate}%`}
                subtitle={`${stats.totalCancelled.toLocaleString()}${t.totalCancelled}`}
                color="#ef4444"
              />
              <StatsCard
                title={t.totalRevenue}
                value={`$${parseFloat(stats.totalRevenue).toLocaleString()}`}
                subtitle={`${lang === 'ko' ? '평균' : 'Avg'}: $${stats.avgRevenue} ${t.avgPerRide}`}
                color="#f59e0b"
              />
              <StatsCard
                title={t.avgDriverRating}
                value={stats.avgDriverRating}
                subtitle={t.outOf5}
                color="#8b5cf6"
              />
              <StatsCard
                title={t.avgCustomerRating}
                value={stats.avgCustomerRating}
                subtitle={t.outOf5}
                color="#ec4899"
              />
              <StatsCard
                title={t.totalDistance}
                value={`${parseFloat(stats.totalDistance).toLocaleString()} km`}
                subtitle={`${lang === 'ko' ? '평균' : 'Avg'}: ${stats.avgDistance} km ${t.perRide}`}
                color="#14b8a6"
              />
              <StatsCard
                title={t.customerCancelled}
                value={stats.cancelledByCustomer.toLocaleString()}
                subtitle={t.customerCancelledCount}
                color="#f97316"
              />
              <StatsCard
                title={t.driverCancelled}
                value={stats.cancelledByDriver.toLocaleString()}
                subtitle={t.driverCancelledCount}
                color="#ef4444"
              />
            </div>
          )}

          <div className="export-stats-section">
            <button
              onClick={() => exportStatsToCSV(stats)}
              className="export-stats-btn"
            >
              {t.exportStats}
            </button>
          </div>
        </>
      )}

      {activeTab === 'overview' && (
        <>
          {filteredData.length === 0 ? 0 : (
            <div className="overview-charts-grid">
              <BookingStatusChart data={chartData.bookingStatus} t={t} />
              <VehicleTypeChart data={chartData.vehicleType} t={t} />
              <PaymentMethodChart data={chartData.paymentMethod} t={t} />
              <RevenueByVehicleChart data={chartData.revenueByVehicle} t={t} />
            </div>
          )}
        </>
      )}

      {activeTab === 'charts' && (
        <>
          {filteredData.length === 0 ? NoDataMessage() : (
            <div className="charts-layout">
              <div className="charts-grid">
                <BookingStatusChart data={chartData.bookingStatus} t={t} />
                <VehicleTypeChart data={chartData.vehicleType} t={t} />
                <PaymentMethodChart data={chartData.paymentMethod} t={t} />
                <BookingsByHourChart data={chartData.bookingsByHour} t={t} />
                <TopLocationsChart
                  data={chartData.topDropLocations}
                  title={t.topDropLocations}
                />

                <TopLocationsChart
                  data={chartData.topPickupLocations}
                  title={t.topPickupLocations}
                />

              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'data' && <DataTable data={filteredData} t={t} />}

      <footer className="app-footer">
        <p>
          {rawData.length.toLocaleString()}{t.showingOf} {filteredData.length.toLocaleString()}{t.bookingsDisplayed}
        </p>
        <p>{t.copyright}</p>
      </footer>
    </div>
  );
}

export default App;
