import React, { useState } from 'react';
import './AuraWeaver.css';

const AuraWeaver = () => {
  const [selectedPattern, setSelectedPattern] = useState('traditional');
  const [selectedColor, setSelectedColor] = useState('crimson');
  const [selectedFabric, setSelectedFabric] = useState('silk');
  const [isAnimating, setIsAnimating] = useState(false);

  const patterns = [
    { id: 'traditional', name: 'Traditional Banarasi', icon: '🏮' },
    { id: 'modern', name: 'Modern Contemporary', icon: '✨' },
    { id: 'floral', name: 'Floral Garden', icon: '🌸' },
    { id: 'geometric', name: 'Geometric Precision', icon: '🔷' },
    { id: 'paisley', name: 'Paisley Dreams', icon: '🌿' },
    { id: 'peacock', name: 'Peacock Majesty', icon: '🦚' }
  ];

  const colors = [
    { id: 'crimson', name: 'Royal Crimson', value: '#8b0000' },
    { id: 'gold', name: 'Golden Heritage', value: '#ffd700' },
    { id: 'emerald', name: 'Emerald Green', value: '#50c878' },
    { id: 'royal', name: 'Royal Blue', value: '#4169e1' },
    { id: 'sunset', name: 'Sunset Orange', value: '#ff6347' },
    { id: 'plum', name: 'Plum Purple', value: '#8b4789' }
  ];

  const fabrics = [
    { id: 'silk', name: 'Pure Silk', description: 'Luxurious pure silk fabric' },
    { id: 'banarasi', name: 'Banarasi Silk', description: 'Traditional Banarasi weave' },
    { id: 'blended', name: 'Blended Silk', description: 'Comfortable silk blend' },
    { id: 'tussar', name: 'Tussar Silk', description: 'Natural Tussar texture' }
  ];

  const handleWeaveComplete = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      
      // Get selected options
      const pattern = patterns.find(p => p.id === selectedPattern)?.name;
      const color = colors.find(c => c.id === selectedColor)?.name;
      const fabric = fabrics.find(f => f.id === selectedFabric)?.name;
      
      // Create WhatsApp message
      const message = `Namaste! I'm interested in a custom saree with the following details:%0A%0A` +
                     `*Pattern:* ${pattern}%0A` +
                     `*Color:* ${color}%0A` +
                     `*Fabric:* ${fabric}%0A%0A` +
                     `Could you please provide more information about this custom order?`;
      
      // Open WhatsApp with pre-filled message
      window.open(`https://wa.me/918744923702?text=${message}`, '_blank');
      
    }, 2000);
  };

  return (
    <div className="aura-weaver">
      <div className="aura-weaver-header">
        <h2 className="aura-weaver-title">
          <i className="fas fa-magic"></i>
          Aura Weaver Studio
        </h2>
        <p className="aura-weaver-subtitle">
          Design your unique saree by combining patterns, colors, and fabrics
        </p>
      </div>

      <div className="weaver-workspace">
        {/* Preview Section */}
        <div className="preview-section">
          <div className="saree-preview">
            <div className={`saree-canvas ${isAnimating ? 'weaving' : ''}`}>
              <div 
                className="saree-base"
                style={{
                  background: `linear-gradient(135deg, ${colors.find(c => c.id === selectedColor)?.value} 0%, ${colors.find(c => c.id === selectedColor)?.value}dd 100%)`
                }}
              >
                <div className="pattern-overlay">
                  {selectedPattern === 'traditional' && <div className="pattern-traditional"></div>}
                  {selectedPattern === 'modern' && <div className="pattern-modern"></div>}
                  {selectedPattern === 'floral' && <div className="pattern-floral"></div>}
                  {selectedPattern === 'geometric' && <div className="pattern-geometric"></div>}
                  {selectedPattern === 'paisley' && <div className="pattern-paisley"></div>}
                  {selectedPattern === 'peacock' && <div className="pattern-peacock"></div>}
                </div>
                <div className="fabric-texture" data-fabric={selectedFabric}></div>
              </div>
            </div>
            {isAnimating && (
              <div className="weaving-animation">
                <div className="weaving-thread"></div>
                <div className="weaving-sparkles"></div>
              </div>
            )}
          </div>
          <div className="preview-info">
            <h3>Your Custom Design</h3>
            <p>{patterns.find(p => p.id === selectedPattern)?.name}</p>
            <p>{colors.find(c => c.id === selectedColor)?.name}</p>
            <p>{fabrics.find(f => f.id === selectedFabric)?.name}</p>
          </div>
        </div>

        {/* Customization Controls */}
        <div className="customization-controls">
          {/* Pattern Selection */}
          <div className="control-group">
            <h4 className="control-title">
              <i className="fas fa-palette"></i>
              Choose Pattern
            </h4>
            <div className="pattern-grid">
              {patterns.map(pattern => (
                <button
                  key={pattern.id}
                  className={`pattern-option ${selectedPattern === pattern.id ? 'active' : ''}`}
                  onClick={() => setSelectedPattern(pattern.id)}
                >
                  <span className="pattern-icon">{pattern.icon}</span>
                  <span className="pattern-name">{pattern.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="control-group">
            <h4 className="control-title">
              <i className="fas fa-paint-brush"></i>
              Select Color
            </h4>
            <div className="color-grid">
              {colors.map(color => (
                <button
                  key={color.id}
                  className={`color-option ${selectedColor === color.id ? 'active' : ''}`}
                  onClick={() => setSelectedColor(color.id)}
                  style={{ backgroundColor: color.value }}
                >
                  <span className="color-name">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Fabric Selection */}
          <div className="control-group">
            <h4 className="control-title">
              <i className="fas fa-cut"></i>
              Fabric Type
            </h4>
            <div className="fabric-grid">
              {fabrics.map(fabric => (
                <button
                  key={fabric.id}
                  className={`fabric-option ${selectedFabric === fabric.id ? 'active' : ''}`}
                  onClick={() => setSelectedFabric(fabric.id)}
                >
                  <h5>{fabric.name}</h5>
                  <p>{fabric.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="weaver-actions">
            <button className="btn btn-secondary" onClick={() => {
              setSelectedPattern('traditional');
              setSelectedColor('crimson');
              setSelectedFabric('silk');
            }}>
              <i className="fas fa-undo"></i>
              Reset Design
            </button>
            <button 
              className="btn btn-primary weave-btn"
              onClick={handleWeaveComplete}
              disabled={isAnimating}
            >
              <i className="fas fa-magic"></i>
              {isAnimating ? 'Weaving...' : 'Weave My Aura'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuraWeaver;
