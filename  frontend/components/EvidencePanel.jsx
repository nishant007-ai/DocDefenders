// src/components/EvolutionPanel.jsx
import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

const EvolutionPanel = ({ evidence }) => {
  const getEvidenceIcon = (type, score) => {
    if (score > 0.8) return <CheckCircle size={16} className="evidence-success" />;
    if (score > 0.5) return <AlertTriangle size={16} className="evidence-warning" />;
    return <XCircle size={16} className="evidence-error" />;
  };

  const getEvidenceStatus = (score) => {
    if (score > 0.8) return 'PASS';
    if (score > 0.5) return 'SUSPICIOUS';
    return 'FAIL';
  };

  const getEvidenceColor = (score) => {
    if (score > 0.8) return 'var(--secondary-green)';
    if (score > 0.5) return 'var(--secondary-yellow)';
    return 'var(--secondary-red)';
  };

  if (!evidence || evidence.length === 0) {
    return (
      <div className="evolution-panel">
        <div className="panel-header">
          <h3>Analysis Evidence</h3>
        </div>
        <div className="no-evidence">
          <Info size={24} />
          <p>No analysis evidence available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="evolution-panel">
      <div className="panel-header">
        <h3>Forensic Analysis Evidence</h3>
        <span className="evidence-count">{evidence.length} checks performed</span>
      </div>

      <div className="evidence-list">
        {evidence.map((item, index) => (
          <div key={index} className="evidence-item">
            <div className="evidence-icon">
              {getEvidenceIcon(item.type, item.similarity || item.score || 0)}
            </div>
            
            <div className="evidence-content">
              <div className="evidence-header">
                <span className="evidence-type">{item.type.toUpperCase()}</span>
                <span 
                  className="evidence-status"
                  style={{ color: getEvidenceColor(item.similarity || item.score || 0) }}
                >
                  {getEvidenceStatus(item.similarity || item.score || 0)}
                </span>
              </div>
              
              <p className="evidence-note">{item.note}</p>
              
              {(item.similarity || item.score) && (
                <div className="evidence-metrics">
                  <div className="metric">
                    <span>Score:</span>
                    <span className="metric-value">
                      {((item.similarity || item.score) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}

              {item.flags && (
                <div className="evidence-flags">
                  {item.flags.map((flag, flagIndex) => (
                    <span key={flagIndex} className="flag-tag">{flag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvolutionPanel;