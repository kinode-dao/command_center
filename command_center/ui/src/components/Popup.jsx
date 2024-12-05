function Popup({ isOpen, onClose, children }) {
    if (!isOpen) return null;
  
    return (
        <div className="popup-overlay" onClick={onClose}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
          <h3 className="popup-title">Instructions</h3>
            <div className="popup-header">
                <button className="popup-close" onClick={onClose}>&times;</button>
            </div>
            <div className="popup-body">
              {children}
            </div>
          </div>
        </div>
      );
    }
    
export default Popup;