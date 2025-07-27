import React, { useState, useEffect } from 'react';
import { FileEdit, Zap, Star, Sparkles, Monitor, Smartphone, Maximize } from 'lucide-react';

const DesktopLoadingScreen = ({ isFullscreen = false }) => {
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('Initializing application...');

  const tips = [
    "💡 Use strong action verbs to describe your achievements",
    "🎯 Tailor your resume for each job application",
    "📊 Include quantifiable results and metrics",
    "🔧 Highlight relevant technical skills",
    "🏆 Showcase your most impressive accomplishments",
    "📝 Keep your resume concise and well-formatted",
    "🌟 Use the live preview to see real-time changes",
    "⚡ Export to PDF or HTML formats instantly",
    "🎨 Multiple professional themes available",
    "📱 Mobile-ready responsive design"
  ];

  useEffect(() => {
    const loadingStages = [
      { threshold: 0, status: 'Initializing application...' },
      { threshold: 16, status: 'Loading resume templates...' },
      { threshold: 33, status: 'Setting up theme system...' },
      { threshold: 50, status: 'Preparing components...' },
      { threshold: 66, status: 'Configuring user interface...' },
      { threshold: 83, status: 'Finalizing setup...' },
      { threshold: 95, status: 'Almost ready...' },
      { threshold: 100, status: 'Welcome to Resume Builder Pro!' }
    ];

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const newProgress = prev + 0.67;
        
        // Update loading status based on progress
        const currentStage = loadingStages
          .slice()
          .reverse()
          .find(stage => newProgress >= stage.threshold);
        
        if (currentStage) {
          setLoadingStatus(currentStage.status);
        }
        
        return newProgress;
      });
    }, 40);

    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % tips.length);
    }, 2500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(tipInterval);
    };
  }, [tips.length]);

  return (
    <div className="desktop-loading-screen">
      <div className="desktop-loading-container">
        {/* Left Column - Brand & Status */}
        <div className="desktop-left-column">
          <div className="desktop-brand-section">
            <div className="desktop-logo-container">
              <FileEdit className="desktop-logo-icon" size={64} />
              <div className="desktop-logo-sparkles">
                <Sparkles className="desktop-sparkle desktop-sparkle-1" size={20} />
                <Star className="desktop-sparkle desktop-sparkle-2" size={16} />
                <Zap className="desktop-sparkle desktop-sparkle-3" size={18} />
              </div>
            </div>
            <h1 className="desktop-title">Resume Builder Pro</h1>
            <p className="desktop-subtitle">Professional Resume Creation Suite</p>
            
            {/* Platform Icons */}
            <div className="desktop-platform-icons">
              <div className="desktop-platform-item">
                <Monitor size={24} />
                <span>Desktop</span>
              </div>
              <div className="desktop-platform-item">
                <Smartphone size={24} />
                <span>Mobile</span>
              </div>
              {isFullscreen && (
                <div className="desktop-platform-item fullscreen-indicator">
                  <Maximize size={24} />
                  <span>Fullscreen</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Section */}
          <div className="desktop-progress-section">
            <div className="desktop-status-container">
              <p className="desktop-status-text">{loadingStatus}</p>
              <div className="desktop-progress-percentage">{Math.round(progress)}%</div>
            </div>
            
            <div className="desktop-progress-bar">
              <div 
                className="desktop-progress-fill"
                style={{ width: `${progress}%` }}
              >
                <div className="desktop-progress-shine"></div>
              </div>
            </div>
          </div>

          {/* Creator Credits */}
          <div className="desktop-credits-section">
            <div className="desktop-creator-credit">
              <p className="desktop-presented-by">Presented by</p>
              <p className="desktop-creator-name">Mujeeb Ul Haq Qadri</p>
            </div>
            
            <div className="desktop-acknowledgment">
              <div className="desktop-ack-header">
                <div className="desktop-vibe-icon">⚡</div>
                <p className="desktop-thanks-text">Special Thanks to</p>
                <div className="desktop-vibe-icon">⚡</div>
              </div>
              <p className="desktop-cognizant-vibe">Cognizant Vibe Coding</p>
              <p className="desktop-vibe-subtitle">For inspiring innovation & excellence</p>
            </div>
          </div>
        </div>

        {/* Right Column - Features & Tips */}
        <div className="desktop-right-column">
          {/* Features Grid */}
          <div className="desktop-features-section">
            <h3 className="desktop-features-title">Features</h3>
            <div className="desktop-features-grid">
              <div className="desktop-feature-card">
                <div className="desktop-feature-icon">📝</div>
                <h4>Smart Forms</h4>
                <p>Intelligent form validation and auto-suggestions</p>
              </div>
              <div className="desktop-feature-card">
                <div className="desktop-feature-icon">🎨</div>
                <h4>Multiple Themes</h4>
                <p>Professional templates for every industry</p>
              </div>
              <div className="desktop-feature-card">
                <div className="desktop-feature-icon">⚡</div>
                <h4>Live Preview</h4>
                <p>Real-time editing with instant preview</p>
              </div>
              <div className="desktop-feature-card">
                <div className="desktop-feature-icon">📄</div>
                <h4>Export Options</h4>
                <p>PDF, HTML, and mobile-ready formats</p>
              </div>
              <div className="desktop-feature-card">
                <div className="desktop-feature-icon">🔧</div>
                <h4>Customizable</h4>
                <p>Full control over layout and styling</p>
              </div>
              <div className="desktop-feature-card">
                <div className="desktop-feature-icon">📱</div>
                <h4>Responsive</h4>
                <p>Perfect on desktop, tablet, and mobile</p>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="desktop-tips-section">
            <h3 className="desktop-tips-title">Pro Tips</h3>
            <div className="desktop-tip-container">
              <div className="desktop-tip-item" key={currentTip}>
                {tips[currentTip]}
              </div>
            </div>
          </div>

          {/* Loading Animation */}
          <div className="desktop-loading-animation">
            <div className="desktop-dot desktop-dot-1"></div>
            <div className="desktop-dot desktop-dot-2"></div>
            <div className="desktop-dot desktop-dot-3"></div>
            <div className="desktop-dot desktop-dot-4"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .desktop-loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          height: 100dvh; /* Dynamic viewport height for mobile browsers */
          ${isFullscreen ? `
            min-height: 100vh;
            min-height: 100dvh;
          ` : ''}
          background: 
            radial-gradient(circle at 20% 20%, rgba(106, 90, 205, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(72, 61, 139, 0.2) 0%, transparent 50%),
            linear-gradient(135deg, 
              #0f0f23 0%, 
              #1a1a2e 20%, 
              #16213e 40%, 
              #1a1a2e 60%, 
              #0f0f23 100%
            );
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .desktop-loading-screen::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            conic-gradient(from 0deg at 30% 30%, 
              transparent 0deg, 
              rgba(106, 90, 205, 0.1) 45deg, 
              transparent 90deg, 
              rgba(147, 112, 219, 0.08) 135deg, 
              transparent 180deg,
              rgba(138, 43, 226, 0.1) 225deg,
              transparent 270deg,
              rgba(123, 104, 238, 0.08) 315deg,
              transparent 360deg
            );
          animation: rotate 25s linear infinite;
          filter: blur(2px);
        }

        .desktop-loading-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(2rem, 4vw, 4rem);
          max-width: ${isFullscreen ? '98vw' : 'min(1200px, 90vw)'};
          width: 90vw;
          height: ${isFullscreen ? '98vh' : 'min(80vh, 90vh)'};
          height: ${isFullscreen ? '98dvh' : 'min(80dvh, 90dvh)'};
          background: 
            linear-gradient(135deg, 
              rgba(15, 15, 35, 0.95) 0%, 
              rgba(26, 26, 46, 0.9) 25%, 
              rgba(22, 33, 62, 0.85) 50%, 
              rgba(26, 26, 46, 0.9) 75%, 
              rgba(15, 15, 35, 0.95) 100%
            );
          border-radius: ${isFullscreen ? '12px' : 'clamp(16px, 2vw, 24px)'};
          backdrop-filter: blur(30px);
          border: 1px solid rgba(147, 112, 219, 0.3);
          box-shadow: 
            0 25px 80px rgba(0, 0, 0, 0.6),
            0 12px 40px rgba(106, 90, 205, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: relative;
          z-index: 10;
          color: white;
          overflow: hidden;
        }

        /* Left Column Styles */
        .desktop-left-column {
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .desktop-brand-section {
          text-align: center;
        }

        .desktop-logo-container {
          position: relative;
          display: inline-block;
          margin-bottom: 2rem;
        }

        .desktop-logo-icon {
          color: #9370db;
          filter: 
            drop-shadow(0 0 15px rgba(147, 112, 219, 0.7)) 
            drop-shadow(0 0 30px rgba(106, 90, 205, 0.5));
          animation: logoFloat 4s ease-in-out infinite;
        }

        .desktop-logo-sparkles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .desktop-sparkle {
          position: absolute;
          animation: sparkle 3s ease-in-out infinite;
          filter: drop-shadow(0 0 10px currentColor);
        }

        .desktop-sparkle-1 {
          top: -10px;
          right: -10px;
          color: #dda0dd;
          animation-delay: 0s;
        }

        .desktop-sparkle-2 {
          bottom: -5px;
          left: -5px;
          color: #b19cd9;
          animation-delay: 1s;
        }

        .desktop-sparkle-3 {
          top: 50%;
          right: -15px;
          color: #9370db;
          animation-delay: 2s;
        }

        .desktop-title {
          font-size: 3.5rem;
          font-weight: 300;
          margin: 0 0 1rem 0;
          background: linear-gradient(135deg, 
            #ffffff 0%, 
            #e6e6fa 25%, 
            #dda0dd 50%, 
            #b19cd9 75%, 
            #9370db 100%
          );
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: titleFlow 8s ease-in-out infinite;
          letter-spacing: 3px;
          text-shadow: 0 0 40px rgba(147, 112, 219, 0.3);
        }

        .desktop-subtitle {
          font-size: 1.4rem;
          opacity: 0.9;
          margin: 0 0 2rem 0;
          font-weight: 400;
          color: #e6e6fa;
          letter-spacing: 1px;
        }

        .desktop-platform-icons {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .desktop-platform-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: rgba(147, 112, 219, 0.1);
          border-radius: 12px;
          border: 1px solid rgba(147, 112, 219, 0.2);
          backdrop-filter: blur(10px);
          animation: platformFloat 4s ease-in-out infinite;
        }

        .desktop-platform-item:nth-child(1) {
          animation-delay: 0s;
        }

        .desktop-platform-item:nth-child(2) {
          animation-delay: 1s;
        }

        .desktop-platform-item:nth-child(3) {
          animation-delay: 2s;
        }

        .fullscreen-indicator {
          background: rgba(34, 197, 94, 0.15) !important;
          border-color: rgba(34, 197, 94, 0.3) !important;
          color: #22c55e !important;
        }

        .desktop-platform-item span {
          font-size: 0.9rem;
          font-weight: 500;
        }

        .desktop-progress-section {
          margin: 2rem 0;
        }

        .desktop-status-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .desktop-status-text {
          font-size: 1.1rem;
          margin: 0;
          opacity: 0.9;
          font-weight: 500;
          color: #f8f8ff;
        }

        .desktop-progress-percentage {
          font-size: 1.2rem;
          font-weight: 600;
          color: #9370db;
          text-shadow: 0 0 10px rgba(147, 112, 219, 0.5);
        }

        .desktop-progress-bar {
          width: 100%;
          height: 12px;
          background: 
            linear-gradient(90deg, 
              rgba(15, 15, 35, 0.8) 0%, 
              rgba(26, 26, 46, 0.6) 50%, 
              rgba(15, 15, 35, 0.8) 100%
            );
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 
            inset 0 2px 4px rgba(0, 0, 0, 0.3),
            0 1px 2px rgba(147, 112, 219, 0.2);
          border: 1px solid rgba(147, 112, 219, 0.2);
        }

        .desktop-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, 
            #9370db 0%, 
            #b19cd9 25%, 
            #dda0dd 50%, 
            #e6e6fa 75%, 
            #9370db 100%
          );
          background-size: 200% 100%;
          border-radius: 8px;
          transition: width 0.3s ease;
          position: relative;
          overflow: hidden;
          animation: progressFlow 4s ease-in-out infinite;
          box-shadow: 
            0 0 10px rgba(147, 112, 219, 0.5),
            0 0 20px rgba(147, 112, 219, 0.3);
        }

        .desktop-progress-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.5),
            transparent
          );
          animation: shine 3s ease-in-out infinite;
        }

        .desktop-credits-section {
          text-align: center;
        }

        .desktop-creator-credit {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, 
            rgba(218, 165, 32, 0.12) 0%, 
            rgba(255, 215, 0, 0.08) 50%, 
            rgba(218, 165, 32, 0.12) 100%
          );
          border-radius: 16px;
          backdrop-filter: blur(25px);
          border: 1px solid rgba(218, 165, 32, 0.25);
          animation: creditGlow 6s ease-in-out infinite;
        }

        .desktop-presented-by {
          font-size: 0.9rem;
          margin: 0 0 0.5rem 0;
          opacity: 0.85;
          font-weight: 400;
          letter-spacing: 1px;
          color: #f5deb3;
        }

        .desktop-creator-name {
          font-size: 1.6rem;
          margin: 0;
          font-weight: 600;
          background: linear-gradient(135deg, 
            #ffd700 0%, 
            #fff8dc 25%, 
            #daa520 50%, 
            #ffd700 100%
          );
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 1.5px;
          animation: nameShine 5s ease-in-out infinite;
        }

        .desktop-acknowledgment {
          padding: 1.5rem;
          background: linear-gradient(135deg, 
            rgba(106, 90, 205, 0.12) 0%, 
            rgba(147, 112, 219, 0.08) 50%, 
            rgba(138, 43, 226, 0.12) 100%
          );
          border-radius: 16px;
          backdrop-filter: blur(25px);
          border: 1px solid rgba(147, 112, 219, 0.25);
          animation: vibeGlow 8s ease-in-out infinite;
        }

        .desktop-ack-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 0.8rem;
        }

        .desktop-vibe-icon {
          font-size: 1.2rem;
          animation: vibeElectricity 2s ease-in-out infinite;
          filter: drop-shadow(0 0 10px currentColor);
        }

        .desktop-thanks-text {
          font-size: 0.9rem;
          margin: 0;
          opacity: 0.9;
          font-weight: 500;
          color: #e6e6fa;
        }

        .desktop-cognizant-vibe {
          font-size: 1.4rem;
          margin: 0 0 0.5rem 0;
          font-weight: 600;
          background: linear-gradient(135deg, 
            #9370db 0%, 
            #b19cd9 25%, 
            #dda0dd 50%, 
            #e6e6fa 75%, 
            #9370db 100%
          );
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: vibeTextFlow 6s ease-in-out infinite;
          letter-spacing: 1.5px;
        }

        .desktop-vibe-subtitle {
          font-size: 0.85rem;
          margin: 0;
          opacity: 0.8;
          font-weight: 400;
          font-style: italic;
          color: #d8bfd8;
        }

        /* Right Column Styles */
        .desktop-right-column {
          padding: 3rem 3rem 3rem 0;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .desktop-features-section {
          flex: 1;
        }

        .desktop-features-title {
          font-size: 1.8rem;
          margin: 0 0 1.5rem 0;
          font-weight: 600;
          color: #e6e6fa;
          text-align: center;
          letter-spacing: 1px;
        }

        .desktop-features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .desktop-feature-card {
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          animation: featureFloat 4s ease-in-out infinite;
          text-align: center;
        }

        .desktop-feature-card:nth-child(1) { animation-delay: 0s; }
        .desktop-feature-card:nth-child(2) { animation-delay: 0.5s; }
        .desktop-feature-card:nth-child(3) { animation-delay: 1s; }
        .desktop-feature-card:nth-child(4) { animation-delay: 1.5s; }
        .desktop-feature-card:nth-child(5) { animation-delay: 2s; }
        .desktop-feature-card:nth-child(6) { animation-delay: 2.5s; }

        .desktop-feature-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(147, 112, 219, 0.3);
        }

        .desktop-feature-icon {
          font-size: 2rem;
          margin-bottom: 0.8rem;
        }

        .desktop-feature-card h4 {
          font-size: 1.1rem;
          margin: 0 0 0.5rem 0;
          font-weight: 600;
          color: #ffffff;
        }

        .desktop-feature-card p {
          font-size: 0.9rem;
          margin: 0;
          opacity: 0.8;
          color: #e6e6fa;
          line-height: 1.4;
        }

        .desktop-tips-section {
          text-align: center;
        }

        .desktop-tips-title {
          font-size: 1.5rem;
          margin: 0 0 1rem 0;
          font-weight: 600;
          color: #e6e6fa;
          letter-spacing: 1px;
        }

        .desktop-tip-container {
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .desktop-tip-item {
          font-size: 1rem;
          opacity: 0;
          transform: translateY(20px);
          animation: tipFadeIn 1.5s ease-in-out forwards;
          background: rgba(255, 255, 255, 0.1);
          padding: 1rem 1.5rem;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          font-weight: 500;
        }

        .desktop-loading-animation {
          display: flex;
          justify-content: center;
          gap: 0.8rem;
          margin-top: 1rem;
        }

        .desktop-dot {
          width: 12px;
          height: 12px;
          background: linear-gradient(45deg, #9370db, #dda0dd);
          border-radius: 50%;
          animation: bounce 1.4s ease-in-out infinite both;
          box-shadow: 0 0 10px rgba(147, 112, 219, 0.5);
        }

        .desktop-dot-1 { animation-delay: -0.32s; }
        .desktop-dot-2 { animation-delay: -0.16s; }
        .desktop-dot-3 { animation-delay: 0s; }
        .desktop-dot-4 { animation-delay: 0.16s; }

        /* Animations */
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-8px) scale(1.05); }
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0.4; transform: scale(0.8) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
        }

        @keyframes titleFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 200% 50%; }
        }

        @keyframes platformFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }

        @keyframes progressFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 200% 50%; }
        }

        @keyframes shine {
          0% { left: -100%; opacity: 0; }
          50% { left: 50%; opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }

        @keyframes creditGlow {
          0%, 100% { 
            border-color: rgba(218, 165, 32, 0.25);
            box-shadow: 0 0 20px rgba(218, 165, 32, 0.1);
          }
          50% { 
            border-color: rgba(218, 165, 32, 0.4);
            box-shadow: 0 0 30px rgba(218, 165, 32, 0.2);
          }
        }

        @keyframes nameShine {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 200% 50%; }
        }

        @keyframes vibeGlow {
          0%, 100% { 
            border-color: rgba(147, 112, 219, 0.25);
            box-shadow: 0 0 20px rgba(147, 112, 219, 0.1);
          }
          50% { 
            border-color: rgba(147, 112, 219, 0.4);
            box-shadow: 0 0 30px rgba(147, 112, 219, 0.2);
          }
        }

        @keyframes vibeElectricity {
          0%, 100% { 
            transform: scale(1) rotate(0deg);
            filter: drop-shadow(0 0 8px rgba(147, 112, 219, 0.8));
          }
          50% { 
            transform: scale(1.1) rotate(180deg);
            filter: drop-shadow(0 0 12px rgba(147, 112, 219, 1));
          }
        }

        @keyframes vibeTextFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 200% 50%; }
        }

        @keyframes featureFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }

        @keyframes tipFadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive adjustments for smaller desktop screens */
        @media (max-width: 1200px) {
          .desktop-loading-container {
            max-width: 1000px;
            gap: 3rem;
          }

          .desktop-title {
            font-size: 3rem;
          }

          .desktop-subtitle {
            font-size: 1.2rem;
          }

          .desktop-features-grid {
            grid-template-columns: 1fr;
            gap: 0.8rem;
          }

          .desktop-feature-card {
            padding: 1.2rem;
          }
        }

        /* Stack vertically on tablet-sized screens */
        @media (max-width: 1366px) {
          .desktop-loading-container {
            grid-template-columns: 1fr;
            gap: 2rem;
            height: auto;
            max-height: 95vh;
            max-height: 95dvh;
            overflow-y: auto;
            width: 95vw;
            max-width: 95vw;
          }

          .desktop-left-column,
          .desktop-right-column {
            padding: 2rem;
          }

          .desktop-title {
            font-size: clamp(2rem, 6vw, 3rem);
          }

          .desktop-features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 1024px) {
          .desktop-loading-container {
            width: 98vw;
            height: auto;
            min-height: 90vh;
            min-height: 90dvh;
            padding: 1rem;
          }

          .desktop-title {
            font-size: clamp(1.8rem, 8vw, 2.5rem);
          }

          .desktop-features-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default DesktopLoadingScreen;
