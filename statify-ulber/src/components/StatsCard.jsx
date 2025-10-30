import React from 'react';
import './StatsCard.css';

const StatsCard = ({ title, value, subtitle, icon, color = '#3b82f6' }) => {
  return (
    <div className="stats-card" style={{ borderLeftColor: color }}>
      <div className="stats-card-header">
        <div className="stats-card-title">{title}</div>
        {icon && <div className="stats-card-icon">{icon}</div>}
      </div>
      <div className="stats-card-value">{value}</div>
      {subtitle && <div className="stats-card-subtitle">{subtitle}</div>}
    </div>
  );
};

export default StatsCard;
