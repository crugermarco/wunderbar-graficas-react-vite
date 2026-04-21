import React from 'react'
import './GlassCard.css'

const GlassCard = ({ 
  children, 
  shimmer = false, 
  negative = false, 
  className = '', 
  style = {},
  onClick = null 
}) => {
  const cardClasses = [
    'glass-card',
    shimmer ? 'shimmer-border' : '',
    negative ? 'negative-shimmer' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <div 
      className={cardClasses} 
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default GlassCard