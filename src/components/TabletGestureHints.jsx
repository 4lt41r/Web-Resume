import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Menu, Eye } from 'lucide-react';

const TabletGestureHints = ({ isTablet, showSidebar, showPreview }) => {
  const [showHints, setShowHints] = useState(false);
  const [hasShownHints, setHasShownHints] = useState(false);

  useEffect(() => {
    if (isTablet && !hasShownHints) {
      // Show hints after a brief delay when user first loads on tablet
      const timer = setTimeout(() => {
        setShowHints(true);
        setHasShownHints(true);
        
        // Auto-hide hints after 4 seconds
        setTimeout(() => {
          setShowHints(false);
        }, 4000);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isTablet, hasShownHints]);

  if (!isTablet || (!showHints)) return null;

  return (
    <>
      {/* Left gesture hint - Menu */}
      {!showSidebar && (
        <div className="tablet-gesture-hint left-hint">
          <div className="hint-content">
            <ChevronRight size={20} />
            <Menu size={16} />
            <span>Swipe Right for Menu</span>
          </div>
        </div>
      )}

      {/* Right gesture hint - Preview */}
      {!showPreview && (
        <div className="tablet-gesture-hint right-hint">
          <div className="hint-content">
            <Eye size={16} />
            <ChevronLeft size={20} />
            <span>Swipe Left for Preview</span>
          </div>
        </div>
      )}

      <style jsx>{`
        .tablet-gesture-hint {
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1000;
          pointer-events: none;
          animation: fadeInOut 4s ease-in-out forwards;
        }

        .left-hint {
          left: 20px;
        }

        .right-hint {
          right: 20px;
        }

        .hint-content {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(147, 112, 219, 0.95);
          color: white;
          padding: 12px 16px;
          border-radius: 25px;
          font-size: 14px;
          font-weight: 500;
          box-shadow: 
            0 8px 25px rgba(0, 0, 0, 0.3),
            0 4px 12px rgba(147, 112, 219, 0.4);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: pulseGlow 2s ease-in-out infinite;
        }

        .right-hint .hint-content {
          flex-direction: row-reverse;
        }

        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: translateY(-50%) scale(0.8);
          }
          15% {
            opacity: 1;
            transform: translateY(-50%) scale(1);
          }
          85% {
            opacity: 1;
            transform: translateY(-50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-50%) scale(0.8);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 
              0 8px 25px rgba(0, 0, 0, 0.3),
              0 4px 12px rgba(147, 112, 219, 0.4);
          }
          50% {
            box-shadow: 
              0 8px 25px rgba(0, 0, 0, 0.3),
              0 4px 12px rgba(147, 112, 219, 0.6),
              0 0 20px rgba(147, 112, 219, 0.3);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 900px) {
          .hint-content {
            font-size: 12px;
            padding: 10px 14px;
          }
          
          .left-hint {
            left: 15px;
          }
          
          .right-hint {
            right: 15px;
          }
        }
      `}</style>
    </>
  );
};

export default TabletGestureHints;
