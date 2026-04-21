import React from 'react'
import GlassCard from './GlassCard'
import './TopList.css'

const TopList = ({ title, data, valueLabel = 'registros', maxHeight = 400 }) => {
  const getMedalColor = (index) => {
    switch(index) {
      case 0: return { bg: 'rgba(255, 215, 0, 0.15)', border: '#ffd700' }
      case 1: return { bg: 'rgba(192, 192, 192, 0.15)', border: '#c0c0c0' }
      case 2: return { bg: 'rgba(205, 127, 50, 0.15)', border: '#cd7f32' }
      default: return { bg: 'transparent', border: 'rgba(71, 85, 105, 0.3)' }
    }
  }

  return (
    <GlassCard className="top-list-wrapper">
      {title && <h3 className="top-list-title">{title}</h3>}
      <div className="top-list" style={{ maxHeight: `${maxHeight}px` }}>
        {data.map((item, index) => {
          const medal = getMedalColor(index)
          return (
            <div 
              key={index}
              className="top-item"
              style={{
                background: medal.bg,
                borderLeftColor: medal.border,
                animationDelay: `${index * 0.05}s`
              }}
            >
              <div className="rank" style={{ color: index < 3 ? medal.border : '#10b981' }}>
                #{index + 1}
              </div>
              <div className="item-name">{item.nombre || item.maquina || item.usuario || item.area}</div>
              <div className="item-count">
                {item.count} {valueLabel}
              </div>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}

export default TopList