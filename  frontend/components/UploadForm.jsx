// src/components/UploadForm.jsx
import React, { useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';

const UploadForm = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && isValidFileType(file)) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && isValidFileType(file)) {
      setSelectedFile(file);
    }
  };

  const isValidFileType = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    return allowedTypes.includes(file.type);
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="upload-form-container">
      <div 
        className={`upload-zone ${isDragging ? 'dragging' : ''} ${selectedFile ? 'has-file' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-content">
          <Upload size={48} className="upload-icon" />
          <div className="upload-text">
            <h3>Drag & Drop your academic document</h3>
            <p>Supports PDF, JPG, PNG files (Max 10MB)</p>
          </div>
          
          <input
            type="file"
            id="file-upload"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
            className="file-input"
          />
          <label htmlFor="file-upload" className="browse-button">
            Select File
          </label>
        </div>

        {selectedFile && (
          <div className="file-preview">
            <FileText size={24} />
            <div className="file-info">
              <span className="file-name">{selectedFile.name}</span>
              <span className="file-size">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
            <button className="remove-button" onClick={removeFile}>
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {selectedFile && (
        <button className="analyze-button" onClick={handleSubmit}>
          Analyze Document
        </button>
      )}

      <div className="security-notice">
        <p>🔒 Your documents are processed securely and deleted after analysis</p>
      </div>
    </div>
  );
};

export default UploadForm;