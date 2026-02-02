import React, { useState } from 'react';
import './AuraWeaver.css';

const AuraWeaver = () => {
  const [selectedPattern, setSelectedPattern] = useState('traditional');
  const [selectedColors, setSelectedColors] = useState(['crimson']);
  const [selectedFabric, setSelectedFabric] = useState('silk');
  const [isAnimating, setIsAnimating] = useState(false);

  // Custom inputs
  const [customColor, setCustomColor] = useState('#ffffff');
  const [customColorName, setCustomColorName] = useState('');
  const [customPatternInput, setCustomPatternInput] = useState('');
  const [customFabricInput, setCustomFabricInput] = useState('');
  const [customFabricDesc, setCustomFabricDesc] = useState('');

  const [patterns, setPatterns] = useState([
    { id: 'traditional', name: 'Traditional Banarasi', icon: '🏮' },
    { id: 'modern', name: 'Modern Contemporary', icon: '✨' },
    { id: 'floral', name: 'Floral Garden', icon: '🌸' },
    { id: 'geometric', name: 'Geometric Precision', icon: '🔷' },
    { id: 'paisley', name: 'Paisley Dreams', icon: '🌿' },
    { id: 'peacock', name: 'Peacock Majesty', icon: '🦚' }
  ]);

  const [colorsState, setColorsState] = useState([
    { id: 'crimson', name: 'Royal Crimson', value: '#8b0000' },
    { id: 'gold', name: 'Golden Heritage', value: '#ffd700' },
    { id: 'emerald', name: 'Emerald Green', value: '#50c878' },
    { id: 'royal', name: 'Royal Blue', value: '#4169e1' },
    { id: 'sunset', name: 'Sunset Orange', value: '#ff6347' },
    { id: 'plum', name: 'Plum Purple', value: '#8b4789' }
  ]);

  const [fabrics, setFabrics] = useState([
    { id: 'silk', name: 'Pure Silk', description: 'Luxurious pure silk fabric' },
    { id: 'banarasi', name: 'Banarasi Silk', description: 'Traditional Banarasi weave' },
    { id: 'blended', name: 'Blended Silk', description: 'Comfortable silk blend' },
    { id: 'tussar', name: 'Tussar Silk', description: 'Natural Tussar texture' }
  ]);

  const getSareeBackground = () => {
    const vals = selectedColors.map(id => colorsState.find(c => c.id === id)?.value).filter(Boolean);
    if (vals.length === 0) return '';
    if (vals.length === 1) return `linear-gradient(135deg, ${vals[0]} 0%, ${vals[0]}dd 100%)`;
    const stops = vals.map((v, i) => `${v} ${Math.round((i/(vals.length -1))*100)}%`).join(', ');
    return `linear-gradient(135deg, ${stops})`;
  };

  const addColor = () => {
    const id = `custom-${Date.now()}`;
    setColorsState(prev => [...prev, { id, name: customColorName || customColor, value: customColor }]);
    setSelectedColors(prev => prev.includes(id) ? prev : [...prev, id]);
    setCustomColor('#ffffff');
    setCustomColorName('');
  };

  const addPattern = () => {
    const name = (customPatternInput || '').trim();
    if (!name) return;
    const id = `customp-${Date.now()}`;
    setPatterns(prev => [...prev, { id, name, icon: '⭐' }]);
    setCustomPatternInput('');
    setSelectedPattern(id);
  };

  const addFabric = () => {
    const name = (customFabricInput || '').trim();
    if (!name) return;
    const id = `customf-${Date.now()}`;
    setFabrics(prev => [...prev, { id, name, description: customFabricDesc }]);
    setCustomFabricInput('');
    setCustomFabricDesc('');
    setSelectedFabric(id);
  };

  const handleWeaveComplete = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      
      // Get selected options
      const pattern = patterns.find(p => p.id === selectedPattern)?.name;
      const colorList = selectedColors.map(id => colorsState.find(c => c.id === id)?.name || id).filter(Boolean).join(', ');
      const fabric = fabrics.find(f => f.id === selectedFabric)?.name;
      
      // Create WhatsApp message
      const message = `Namaste! I'm interested in a custom saree with the following details:%0A%0A` +
                     `*Pattern:* ${pattern}%0A` +
                     `*Colors:* ${colorList}%0A` +
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
                  background: getSareeBackground()
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
            <p>{selectedColors.map(id => colorsState.find(c => c.id === id)?.name || id).filter(Boolean).join(', ')}</p>
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

            <div className="custom-pattern-input">
              <input type="text" placeholder="Custom pattern name" value={customPatternInput} onChange={e => setCustomPatternInput(e.target.value)} />
              <button className="btn btn-sm" onClick={addPattern}>Add Pattern</button>
            </div>
          </div>

          {/* Color Selection */}
          <div className="control-group">
            <h4 className="control-title">
              <i className="fas fa-paint-brush"></i>
              Select Color
            </h4>
            <div className="color-grid">
              {colorsState.map(color => (
                <button
                  key={color.id}
                  className={`color-option ${selectedColors.includes(color.id) ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedColors(prev => prev.includes(color.id) ? prev.filter(id => id !== color.id) : [...prev, color.id]);
                  }}
                  style={{ backgroundColor: color.value }}
                  aria-pressed={selectedColors.includes(color.id)}
                >
                  <span className="color-name">{color.name}</span>
                  {selectedColors.includes(color.id) && <span className="color-check">✓</span>}
                </button>
              ))}
            </div>

            <div className="custom-color-inputs">
              <input type="color" value={customColor} onChange={e => setCustomColor(e.target.value)} />
              <input type="text" placeholder="Color name (optional)" value={customColorName} onChange={e => setCustomColorName(e.target.value)} />
              <button className="btn btn-sm" onClick={addColor}>Add Color</button>
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

            <div className="custom-fabric-input">
              <input type="text" placeholder="Custom fabric name" value={customFabricInput} onChange={e => setCustomFabricInput(e.target.value)} />
              <input type="text" placeholder="Fabric description (optional)" value={customFabricDesc} onChange={e => setCustomFabricDesc(e.target.value)} />
              <button className="btn btn-sm" onClick={addFabric}>Add Fabric</button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="weaver-actions">
            <button className="btn btn-secondary" onClick={() => {
              setSelectedPattern('traditional');
              setSelectedColors(['crimson']);
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
