import React from "react";

export default function TabSelector({ onJavaClick, onXmlClick }) {
  return (
    <div style={{
      display: 'flex',
      marginBottom: '8px',
      gap: '8px'
    }}>
      <button
        onClick={onJavaClick}
        style={{
          padding: '10px 20px',
          background: '#28a745',
          color: 'white',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          borderRadius: '6px',
          transition: 'all 0.2s ease',
          border: 'none',
          boxShadow: '0 2px 4px rgba(40, 167, 69, 0.3)'
        }}
      >
        Java
      </button>
      <button
        onClick={onXmlClick}
        style={{
          padding: '10px 20px',
          background: '#28a745',
          color: 'white',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          borderRadius: '6px',
          transition: 'all 0.2s ease',
          border: 'none',
          boxShadow: '0 2px 4px rgba(40, 167, 69, 0.3)'
        }}
      >
        XML
      </button>
    </div>
  );
} 