import React, { useState, useRef } from 'react';
import './App.css';

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [maxSize, setMaxSize] = useState(512);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentFile = useRef<File | null>(null);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(URL.createObjectURL(file));
      setProcessedImage(null);
      setError(null);
      currentFile.current = file;
    } else {
      setError('Please select a valid image file');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const testConnection = async () => {
    try {
      const response = await fetch('/health');
      const data = await response.json();
      setError(`✅ ${data.message}`);
    } catch (err) {
      setError('❌ Backend connection failed');
    }
  };

  const removeBackground = async () => {
    const file = currentFile.current;
    if (!file) return;

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('max_size', maxSize.toString());

    try {
      const response = await fetch('/remove-bg', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        setError(error.error || 'Failed to process image');
        return;
      }
      
      const blob = await response.blob();
      setProcessedImage(URL.createObjectURL(blob));
    } catch (error) {
      console.error('Error:', error);
      setError(`Error removing background: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'bg-removed.png';
    link.click();
  };

  return (
    <div className="App">
      <h1>🎨 AI Background Remover</h1>
      <p className="subtitle">Remove backgrounds from your images using SAM AI</p>
      
      <button 
        className="test-button" 
        onClick={testConnection}
        style={{marginBottom: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}
      >
        🔗 Test Backend Connection
      </button>
      
      <div 
        className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
        <div className="upload-content">
          <span className="upload-icon">📁</span>
          <p>Drag & drop your image here</p>
          <p className="upload-or">or</p>
          <button className="select-button" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
            Select Image
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {selectedImage && (
        <div className="controls">
          <div className="control-group">
            <label htmlFor="maxSize">Image Quality (Lower = Faster):</label>
            <div className="slider-container">
              <input 
                type="range" 
                id="maxSize"
                min="256" 
                max="1024" 
                step="128"
                value={maxSize} 
                onChange={(e) => setMaxSize(Number(e.target.value))}
              />
              <span className="slider-value">{maxSize}px</span>
            </div>
          </div>
          <button 
            className="process-button" 
            onClick={removeBackground} 
            disabled={loading}
          >
            {loading ? '⏳ Processing...' : '✨ Remove Background'}
          </button>
        </div>
      )}

      {selectedImage && (
        <div className="images">
          <div className="image-container">
            <h3>Original</h3>
            <img src={selectedImage} alt="Original" />
          </div>
          {processedImage && (
            <div className="image-container">
              <h3>Result</h3>
              <img src={processedImage} alt="Processed" className="processed" />
              <button className="download-button" onClick={downloadImage}>
                ⬇️ Download
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
