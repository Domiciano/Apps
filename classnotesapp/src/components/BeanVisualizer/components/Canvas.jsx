import React from "react";

export default function Canvas({
  zoom,
  canvasWidth,
  handleMouseDown,
  handleMouseUp,
  handleMouseMove,
  canvasRef,
  MIN_ZOOM,
  MAX_ZOOM,
  setZoom,
  CANVAS_HEIGHT,
  dragging: isDragging
}) {
  return (
    <div style={{ width: "100%", marginTop: 0, marginBottom: 16 }}>
      <div style={{ position: "relative", width: "100%", maxWidth: "100%", boxSizing: "border-box", display: 'block' }}>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={CANVAS_HEIGHT}
          style={{
            border: "none",
            background: "#22223b",
            borderRadius: 12,
            boxShadow: "0 2px 12px #0004",
            width: "100%",
            minWidth: 0,
            maxWidth: "100%",
            height: CANVAS_HEIGHT,
            cursor: isDragging ? "grabbing" : "grab",
            display: "block",
            boxSizing: "border-box"
          }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          tabIndex={0}
        />
        {/* Slider de zoom flotante */}
        <div style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 2,
          background: "rgba(34,34,59,0.7)",
          borderRadius: 10,
          padding: "8px 4px",
          boxShadow: "0 1px 4px #0004"
        }}>
          <input
            type="range"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            orient="vertical"
            style={{
              writingMode: "bt-lr",
              WebkitAppearance: "slider-vertical",
              width: 6,
              height: 80,
              background: "#444",
              borderRadius: 6,
              outline: "none",
              accentColor: "#27ae60",
              margin: 0,
              cursor: "pointer"
            }}
            aria-label="Zoom"
          />
          <span style={{ color: "#f8f7ff", fontSize: 12, marginTop: 4, fontFamily: 'monospace', opacity: 0.8 }}>{zoom.toFixed(2)}x</span>
        </div>
      </div>
    </div>
  );
} 