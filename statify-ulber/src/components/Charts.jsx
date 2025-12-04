import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './Charts.css';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export const BookingStatusChart = React.memo(({ data, t }) => {
  return (
    <div className="chart-container">
<h3 className="chart-title">{t?.bookingStatusDist || '예약 상태 분포'}</h3>
      <ResponsiveContainer width="100%" height={500}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
});

export const VehicleTypeChart = React.memo(({ data, t }) => {
  return (
    <div className="chart-container">
<h3 className="chart-title">{t?.bookingsByVehicle || '차량 유형별 예약'}</h3>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

export const PaymentMethodChart = React.memo(({ data, t }) => {
  return (
    <div className="chart-container">
 <h3 className="chart-title">{t?.paymentMethodDist || '결제 수단 분포'}</h3>
      <ResponsiveContainer width="100%" height={500}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
});

export const BookingsByHourChart = React.memo(({ data, t }) => {
  return (
    <div className="chart-container">
      <h3 className="chart-title">{t?.bookingsByHour || '시간대별 예약'}</h3>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

export const TopLocationsChart = React.memo(({ data, title }) => {
  return (
    <div className="chart-container">
      <h3 className="chart-title">{title}</h3>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="location" width={120} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

export const RevenueByVehicleChart = React.memo(({ data, t }) => {
  return (
    <div className="chart-container">
<h3 className="chart-title">{t?.revenueByVehicle || '차량 유형별 수익 (USD)'}</h3>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#f59e0b" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

export const BookingsTrendChart = React.memo(({ data, t }) => {
  // Take only first 30 dates for better visualization
  const limitedData = data.slice(0, 30);

  return (
    <div className="chart-container wide">
      <h3 className="chart-title">{t?.bookingsTrend || '예약 추이 (최근 30일)'}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={limitedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

