import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronRight, FileEdit, Palette, Eye, Download, Settings, Zap } from 'lucide-react';

const Tutorial = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const sidebarRef = useRef(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);

  const tutorialSteps = [
    {
      icon: <FileEdit className="tutorial-icon" />,
      title: "Create Your Resume",
      description: "Start by filling out your personal information, education, and work experience in our intuitive form.",
      features: ["Smart form validation", "Auto-save functionality", "Multiple sections support"]
    },
    {
      icon: <Palette className="tutorial-icon" />,
      title: "Choose Your Theme",
      description: "Select from our professionally designed themes including Professional, Amazon, Netflix, Google, and Dark Mode.",
      features: ["5+ premium themes", "Custom color schemes", "Mobile-optimized layouts"]
    },
    {
      icon: <Eye className="tutorial-icon" />,
      title: "Live Preview",
      description: "See your resume update in real-time as you type. Make adjustments and see instant results.",
      features: ["Real-time updates", "Responsive preview", "Print-ready formatting"]
    },
    {
      icon: <Download className="tutorial-icon" />,
      title: "Export & Share",
      description: "Download your resume as HTML or convert to PDF. Share your professional resume anywhere.",
      features: ["HTML export", "PDF conversion", "Mobile sharing"]
    },
    {
      icon: <Settings className="tutorial-icon" />,
      title: "Advanced Features",
      description: "Access admin panel, manage templates, and customize your resume builder experience.",
      features: ["Template management", "Admin controls", "Custom branding"]
    },
    {
      icon: <Zap className="tutorial-icon" />,
      title: "Mobile App",
      description: "Your resume builder is now available as a native Android app with all web features.",
      features: ["Native performance", "Offline support", "Touch optimized"]
    }
  ];

  // Handle touch events for swipe gestures
  useEffect(() => {
    const handleTouchStart = (e) => {
      if (!sidebarRef.current) return;
      startX.current = e.touches[0].clientX;
      isDragging.current = true;
    };

    const handleTouchMove = (e) => {
      if (!isDragging.current || !sidebarRef.current) return;
      currentX.current = e.touches[0].clientX;
      const deltaX = currentX.current - startX.current;
      
      // Only allow closing swipe (left swipe when sidebar is open)
      if (deltaX < 0 && isOpen) {
        const translateX = Math.max(deltaX, -300);
        sidebarRef.current.style.transform = `translateX(${translateX}px)`;
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging.current || !sidebarRef.current) return;
      const deltaX = currentX.current - startX.current;
      
      // Close sidebar if swiped left more than 100px
      if (deltaX < -100 && isOpen) {
        onClose();
      }
      
      // Reset transform
      sidebarRef.current.style.transform = '';
      isDragging.current = false;
    };

    const sidebarElement = sidebarRef.current;
    if (sidebarElement) {
      sidebarElement.addEventListener('touchstart', handleTouchStart, { passive: true });
      sidebarElement.addEventListener('touchmove', handleTouchMove, { passive: true });
      sidebarElement.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      if (sidebarElement) {
        sidebarElement.removeEventListener('touchstart', handleTouchStart);
        sidebarElement.removeEventListener('touchmove', handleTouchMove);
        sidebarElement.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isOpen, onClose]);

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % tutorialSteps.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + tutorialSteps.length) % tutorialSteps.length);
  };

  if (!isOpen) return null;

  const currentTutorial = tutorialSteps[currentStep];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="tutorial-backdrop"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`tutorial-sidebar ${isOpen ? 'open' : ''}`}
      >
        <div className="tutorial-header">
          <h2 className="tutorial-title">Resume Builder Guide</h2>
          <button 
            className="tutorial-close"
            onClick={onClose}
            aria-label="Close tutorial"
          >
            <X size={24} />
          </button>
        </div>

        <div className="tutorial-content">
          <div className="tutorial-step">
            <div className="tutorial-step-header">
              {currentTutorial.icon}
              <h3 className="tutorial-step-title">{currentTutorial.title}</h3>
            </div>
            
            <p className="tutorial-description">
              {currentTutorial.description}
            </p>
            
            <div className="tutorial-features">
              <h4 className="features-title">Key Features:</h4>
              <ul className="features-list">
                {currentTutorial.features.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <ChevronRight size={16} className="feature-icon" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="tutorial-navigation">
            <div className="tutorial-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
                />
              </div>
              <span className="progress-text">
                {currentStep + 1} of {tutorialSteps.length}
              </span>
            </div>
            
            <div className="tutorial-buttons">
              <button 
                className="tutorial-btn tutorial-btn-secondary"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                Previous
              </button>
              <button 
                className="tutorial-btn tutorial-btn-primary"
                onClick={nextStep}
              >
                {currentStep === tutorialSteps.length - 1 ? 'Start Over' : 'Next'}
              </button>
            </div>
          </div>
        </div>

        <div className="tutorial-footer">
          <p className="footer-text">
            Swipe left to close this tutorial or tap outside
          </p>
        </div>
      </div>

      <style jsx>{`
        .tutorial-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          z-index: 9998;
          backdrop-filter: blur(5px);
        }

        .tutorial-sidebar {
          position: fixed;
          top: 0;
          right: -400px;
          width: 400px;
          height: 100vh;
          background: linear-gradient(135deg, 
            rgba(15, 15, 35, 0.98) 0%, 
            rgba(26, 26, 46, 0.95) 50%, 
            rgba(22, 33, 62, 0.98) 100%
          );
          backdrop-filter: blur(20px);
          border-left: 1px solid rgba(147, 112, 219, 0.3);
          box-shadow: 
            -10px 0 50px rgba(0, 0, 0, 0.3),
            -5px 0 25px rgba(147, 112, 219, 0.1);
          z-index: 9999;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow-y: auto;
          color: white;
        }

        .tutorial-sidebar.open {
          transform: translateX(-400px);
        }

        .tutorial-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid rgba(147, 112, 219, 0.2);
          background: rgba(147, 112, 219, 0.1);
        }

        .tutorial-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
          background: linear-gradient(135deg, #9370db, #e6e6fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .tutorial-close {
          background: transparent;
          border: none;
          color: #e6e6fa;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .tutorial-close:hover {
          background: rgba(147, 112, 219, 0.2);
          color: white;
        }

        .tutorial-content {
          padding: 1.5rem;
          flex: 1;
        }

        .tutorial-step {
          margin-bottom: 2rem;
        }

        .tutorial-step-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .tutorial-icon {
          color: #9370db;
          filter: drop-shadow(0 0 10px rgba(147, 112, 219, 0.5));
        }

        .tutorial-step-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin: 0;
          color: #e6e6fa;
        }

        .tutorial-description {
          font-size: 1rem;
          line-height: 1.6;
          color: #d1d5db;
          margin-bottom: 1.5rem;
        }

        .tutorial-features {
          margin-bottom: 2rem;
        }

        .features-title {
          font-size: 1rem;
          font-weight: 600;
          color: #9370db;
          margin: 0 0 1rem 0;
        }

        .features-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0;
          font-size: 0.9rem;
          color: #e5e7eb;
        }

        .feature-icon {
          color: #9370db;
          flex-shrink: 0;
        }

        .tutorial-navigation {
          border-top: 1px solid rgba(147, 112, 219, 0.2);
          padding-top: 1.5rem;
        }

        .tutorial-progress {
          margin-bottom: 1.5rem;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: rgba(147, 112, 219, 0.2);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #9370db, #e6e6fa);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 0.85rem;
          color: #9ca3af;
          text-align: center;
          display: block;
        }

        .tutorial-buttons {
          display: flex;
          gap: 1rem;
        }

        .tutorial-btn {
          flex: 1;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tutorial-btn-primary {
          background: linear-gradient(135deg, #9370db, #b19cd9);
          color: white;
        }

        .tutorial-btn-primary:hover {
          background: linear-gradient(135deg, #7b68ee, #9370db);
          transform: translateY(-1px);
        }

        .tutorial-btn-secondary {
          background: rgba(147, 112, 219, 0.2);
          color: #e6e6fa;
          border: 1px solid rgba(147, 112, 219, 0.3);
        }

        .tutorial-btn-secondary:hover {
          background: rgba(147, 112, 219, 0.3);
          color: white;
        }

        .tutorial-btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .tutorial-btn-secondary:disabled:hover {
          background: rgba(147, 112, 219, 0.2);
          transform: none;
        }

        .tutorial-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid rgba(147, 112, 219, 0.2);
          background: rgba(0, 0, 0, 0.2);
        }

        .footer-text {
          font-size: 0.8rem;
          color: #9ca3af;
          text-align: center;
          margin: 0;
        }

        @media (max-width: 768px) {
          .tutorial-sidebar {
            width: 100%;
            right: -100%;
          }

          .tutorial-sidebar.open {
            transform: translateX(-100%);
          }
        }

        @media (max-width: 480px) {
          .tutorial-header {
            padding: 1rem;
          }

          .tutorial-title {
            font-size: 1.3rem;
          }

          .tutorial-content {
            padding: 1rem;
          }

          .tutorial-step-title {
            font-size: 1.1rem;
          }

          .tutorial-description {
            font-size: 0.9rem;
          }

          .tutorial-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
};

export default Tutorial;
