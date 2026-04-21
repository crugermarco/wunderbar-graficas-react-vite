import React, { useState } from 'react'
import './Tabs.css'

const Tabs = ({ tabs, defaultTab = 0, onTabChange, children }) => {
  const [activeTab, setActiveTab] = useState(defaultTab)

  const handleTabClick = (index) => {
    setActiveTab(index)
    if (onTabChange) onTabChange(index)
  }

  return (
    <div className="tabs-container">
      <div className="tabs-header">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab-button ${activeTab === index ? 'active' : ''}`}
            onClick={() => handleTabClick(index)}
          >
            {tab.icon && <tab.icon size={16} />}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs-content">
        {React.Children.map(children, (child, index) => (
          <div className={`tab-panel ${activeTab === index ? 'active' : ''}`}>
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Tabs