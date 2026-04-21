import React from 'react'
import GlassCard from './GlassCard'
import './StatCard.css'

const StatCard = ({ title, value, subtitle, icon: Icon, color = '#10b981', trend = null }) => {
  return (
    <GlassCard shimmer className="stat-card-wrapper">
      <div className="stat-card">
        {Icon && (
          <div className="stat-icon" style={{ background: `${color}20`, color: color }}>
            <Icon size={24} />
          </div>
        )}
        <div className="stat-content">
          <h4 className="stat-title">{title}</h4>
          <div className="stat-value" style={{ color: color }}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          {subtitle && <p className="stat-subtitle">{subtitle}</p>}
          {trend && (
            <div className={`stat-trend ${trend > 0 ? 'positive' : 'negative'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  )
}

export default StatCard