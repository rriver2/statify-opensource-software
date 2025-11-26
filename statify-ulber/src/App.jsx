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
  RevenueByVehicleChart
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
          <p>예약 데이터 로딩 중...</p>
          <p className="loading-subtitle">대용량 데이터의 경우 시간이 소요될 수 있습니다</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error">
          <h2>데이터 로딩 오류</h2>
          <p>{error}</p>
          <button onClick={loadData} className="retry-btn">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 데이터길이가 0일 때 메시지 출력
  const NoDataMessage = () => {
    return (
      <div className='no-data-meeage' style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: '12px', marginTop: '20px', border: '1px solid #e5e7eb' }} >
        <h3 style={{ color: '#ef4444', marginBottom: '10px' }}>데이터 없음</h3>
        <p style={{ color: '#4b5563' }}> 해당되는 데이터가 존재하지 않습니다. 필터를 조정하거나 초기화해 보세요.</p>
        <button onClick={handleResetFilters} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>
          필터 초기화
        </button>
      </div>
    )
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>예약 분석 대시보드</h1>
            <h3>팀: Statify</h3>
            <p className="subtitle">
              {rawData.length.toLocaleString()}개의 예약 기록 종합 분석
            </p>
          </div>
          <button onClick={loadData} className="refresh-btn" title="데이터 새로고침">
            ↻ 새로고침
          </button>
        </div>
      </header>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          개요
        </button>
        <button
          className={`tab ${activeTab === 'charts' ? 'active' : ''}`}
          onClick={() => setActiveTab('charts')}
        >
          차트
        </button>
        <button
          className={`tab ${activeTab === 'data' ? 'active' : ''}`}
          onClick={() => setActiveTab('data')}
        >
          데이터 테이블
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            availableOptions={availableOptions}
            onReset={handleResetFilters}
          />

          {filteredData.length === 0 ? NoDataMessage() : (
            <div className='stats-grid'>
              <StatsCard
                title="총 예약"
                value={stats.totalBookings.toLocaleString()}
                subtitle={`${stats.completedBookings.toLocaleString()}건 완료됨`}
                color="#3b82f6"
              />

              <StatsCard
                title="완료율"
                value={`${stats.completionRate}%`}
                subtitle="성공적으로 완료된 운행"
                color="#10b981"
              />

              <StatsCard
                title="취소율"
                value={`${stats.cancellationRate}%`}
                subtitle={`${stats.totalCancelled.toLocaleString()}건 총 취소`}
                color="#ef4444"
              />
              <StatsCard
                title="총 수익"
                value={`$${parseFloat(stats.totalRevenue).toLocaleString()}`}
                subtitle={`평균: $${stats.avgRevenue} 운행당`}
                color="#f59e0b"
              />
              <StatsCard
                title="평균 운전자 평점"
                value={stats.avgDriverRating}
                subtitle="5.0점 만점"
                color="#8b5cf6"
              />
              <StatsCard
                title="평균 고객 평점"
                value={stats.avgCustomerRating}
                subtitle="5.0점 만점"
                color="#ec4899"
              />
              <StatsCard
                title="총 거리"
                value={`${parseFloat(stats.totalDistance).toLocaleString()} km`}
                subtitle={`평균: ${stats.avgDistance} km 운행당`}
                color="#14b8a6"
              />
              <StatsCard
                title="고객 취소"
                value={stats.cancelledByCustomer.toLocaleString()}
                subtitle="고객 취소 건수"
                color="#f97316"
              />
              <StatsCard
                title="운전자 취소"
                value={stats.cancelledByDriver.toLocaleString()}
                subtitle="운전자 취소 건수"
                color="#ef4444"
              />
            </div>
          )}

          <div className="export-stats-section">
            <button
              onClick={() => exportStatsToCSV(stats)}
              className="export-stats-btn"
            >
              통계 내보내기
            </button>
          </div>
        </>
      )}

      {activeTab === 'overview' && (
        <>
          {filteredData.length === 0 ? 0 : (
            <div className="charts-grid">
              <BookingStatusChart data={chartData.bookingStatus} />
              <VehicleTypeChart data={chartData.vehicleType} />
              <PaymentMethodChart data={chartData.paymentMethod} />
              <RevenueByVehicleChart data={chartData.revenueByVehicle} />
            </div>
          )}
        </>
      )}

      {activeTab === 'charts' && (
        <>
          {filteredData.length === 0 ? NoDataMessage() : (
            <div className="charts-layout">
              <div className="charts-grid">
                <BookingStatusChart data={chartData.bookingStatus} />
                <VehicleTypeChart data={chartData.vehicleType} />
                <PaymentMethodChart data={chartData.paymentMethod} />
                <BookingsByHourChart data={chartData.bookingsByHour} />
                <TopLocationsChart
                  data={chartData.topDropLocations}
                  title="상위 10개 도착 위치"
                />

                <TopLocationsChart
                  data={chartData.topPickupLocations}
                  title="상위 10개 픽업 위치"
                />

              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'data' && <DataTable data={filteredData} />}

      <footer className="app-footer">
        <p>
          {rawData.length.toLocaleString()}개 중 {filteredData.length.toLocaleString()}개의 예약 표시
        </p>
        <p>Statify 예약 분석 대시보드 © 2025</p>
      </footer>
    </div>
  );
}

export default App;
