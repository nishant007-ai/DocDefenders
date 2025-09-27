// src/components/Viewer.jsx
import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const Viewer = ({ result, file, score }) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const zoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  const resetView = () => {
    setScale(1);
    setRotation(0);
  };

  const rotate = () => setRotation(prev => (prev + 90) % 360);

  // Mock document preview for demonstration
  const renderDocumentPreview = () => {
    if (file) {
      if (file.type.startsWith('image/')) {
        return (
          <img 
            src={URL.createObjectURL(file)} 
            alt="Document preview" 
            style={{ 
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              maxWidth: '100%',
              transition: 'transform 0.3s ease'
            }}
          />
        );
      } else if (file.type === 'application/pdf') {
        return (
          <div className="pdf-preview">
            <div className="pdf-placeholder">
              <FileText size={64} />
              <p>PDF Preview: {file.name}</p>
              <small>Actual PDF rendering would be implemented here</small>
            </div>
          </div>
        );
      }
    }
    
    return (
      <div className="no-document">
        <p>No document to display</p>
      </div>
    );
  };

  return (
    <div className="viewer-container">
      <div className="viewer-toolbar">
        <div className="toolbar-left">
          <button onClick={zoomIn} className="toolbar-btn">
            <ZoomIn size={16} />
          </button>
          <button onClick={zoomOut} className="toolbar-btn">
            <ZoomOut size={16} />
          </button>
          <button onClick={rotate} className="toolbar-btn">
            <RotateCcw size={16} />
          </button>
          <button onClick={resetView} className="toolbar-btn">
            Reset View
          </button>
        </div>
        <div className="toolbar-right">
          <span className="scale-display">Zoom: {(scale * 100).toFixed(0)}%</span>
        </div>
      </div>

      <div className="document-viewport">
        {renderDocumentPreview()}
      </div>

      {result && (
        <div className="viewer-overlays">
          <div className="heatmap-overlay">
            <div className="overlay-header">
              <h4>Anomaly Heatmap</h4>
              <div className="confidence-bar">
                <div 
                  className="confidence-fill"
                  style={{ width: `${(score || 0) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Viewer;