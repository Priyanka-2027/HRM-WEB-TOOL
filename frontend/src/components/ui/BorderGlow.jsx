import React from 'react';
import './BorderGlow.css';

const BorderGlow = ({
  children,
  className = '',
  borderRadius = 28,
  backgroundColor = 'rgba(15, 17, 26, 0.5)',
}) => {
  return (
    <div
      className={`glass-card ${className}`}
      style={{
        '--card-bg': backgroundColor,
        '--border-radius': `${borderRadius}px`,
      }}
    >
      <div className="glass-card-inner">
        {children}
      </div>
    </div>
  );
};

export default BorderGlow;
