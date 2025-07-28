import React, { useState, useEffect } from 'react';
import { FileEdit, Star, Sparkles } from 'lucide-react';

const LoadingScreen = () => {
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
    "🌟 Use the live preview to see real-time changes"
  ];

  useEffect(() => {
    // Prevent scrolling on body when loading screen is active
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    return () => {
      // Restore scrolling when component unmounts
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, []);

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
        const newProgress = prev + 1.34; // This will reach 100% in about 3 seconds (100/1.34 * 40ms ≈ 3000ms)
        
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
    }, 2500); // Slower tip rotation for better readability with longer duration

    return () => {
      clearInterval(progressInterval);
      clearInterval(tipInterval);
    };
  }, [tips.length]);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        {/* Logo and Title */}
        <div className="loading-header">
          <div className="logo-container">
            <FileEdit className="logo-icon" size={48} />
            <div className="logo-sparkles">
              <Sparkles className="sparkle sparkle-1" size={16} />
              <Star className="sparkle sparkle-2" size={12} />
              <FileEdit className="sparkle sparkle-3" size={14} />
            </div>
          </div>
          <h1 className="loading-title">Resume Builder Pro</h1>
          <p className="loading-subtitle">Creating your professional resume...</p>
          <div className="loading-status">
            <p className="status-text">{loadingStatus}</p>
          </div>
          <div className="creator-credit">
            <p className="presented-by">Presented by</p>
            <p className="creator-name">Mujeeb Ul Haq Qadri</p>
          </div>
          <div className="acknowledgment-section">
            <div className="acknowledgment-header">
              <div className="vibe-icon">⚡</div>
              <p className="thanks-text">Special Thanks to</p>
              <div className="vibe-icon">⚡</div>
            </div>
            <p className="cognizant-vibe">Cognizant Vibe Coding</p>
            <p className="vibe-subtitle">For inspiring innovation & excellence</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            >
              <div className="progress-shine"></div>
            </div>
          </div>
          <div className="progress-text">{progress}%</div>
        </div>

        {/* Loading Tips */}
        <div className="tips-container">
          <div className="tip-wrapper">
            <div 
              className="tip-item active"
              key={currentTip}
            >
              {tips[currentTip]}
            </div>
          </div>
        </div>

        {/* Feature Icons */}
        <div className="features-preview">
          <div className="feature-item">
            <div className="feature-icon">📝</div>
            <span>Smart Forms</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🎨</div>
            <span>Multiple Themes</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">⚡</div>
            <span>Live Preview</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📄</div>
            <span>PDF Export</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">💾</div>
            <span>Auto Save</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📱</div>
            <span>Mobile Ready</span>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="loading-animation">
          <div className="dot dot-1"></div>
          <div className="dot dot-2"></div>
          <div className="dot dot-3"></div>
        </div>
      </div>

      <style jsx>{`
        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          height: 100dvh; /* Dynamic viewport height for mobile browsers */
          max-height: 100vh;
          max-height: 100dvh;
          background: 
            radial-gradient(circle at 25% 25%, rgba(106, 90, 205, 0.3) 0%, transparent 60%),
            radial-gradient(circle at 75% 75%, rgba(72, 61, 139, 0.2) 0%, transparent 60%),
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
          animation: classyScreenGlow 8s ease-in-out infinite;
          will-change: filter;
          padding: clamp(0.5rem, 2vh, 1rem);
          box-sizing: border-box;
        }

        .loading-screen::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            conic-gradient(from 0deg at 50% 50%, 
              transparent 0deg, 
              rgba(106, 90, 205, 0.15) 45deg, 
              transparent 90deg, 
              rgba(147, 112, 219, 0.1) 135deg, 
              transparent 180deg,
              rgba(138, 43, 226, 0.15) 225deg,
              transparent 270deg,
              rgba(123, 104, 238, 0.1) 315deg,
              transparent 360deg
            );
          animation: classyRotate 20s linear infinite;
          filter: blur(1px);
        }

        .loading-screen::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.03) 2px,
              rgba(255, 255, 255, 0.03) 4px
            );
          animation: scanLines 3s linear infinite;
        }

        .loading-content {
          text-align: center;
          color: white;
          width: 100%;
          max-width: min(90vw, 600px);
          height: fit-content;
          max-height: calc(100vh - 2rem);
          max-height: calc(100dvh - 2rem);
          padding: clamp(0.8rem, 2.5vh, 2rem) clamp(0.8rem, 2.5vw, 2rem);
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          overflow: hidden;
          box-sizing: border-box;
          gap: clamp(0.8rem, 2vh, 1.5rem);
          background: 
            linear-gradient(135deg, 
              rgba(15, 15, 35, 0.95) 0%, 
              rgba(26, 26, 46, 0.9) 25%, 
              rgba(22, 33, 62, 0.85) 50%, 
              rgba(26, 26, 46, 0.9) 75%, 
              rgba(15, 15, 35, 0.95) 100%
            );
          border-radius: clamp(12px, 2vw, 24px);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(147, 112, 219, 0.3);
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.5),
            0 8px 32px rgba(106, 90, 205, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2);
          will-change: auto;
        }

        .loading-header {
          margin-bottom: clamp(0.8rem, 2vh, 1.5rem);
          flex-shrink: 0;
          width: 100%;
        }

        .logo-container {
          position: relative;
          display: inline-block;
          margin-bottom: clamp(1rem, 3vh, 2rem);
          padding-bottom: clamp(0.5rem, 1.5vh, 1rem);
        }

        .logo-icon {
          color: #9370db;
          width: clamp(40px, 7vw, 52px);
          height: clamp(40px, 7vw, 52px);
          filter: 
            drop-shadow(0 0 12px rgba(147, 112, 219, 0.6)) 
            drop-shadow(0 0 24px rgba(106, 90, 205, 0.4));
          animation: classyPulse 3s ease-in-out infinite;
          transform-origin: center;
          transition: all 0.3s ease;
          display: block;
          margin: 0 auto;
        }

        .logo-sparkles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .sparkle {
          position: absolute;
          animation: classySparkle 2.5s ease-in-out infinite;
          filter: drop-shadow(0 0 8px currentColor);
          will-change: transform, opacity;
        }

        .sparkle-1 {
          top: -8px;
          right: -8px;
          color: #dda0dd;
          animation-delay: 0s;
          font-size: 16px;
        }

        .sparkle-2 {
          bottom: -4px;
          left: -4px;
          color: #b19cd9;
          animation-delay: 0.8s;
          font-size: 12px;
        }

        .sparkle-3 {
          top: 50%;
          right: -12px;
          color: #9370db;
          animation-delay: 1.6s;
          font-size: 14px;
        }

        .loading-title {
          font-size: clamp(1.8rem, 4.5vw, 2.8rem);
          font-weight: 300;
          margin: clamp(0.5rem, 1.5vh, 1rem) 0 clamp(0.6rem, 1.8vh, 1.2rem) 0;
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
          animation: classyTitleFlow 6s ease-in-out infinite;
          letter-spacing: clamp(0.5px, 0.4vw, 2.5px);
          text-shadow: 0 0 40px rgba(147, 112, 219, 0.3);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.2;
        }

        .loading-subtitle {
          font-size: clamp(0.8rem, 2.2vw, 1rem);
          opacity: 0.8;
          margin: 0 0 clamp(1rem, 2.5vh, 1.8rem) 0;
          font-weight: 400;
          color: #e6e6fa;
          text-shadow: 0 0 8px rgba(230, 230, 250, 0.4);
          animation: classySubtleGlow 4s ease-in-out infinite;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          letter-spacing: clamp(0.2px, 0.1vw, 0.6px);
          line-height: 1.3;
        }

        .loading-status {
          margin: clamp(0.8rem, 2vh, 1.5rem) 0;
          padding: clamp(1rem, 3vw, 1.5rem) clamp(1.5rem, 4.5vw, 2rem);
          background: 
            linear-gradient(135deg, 
              rgba(106, 90, 205, 0.12) 0%, 
              rgba(147, 112, 219, 0.08) 50%, 
              rgba(106, 90, 205, 0.12) 100%
            );
          border-radius: clamp(12px, 3vw, 16px);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(147, 112, 219, 0.2);
          min-height: clamp(50px, 14vw, 65px);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            0 4px 20px rgba(0, 0, 0, 0.1),
            0 1px 3px rgba(147, 112, 219, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          animation: classyStatusPulse 4s ease-in-out infinite;
          width: 100%;
          box-sizing: border-box;
        }

        .status-text {
          font-size: clamp(0.85rem, 2.2vw, 1.05rem);
          margin: 0;
          opacity: 0.9;
          font-weight: 500;
          color: #f8f8ff;
          text-align: center;
          letter-spacing: clamp(0.1px, 0.05vw, 0.4px);
          text-shadow: 0 0 8px rgba(248, 248, 255, 0.3);
          animation: classyStatusGlow 3s ease-in-out infinite;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .creator-credit {
          margin-top: clamp(1rem, 3vh, 2rem);
          margin-bottom: clamp(0.5rem, 1.5vh, 1rem);
          padding: clamp(1rem, 3.5vw, 1.5rem) clamp(1.8rem, 5.5vw, 2.5rem);
          background: linear-gradient(135deg, 
            rgba(218, 165, 32, 0.12) 0%, 
            rgba(255, 215, 0, 0.08) 50%, 
            rgba(218, 165, 32, 0.12) 100%
          );
          border-radius: clamp(16px, 4vw, 20px);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(218, 165, 32, 0.25);
          animation: classyCreditGlow 6s ease-in-out infinite;
          position: relative;
          overflow: hidden;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.1),
            0 2px 8px rgba(218, 165, 32, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          width: 100%;
          box-sizing: border-box;
        }

        .creator-credit::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(from 0deg, 
            transparent, 
            rgba(255, 215, 0, 0.3), 
            transparent, 
            rgba(255, 140, 0, 0.3), 
            transparent
          );
          animation: creditRotate 6s linear infinite;
          z-index: -1;
        }

        .presented-by {
          font-size: clamp(0.75rem, 2vw, 0.85rem);
          margin: 0 0 0.4rem 0;
          opacity: 0.85;
          font-weight: 400;
          letter-spacing: clamp(0.4px, 0.15vw, 0.8px);
          color: #f5deb3;
          text-shadow: 0 0 6px rgba(245, 222, 179, 0.4);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .creator-name {
          font-size: clamp(1rem, 3.5vw, 1.4rem);
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
          letter-spacing: clamp(0.5px, 0.2vw, 1px);
          animation: classyNameShine 5s ease-in-out infinite;
          text-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .acknowledgment-section {
          margin-top: clamp(1rem, 3vh, 2rem);
          margin-bottom: clamp(0.5rem, 1.5vh, 1rem);
          padding: clamp(1.2rem, 4vw, 1.8rem) clamp(1.8rem, 5.5vw, 2.5rem);
          background: linear-gradient(135deg, 
            rgba(106, 90, 205, 0.12) 0%, 
            rgba(147, 112, 219, 0.08) 50%, 
            rgba(138, 43, 226, 0.12) 100%
          );
          border-radius: clamp(16px, 4vw, 20px);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(147, 112, 219, 0.25);
          animation: classyVibeGlow 8s ease-in-out infinite;
          position: relative;
          overflow: hidden;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.1),
            0 2px 8px rgba(147, 112, 219, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          width: 100%;
          box-sizing: border-box;
        }

        .acknowledgment-section::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(from 0deg, 
            transparent, 
            rgba(0, 255, 255, 0.4), 
            transparent, 
            rgba(128, 0, 255, 0.4), 
            transparent,
            rgba(255, 0, 128, 0.4),
            transparent
          );
          animation: extremeVibeRotate 8s linear infinite;
          z-index: -1;
        }

        .acknowledgment-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(0.5rem, 2vw, 1rem);
          margin-bottom: clamp(0.6rem, 2vw, 0.8rem);
        }

        .vibe-icon {
          font-size: clamp(1rem, 3vw, 1.4rem);
          animation: classyVibeElectricity 2s ease-in-out infinite;
          filter: 
            drop-shadow(0 0 10px currentColor) 
            drop-shadow(0 0 20px currentColor);
          will-change: transform, filter;
        }

        .vibe-icon:nth-child(odd) {
          animation-delay: 0.5s;
          color: #b19cd9;
        }

        .vibe-icon:nth-child(even) {
          animation-delay: 1s;
          color: #dda0dd;
        }

        .thanks-text {
          font-size: clamp(0.75rem, 2vw, 0.85rem);
          margin: 0;
          opacity: 0.9;
          font-weight: 500;
          letter-spacing: clamp(0.2px, 0.1vw, 0.5px);
          color: #e6e6fa;
          text-shadow: 0 0 8px rgba(230, 230, 250, 0.4);
          animation: classyThanksGlow 4s ease-in-out infinite;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .cognizant-vibe {
          font-size: clamp(1.1rem, 3.2vw, 1.3rem);
          margin: 0 0 0.4rem 0;
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
          animation: classyVibeTextFlow 6s ease-in-out infinite;
          text-shadow: 0 0 20px rgba(147, 112, 219, 0.4);
          letter-spacing: clamp(0.8px, 0.3vw, 1.5px);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .vibe-subtitle {
          font-size: clamp(0.7rem, 1.8vw, 0.8rem);
          margin: 0;
          opacity: 0.8;
          font-weight: 400;
          font-style: italic;
          color: #d8bfd8;
          animation: classyVibeSubtlePulse 5s ease-in-out infinite;
          text-shadow: 0 0 6px rgba(216, 191, 216, 0.3);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .progress-container {
          margin: clamp(0.5rem, 1.5vh, 1rem) 0;
          position: relative;
          flex-shrink: 0;
        }

        .progress-bar {
          width: 100%;
          height: clamp(6px, 1.5vw, 8px);
          background: 
            linear-gradient(90deg, 
              rgba(15, 15, 35, 0.8) 0%, 
              rgba(26, 26, 46, 0.6) 50%, 
              rgba(15, 15, 35, 0.8) 100%
            );
          border-radius: clamp(8px, 2vw, 12px);
          overflow: hidden;
          box-shadow: 
            inset 0 2px 4px rgba(0, 0, 0, 0.3),
            0 1px 2px rgba(147, 112, 219, 0.1);
          border: 1px solid rgba(147, 112, 219, 0.15);
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, 
            #9370db 0%, 
            #b19cd9 25%, 
            #dda0dd 50%, 
            #e6e6fa 75%, 
            #9370db 100%
          );
          background-size: 200% 100%;
          border-radius: clamp(8px, 2vw, 12px);
          transition: width 0.3s ease;
          position: relative;
          overflow: hidden;
          animation: classyProgressFlow 4s ease-in-out infinite;
          box-shadow: 
            0 0 8px rgba(147, 112, 219, 0.4),
            0 0 16px rgba(147, 112, 219, 0.2);
        }

        .progress-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          animation: classyShine 3s ease-in-out infinite;
        }

        .progress-text {
          margin-top: clamp(0.4rem, 1vw, 0.5rem);
          font-weight: 600;
          font-size: clamp(0.8rem, 2vw, 0.9rem);
          opacity: 0.8;
        }

        .tips-container {
          margin: clamp(0.5rem, 1.5vh, 1rem) 0;
          height: clamp(30px, 5vh, 45px);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .tip-wrapper {
          position: relative;
          width: 100%;
        }

        .tip-item {
          font-size: clamp(0.85rem, 2.5vw, 1rem);
          opacity: 0;
          transform: translateY(20px);
          animation: tipFadeIn 1.5s ease-in-out forwards;
          background: rgba(255, 255, 255, 0.1);
          padding: clamp(0.8rem, 2.5vw, 1rem) clamp(1.2rem, 4vw, 1.5rem);
          border-radius: clamp(20px, 5vw, 25px);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .features-preview {
          display: grid !important;
          grid-template-columns: repeat(3, 1fr) !important;
          gap: clamp(0.6rem, 2.5vw, 1.2rem);
          margin: clamp(0.5rem, 1.5vh, 1rem) 0;
          flex-shrink: 1;
          min-height: 0;
          max-width: min(88vw, 380px);
          width: 100%;
          justify-self: center;
          align-self: center;
          padding: clamp(0.2rem, 0.8vw, 0.4rem);
        }

        .feature-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(0.3rem, 0.8vw, 0.5rem);
          padding: clamp(0.6rem, 2vw, 1rem);
          background: rgba(255, 255, 255, 0.1);
          border-radius: clamp(8px, 2vw, 12px);
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: transform 0.3s ease;
          animation: featureFloatSubtle 4s ease-in-out infinite;
          min-height: clamp(50px, 10vh, 75px);
          max-height: clamp(75px, 15vh, 95px);
          flex-shrink: 0;
          justify-content: center;
          box-sizing: border-box;
          overflow: hidden;
        }

        .feature-item:nth-child(1) { animation-delay: 0s; }
        .feature-item:nth-child(2) { animation-delay: 0.5s; }
        .feature-item:nth-child(3) { animation-delay: 1s; }
        .feature-item:nth-child(4) { animation-delay: 1.5s; }

        .feature-icon {
          font-size: clamp(1.2rem, 3.5vw, 1.6rem);
          margin-bottom: clamp(0.15rem, 0.6vh, 0.25rem);
          flex-shrink: 0;
          color: #9370db;
          filter: drop-shadow(0 0 8px rgba(147, 112, 219, 0.5));
        }

        .feature-item span {
          font-size: clamp(0.6rem, 2.2vw, 0.85rem);
          font-weight: 500;
          text-align: center;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
          flex-shrink: 0;
          color: #f8f8ff;
          text-shadow: 0 0 4px rgba(248, 248, 255, 0.3);
        }

        .loading-animation {
          display: flex;
          justify-content: center;
          gap: clamp(0.5rem, 1.2vw, 0.8rem);
          margin-top: clamp(1rem, 3vh, 2rem);
          margin-bottom: clamp(0.5rem, 1.5vh, 1rem);
          padding: clamp(0.5rem, 1.5vw, 1rem);
          width: 100%;
        }

        .dot {
          width: clamp(8px, 2vw, 10px);
          height: clamp(8px, 2vw, 10px);
          background: white;
          border-radius: 50%;
          animation: bounce 1.4s ease-in-out infinite both;
        }

        .dot-1 { animation-delay: -0.32s; }
        .dot-2 { animation-delay: -0.16s; }
        .dot-3 { animation-delay: 0s; }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }

        @keyframes titleGlow {
          0%, 100% { text-shadow: 0 0 20px rgba(255, 255, 255, 0.5); }
          50% { text-shadow: 0 0 30px rgba(255, 255, 255, 0.8); }
        }

        @keyframes creditGlow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
            transform: scale(1.02);
          }
        }

        @keyframes nameShine {
          0% { 
            background-position: -200% center;
            text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
          }
          50% {
            text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
          }
          100% { 
            background-position: 200% center;
            text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
          }
        }

        @keyframes statusPulse {
          0%, 100% { 
            opacity: 0.85;
            transform: scale(1);
          }
          50% { 
            opacity: 1;
            transform: scale(1.02);
          }
        }

        @keyframes vibeGlow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.2);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.3);
            transform: scale(1.02);
          }
        }

        @keyframes vibeRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes vibeElectricity {
          0%, 100% { 
            transform: scale(1) rotate(0deg);
            filter: drop-shadow(0 0 8px rgba(0, 150, 255, 0.8));
          }
          25% { 
            transform: scale(1.2) rotate(90deg);
            filter: drop-shadow(0 0 12px rgba(255, 0, 150, 0.9));
          }
          50% { 
            transform: scale(0.9) rotate(180deg);
            filter: drop-shadow(0 0 15px rgba(0, 255, 150, 0.8));
          }
          75% { 
            transform: scale(1.1) rotate(270deg);
            filter: drop-shadow(0 0 10px rgba(255, 150, 0, 0.9));
          }
        }

        @keyframes vibeTextFlow {
          0% { 
            background-position: 0% 50%;
            text-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
          }
          50% { 
            background-position: 100% 50%;
            text-shadow: 0 0 40px rgba(139, 92, 246, 0.7);
          }
          100% { 
            background-position: 0% 50%;
            text-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
          }
        }

        @keyframes vibeSubtlePulse {
          0%, 100% { 
            opacity: 0.8;
            transform: translateY(0px);
          }
          50% { 
            opacity: 1;
            transform: translateY(-2px);
          }
        }

        /* Classy Animations */
        @keyframes classyScreenGlow {
          0%, 100% { 
            filter: brightness(1) contrast(1);
          }
          50% { 
            filter: brightness(1.05) contrast(1.02);
          }
        }

        @keyframes classyRotate {
          0% { transform: rotate(0deg); opacity: 0.3; }
          50% { opacity: 0.5; }
          100% { transform: rotate(360deg); opacity: 0.3; }
        }

        /* Removed classyFloat animation to prevent panning effect */
        /*
        @keyframes classyFloat {
          0%, 100% { 
            transform: translateY(0px) scale(1);
            box-shadow: 
              0 20px 60px rgba(0, 0, 0, 0.5),
              0 8px 32px rgba(106, 90, 205, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
          }
          50% { 
            transform: translateY(-8px) scale(1.01);
            box-shadow: 
              0 25px 80px rgba(0, 0, 0, 0.6),
              0 12px 40px rgba(106, 90, 205, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.15);
          }
        }
        */

        @keyframes classyPulse {
          0%, 100% { 
            transform: scale(1);
            filter: 
              drop-shadow(0 0 12px rgba(147, 112, 219, 0.6)) 
              drop-shadow(0 0 24px rgba(106, 90, 205, 0.4));
          }
          50% { 
            transform: scale(1.05);
            filter: 
              drop-shadow(0 0 16px rgba(147, 112, 219, 0.8)) 
              drop-shadow(0 0 32px rgba(106, 90, 205, 0.6));
          }
        }

        @keyframes classyTitleFlow {
          0% { 
            background-position: 0% 50%;
            text-shadow: 0 0 40px rgba(147, 112, 219, 0.3);
          }
          50% { 
            background-position: 100% 50%;
            text-shadow: 0 0 60px rgba(147, 112, 219, 0.5);
          }
          100% { 
            background-position: 200% 50%;
            text-shadow: 0 0 40px rgba(147, 112, 219, 0.3);
          }
        }

        @keyframes classySubtleGlow {
          0%, 100% { 
            opacity: 0.8;
            text-shadow: 0 0 8px rgba(230, 230, 250, 0.4);
          }
          50% { 
            opacity: 0.95;
            text-shadow: 0 0 12px rgba(230, 230, 250, 0.6);
          }
        }

        @keyframes classyStatusPulse {
          0%, 100% { 
            border-color: rgba(147, 112, 219, 0.2);
            box-shadow: 
              0 4px 20px rgba(0, 0, 0, 0.1),
              0 1px 3px rgba(147, 112, 219, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.05);
            transform: scale(1);
          }
          50% { 
            border-color: rgba(147, 112, 219, 0.3);
            box-shadow: 
              0 6px 25px rgba(0, 0, 0, 0.15),
              0 2px 6px rgba(147, 112, 219, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.08);
            transform: scale(1.005);
          }
        }

        @keyframes classyStatusGlow {
          0%, 100% { 
            opacity: 0.9;
            text-shadow: 0 0 8px rgba(248, 248, 255, 0.3);
          }
          50% { 
            opacity: 1;
            text-shadow: 0 0 12px rgba(248, 248, 255, 0.5);
          }
        }

        @keyframes classyProgressFlow {
          0% { 
            background-position: 0% 50%;
            box-shadow: 
              0 0 8px rgba(147, 112, 219, 0.4),
              0 0 16px rgba(147, 112, 219, 0.2);
          }
          50% { 
            background-position: 100% 50%;
            box-shadow: 
              0 0 12px rgba(147, 112, 219, 0.6),
              0 0 24px rgba(147, 112, 219, 0.3);
          }
          100% { 
            background-position: 200% 50%;
            box-shadow: 
              0 0 8px rgba(147, 112, 219, 0.4),
              0 0 16px rgba(147, 112, 219, 0.2);
          }
        }

        @keyframes classyShine {
          0% { 
            left: -100%; 
            opacity: 0;
          }
          50% { 
            left: 50%; 
            opacity: 1;
          }
          100% { 
            left: 100%; 
            opacity: 0;
          }
        }

        @keyframes classyCreditGlow {
          0%, 100% { 
            border-color: rgba(218, 165, 32, 0.25);
            box-shadow: 
              0 8px 32px rgba(0, 0, 0, 0.1),
              0 2px 8px rgba(218, 165, 32, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.05);
          }
          50% { 
            border-color: rgba(218, 165, 32, 0.35);
            box-shadow: 
              0 12px 40px rgba(0, 0, 0, 0.15),
              0 4px 12px rgba(218, 165, 32, 0.25),
              inset 0 1px 0 rgba(255, 255, 255, 0.08);
          }
        }

        @keyframes classyNameShine {
          0% { 
            background-position: 0% 50%;
            text-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
          }
          50% { 
            background-position: 100% 50%;
            text-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
          }
          100% { 
            background-position: 200% 50%;
            text-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
          }
        }

        @keyframes classyVibeGlow {
          0%, 100% { 
            border-color: rgba(147, 112, 219, 0.25);
            box-shadow: 
              0 8px 32px rgba(0, 0, 0, 0.1),
              0 2px 8px rgba(147, 112, 219, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.05);
          }
          50% { 
            border-color: rgba(147, 112, 219, 0.35);
            box-shadow: 
              0 12px 40px rgba(0, 0, 0, 0.15),
              0 4px 12px rgba(147, 112, 219, 0.25),
              inset 0 1px 0 rgba(255, 255, 255, 0.08);
          }
        }

        @keyframes classyThanksGlow {
          0%, 100% { 
            opacity: 0.9;
            text-shadow: 0 0 8px rgba(230, 230, 250, 0.4);
          }
          50% { 
            opacity: 1;
            text-shadow: 0 0 12px rgba(230, 230, 250, 0.6);
          }
        }

        @keyframes classyVibeTextFlow {
          0% { 
            background-position: 0% 50%;
            text-shadow: 0 0 20px rgba(147, 112, 219, 0.4);
          }
          50% { 
            background-position: 100% 50%;
            text-shadow: 0 0 30px rgba(147, 112, 219, 0.6);
          }
          100% { 
            background-position: 200% 50%;
            text-shadow: 0 0 20px rgba(147, 112, 219, 0.4);
          }
        }

        @keyframes classyVibeSubtlePulse {
          0%, 100% { 
            opacity: 0.8;
            text-shadow: 0 0 6px rgba(216, 191, 216, 0.3);
          }
          50% { 
            opacity: 0.95;
            text-shadow: 0 0 10px rgba(216, 191, 216, 0.5);
          }
        }
        @keyframes extremeLoadingPulse {
          0%, 100% { 
            box-shadow: 
              0 0 80px rgba(0, 255, 255, 0.8),
              0 0 160px rgba(128, 0, 255, 0.6),
              inset 0 0 60px rgba(255, 255, 255, 0.15);
            transform: scale(1) rotateZ(0deg);
            filter: hue-rotate(0deg);
          }
          25% { 
            box-shadow: 
              0 0 120px rgba(255, 0, 128, 0.9),
              0 0 200px rgba(255, 64, 0, 0.7),
              inset 0 0 80px rgba(255, 255, 255, 0.2);
            transform: scale(1.02) rotateZ(90deg);
            filter: hue-rotate(90deg);
          }
          50% { 
            box-shadow: 
              0 0 140px rgba(0, 255, 255, 0.9),
              0 0 220px rgba(128, 0, 255, 0.8),
              inset 0 0 100px rgba(255, 255, 255, 0.25);
            transform: scale(1.05) rotateZ(180deg);
            filter: hue-rotate(180deg);
          }
          75% { 
            box-shadow: 
              0 0 120px rgba(255, 64, 0, 0.9),
              0 0 200px rgba(255, 0, 128, 0.7),
              inset 0 0 80px rgba(255, 255, 255, 0.2);
            transform: scale(1.02) rotateZ(270deg);
            filter: hue-rotate(270deg);
          }
        }

        @keyframes extremeSpinShine {
          0% { 
            transform: scale(1) rotate(0deg);
            filter: 
              drop-shadow(0 0 40px #00ffff)
              drop-shadow(0 0 80px #ff0080)
              brightness(1.2);
          }
          25% { 
            transform: scale(1.1) rotate(90deg);
            filter: 
              drop-shadow(0 0 50px #8000ff)
              drop-shadow(0 0 100px #ff4000)
              brightness(1.5);
          }
          50% { 
            transform: scale(1.2) rotate(180deg);
            filter: 
              drop-shadow(0 0 60px #00ffff)
              drop-shadow(0 0 120px #ff0080)
              brightness(1.8);
          }
          75% { 
            transform: scale(1.1) rotate(270deg);
            filter: 
              drop-shadow(0 0 50px #ff4000)
              drop-shadow(0 0 100px #8000ff)
              brightness(1.5);
          }
          100% { 
            transform: scale(1) rotate(360deg);
            filter: 
              drop-shadow(0 0 40px #00ffff)
              drop-shadow(0 0 80px #ff0080)
              brightness(1.2);
          }
        }

        @keyframes extremeTitleFlow {
          0% { 
            background-position: 0% 50%;
            text-shadow: 
              0 0 30px #00ffff,
              0 0 60px #8000ff,
              2px 2px 0 rgba(0, 0, 0, 0.8);
            transform: perspective(500px) rotateX(0deg) rotateY(0deg);
          }
          25% { 
            background-position: 100% 50%;
            text-shadow: 
              0 0 40px #ff0080,
              0 0 80px #ff4000,
              3px 3px 0 rgba(0, 0, 0, 0.9);
            transform: perspective(500px) rotateX(5deg) rotateY(5deg);
          }
          50% { 
            background-position: 200% 50%;
            text-shadow: 
              0 0 50px #00ffff,
              0 0 100px #8000ff,
              4px 4px 0 rgba(0, 0, 0, 1);
            transform: perspective(500px) rotateX(0deg) rotateY(10deg);
          }
          75% { 
            background-position: 300% 50%;
            text-shadow: 
              0 0 40px #ff4000,
              0 0 80px #ff0080,
              3px 3px 0 rgba(0, 0, 0, 0.9);
            transform: perspective(500px) rotateX(-5deg) rotateY(5deg);
          }
          100% { 
            background-position: 400% 50%;
            text-shadow: 
              0 0 30px #00ffff,
              0 0 60px #8000ff,
              2px 2px 0 rgba(0, 0, 0, 0.8);
            transform: perspective(500px) rotateX(0deg) rotateY(0deg);
          }
        }

        @keyframes extremeStatusGlow {
          0%, 100% { 
            color: #00ffff;
            text-shadow: 
              0 0 20px #00ffff,
              0 0 40px #00ffff,
              0 0 60px #00ffff;
            transform: scale(1);
          }
          25% { 
            color: #ff0080;
            text-shadow: 
              0 0 25px #ff0080,
              0 0 50px #ff0080,
              0 0 75px #ff0080;
            transform: scale(1.05);
          }
          50% { 
            color: #8000ff;
            text-shadow: 
              0 0 30px #8000ff,
              0 0 60px #8000ff,
              0 0 90px #8000ff;
            transform: scale(1.1);
          }
          75% { 
            color: #ff4000;
            text-shadow: 
              0 0 25px #ff4000,
              0 0 50px #ff4000,
              0 0 75px #ff4000;
            transform: scale(1.05);
          }
        }

        @keyframes extremeProgressFlow {
          0% { 
            background-position: 0% 50%;
            box-shadow: 
              0 0 30px rgba(0, 255, 255, 0.8),
              inset 0 0 20px rgba(255, 255, 255, 0.3);
          }
          25% { 
            background-position: 50% 50%;
            box-shadow: 
              0 0 40px rgba(255, 0, 128, 0.9),
              inset 0 0 25px rgba(255, 255, 255, 0.4);
          }
          50% { 
            background-position: 100% 50%;
            box-shadow: 
              0 0 50px rgba(128, 0, 255, 1),
              inset 0 0 30px rgba(255, 255, 255, 0.5);
          }
          75% { 
            background-position: 150% 50%;
            box-shadow: 
              0 0 40px rgba(255, 64, 0, 0.9),
              inset 0 0 25px rgba(255, 255, 255, 0.4);
          }
          100% { 
            background-position: 200% 50%;
            box-shadow: 
              0 0 30px rgba(0, 255, 255, 0.8),
              inset 0 0 20px rgba(255, 255, 255, 0.3);
          }
        }

        @keyframes extremeShine {
          0% { left: -100%; filter: brightness(1); }
          50% { left: 50%; filter: brightness(2.5); }
          100% { left: 100%; filter: brightness(1); }
        }

        @keyframes extremeStatusPulse {
          0%, 100% { 
            border-image: linear-gradient(45deg, #00ffff, #8000ff, #ff0080, #00ffff) 1;
            box-shadow: 
              0 0 30px rgba(0, 255, 255, 0.6),
              0 0 60px rgba(128, 0, 255, 0.4),
              inset 0 0 25px rgba(255, 255, 255, 0.1);
            transform: scale(1);
          }
          50% { 
            border-image: linear-gradient(45deg, #ff0080, #ff4000, #00ffff, #8000ff) 1;
            box-shadow: 
              0 0 50px rgba(255, 0, 128, 0.8),
              0 0 100px rgba(255, 64, 0, 0.6),
              inset 0 0 40px rgba(255, 255, 255, 0.15);
            transform: scale(1.02);
          }
        }

        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
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

        @keyframes featureFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        @keyframes featureFloatSubtle {
          0%, 100% { 
            transform: translateY(0px) scale(1);
            box-shadow: 0 2px 8px rgba(147, 112, 219, 0.2);
          }
          50% { 
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 4px 12px rgba(147, 112, 219, 0.3);
          }
        }

        @keyframes classyVibeElectricity {
          0%, 100% { 
            transform: scale(1) rotate(0deg);
            filter: 
              drop-shadow(0 0 10px currentColor) 
              drop-shadow(0 0 20px currentColor);
          }
          50% { 
            transform: scale(1.1) rotate(180deg);
            filter: 
              drop-shadow(0 0 15px currentColor) 
              drop-shadow(0 0 25px currentColor);
          }
        }

        @keyframes classySparkle {
          0%, 100% { 
            opacity: 0.4; 
            transform: scale(0.8) rotate(0deg); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.2) rotate(180deg); 
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

        /* Responsive Design for Different Screen Sizes */
        
        /* Desktop Base Styles (1024px+) to ensure proper visibility */
        @media (min-width: 1024px) {
          .loading-content {
            min-width: 500px;
          }

          .loading-title {
            min-font-size: 2.5rem;
          }

          .loading-subtitle {
            min-font-size: 1rem;
          }

          .status-text {
            min-font-size: 0.9rem;
          }

          .creator-name {
            min-font-size: 1.2rem;
          }

          .cognizant-vibe {
            min-font-size: 1.2rem;
          }

          .feature-icon {
            min-font-size: 1.5rem;
          }

          .feature-item span {
            min-font-size: 0.8rem;
          }
        }
        
        /* Large Desktop Screens (1440px+) */
        @media (min-width: 1440px) {
          .loading-content {
            max-width: 700px;
            padding: 4.5rem 3.5rem;
          }

          .loading-header {
            margin-bottom: 3.5rem;
          }

          .loading-title {
            font-size: 3.5rem;
            letter-spacing: 3px;
            margin-bottom: 1rem;
          }

          .loading-subtitle {
            font-size: 1.3rem;
            margin-bottom: 2rem;
          }

          .loading-status {
            margin: 1.8rem 0;
            padding: 1.3rem 2.2rem;
            min-height: 60px;
          }

          .status-text {
            font-size: 1.1rem;
          }

          .creator-credit {
            margin-top: 2.5rem;
            padding: 1.5rem 2.5rem;
          }

          .presented-by {
            font-size: 0.95rem;
            margin-bottom: 0.6rem;
          }

          .creator-name {
            font-size: 1.8rem;
            letter-spacing: 1.5px;
          }

          .acknowledgment-section {
            margin-top: 2.5rem;
            padding: 1.8rem 2.5rem;
          }

          .acknowledgment-header {
            gap: 1.2rem;
            margin-bottom: 1rem;
          }

          .vibe-icon {
            font-size: 1.6rem;
          }

          .thanks-text {
            font-size: 0.95rem;
          }

          .cognizant-vibe {
            font-size: 1.6rem;
            letter-spacing: 2px;
          }

          .vibe-subtitle {
            font-size: 0.9rem;
          }

          .features-preview {
            gap: 1.8rem;
            margin: 2.5rem 0;
          }

          .feature-item {
            padding: 1.8rem 1.2rem;
          }

          .feature-icon {
            font-size: 2.2rem;
          }

          .feature-item span {
            font-size: 1.1rem;
            font-weight: 600;
          }

          .tip-item {
            font-size: 1.1rem;
            padding: 1.3rem 2rem;
          }

          .tips-container {
            height: 70px;
            margin: 2.5rem 0;
          }

          .progress-container {
            margin: 2.5rem 0;
          }

          .progress-bar {
            height: 10px;
          }

          .progress-text {
            font-size: 1rem;
            margin-top: 0.7rem;
          }

          .loading-animation {
            margin-top: 2.5rem;
            gap: 0.7rem;
          }

          .dot {
            width: 12px;
            height: 12px;
          }
        }

        /* Standard Desktop Screens (1024px - 1439px) */
        @media (min-width: 1024px) and (max-width: 1439px) {
          .loading-content {
            max-width: 600px;
            padding: 3.5rem 3rem;
          }

          .loading-header {
            margin-bottom: 3rem;
          }

          .loading-title {
            font-size: 3rem;
            letter-spacing: 2px;
          }

          .loading-subtitle {
            font-size: 1.1rem;
            margin-bottom: 1.8rem;
          }

          .loading-status {
            margin: 1.5rem 0;
            padding: 1.1rem 2rem;
            min-height: 56px;
          }

          .status-text {
            font-size: 1rem;
          }

          .creator-credit {
            margin-top: 2rem;
            padding: 1.3rem 2.2rem;
          }

          .presented-by {
            font-size: 0.9rem;
          }

          .creator-name {
            font-size: 1.5rem;
            letter-spacing: 1.2px;
          }

          .acknowledgment-section {
            margin-top: 2rem;
            padding: 1.5rem 2.2rem;
          }

          .acknowledgment-header {
            gap: 1rem;
            margin-bottom: 0.9rem;
          }

          .vibe-icon {
            font-size: 1.4rem;
          }

          .thanks-text {
            font-size: 0.9rem;
          }

          .cognizant-vibe {
            font-size: 1.4rem;
            letter-spacing: 1.5px;
          }

          .vibe-subtitle {
            font-size: 0.85rem;
          }

          .features-preview {
            gap: 1.3rem;
            margin: 2rem 0;
          }

          .feature-item {
            padding: 1.3rem;
          }

          .feature-icon {
            font-size: 1.8rem;
          }

          .feature-item span {
            font-size: 0.9rem;
            font-weight: 500;
          }

          .tip-item {
            font-size: 1rem;
            padding: 1.1rem 1.8rem;
          }

          .tips-container {
            height: 65px;
            margin: 2rem 0;
          }

          .progress-container {
            margin: 2rem 0;
          }

          .progress-bar {
            height: 9px;
          }

          .progress-text {
            font-size: 0.95rem;
            margin-top: 0.6rem;
          }

          .loading-animation {
            margin-top: 2rem;
            gap: 0.6rem;
          }

          .dot {
            width: 11px;
            height: 11px;
          }
        }

        /* Tablet Portrait Mode (768px - 1024px, portrait) */
        @media (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
          body {
            overflow: hidden;
          }
          
          .loading-wrapper {
            overflow: hidden;
            max-height: 100vh;
            max-height: 100dvh;
          }
          
          .loading-content {
            max-width: 600px;
            max-height: calc(100vh - 3rem);
            max-height: calc(100dvh - 3rem);
            padding: 2rem;
            overflow-y: auto;
            overflow-x: hidden;
            gap: clamp(1rem, 2vh, 1.5rem);
          }

          .features-preview {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: clamp(1rem, 2.5vw, 1.5rem);
            margin: clamp(1rem, 2vh, 1.5rem) 0;
            max-width: min(80vw, 500px);
            padding: clamp(0.4rem, 1vw, 0.8rem);
          }
          
          .feature-item {
            min-height: clamp(70px, 8vh, 90px);
            max-height: clamp(90px, 12vh, 110px);
            padding: clamp(1rem, 2.5vw, 1.5rem);
            box-sizing: border-box;
          }
          
          .feature-icon {
            font-size: clamp(1.6rem, 3.5vw, 2rem);
            margin-bottom: clamp(0.25rem, 0.6vh, 0.35rem);
          }
          
          .feature-item span {
            font-size: clamp(0.8rem, 2vw, 1rem);
            line-height: 1.3;
          }
        }

        /* Tablets and Small Laptops (768px - 1023px) */
        @media (min-width: 768px) and (max-width: 1023px) {
          .loading-content {
            max-width: 520px;
            max-height: calc(100vh - 2rem);
            max-height: calc(100dvh - 2rem);
            padding: 2.5rem 2rem;
            overflow-y: auto;
            overflow-x: hidden;
            gap: clamp(1rem, 2vh, 1.5rem);
          }

          .loading-title {
            font-size: 2.4rem;
            letter-spacing: 1.5px;
          }

          .loading-subtitle {
            font-size: 0.95rem;
          }

          .features-preview {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: clamp(0.8rem, 2vw, 1.2rem);
            margin: clamp(0.8rem, 1.5vh, 1.2rem) 0;
            max-width: min(85vw, 450px);
            padding: clamp(0.3rem, 1vw, 0.6rem);
          }
          
          .feature-item {
            min-height: clamp(60px, 8vh, 80px);
            max-height: clamp(80px, 12vh, 100px);
            padding: clamp(0.8rem, 2vw, 1.2rem);
            box-sizing: border-box;
          }
          
          .feature-icon {
            font-size: clamp(1.4rem, 3vw, 1.8rem);
            margin-bottom: clamp(0.2rem, 0.5vh, 0.3rem);
          }
          
          .feature-item span {
            font-size: clamp(0.7rem, 1.8vw, 0.9rem);
            line-height: 1.2;
          }

          .loading-status {
            padding: 0.8rem 1.5rem;
            min-height: 50px;
          }

          .status-text {
            font-size: 0.9rem;
          }

          .creator-credit {
            padding: 1rem 1.5rem;
          }

          .creator-name {
            font-size: 1.3rem;
          }

          .acknowledgment-section {
            padding: 1.2rem 1.5rem;
          }

          .cognizant-vibe {
            font-size: 1.25rem;
          }

          .features-preview {
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
          }

          .feature-item {
            padding: 1rem;
          }

          .feature-icon {
            font-size: 1.4rem;
          }

          .feature-item span {
            font-size: 0.8rem;
          }

          .tip-item {
            font-size: 0.95rem;
            padding: 1rem 1.5rem;
          }
        }

        /* Tablet Landscape Mode (768px - 1024px, landscape) */
        @media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
          body {
            overflow: hidden;
          }
          
          .loading-wrapper {
            overflow: hidden;
            max-height: 100vh;
            max-height: 100dvh;
          }
          
          .loading-content {
            max-width: 700px;
            max-height: calc(100vh - 2rem);
            max-height: calc(100dvh - 2rem);
            padding: 1.5rem 2rem;
            overflow-y: auto;
            overflow-x: hidden;
            gap: clamp(0.8rem, 1.5vh, 1.2rem);
          }

          .features-preview {
            display: grid !important;
            grid-template-columns: repeat(4, 1fr) !important;
            gap: clamp(0.8rem, 2vw, 1.2rem);
            margin: clamp(0.8rem, 1.5vh, 1.2rem) 0;
            max-width: min(85vw, 600px);
            padding: clamp(0.3rem, 0.8vw, 0.6rem);
          }
          
          .feature-item {
            min-height: clamp(60px, 8vh, 75px);
            max-height: clamp(75px, 10vh, 90px);
            padding: clamp(0.8rem, 2vw, 1.2rem);
            box-sizing: border-box;
          }
          
          .feature-icon {
            font-size: clamp(1.3rem, 3vw, 1.6rem);
            margin-bottom: clamp(0.2rem, 0.5vh, 0.3rem);
          }
          
          .feature-item span {
            font-size: clamp(0.7rem, 1.8vw, 0.9rem);
            line-height: 1.2;
          }
        }

        /* Mobile Landscape and Small Tablets (641px - 767px) */
        @media (min-width: 641px) and (max-width: 767px) {
          .loading-content {
            max-width: 95%;
            max-height: calc(100vh - 2rem);
            max-height: calc(100dvh - 2rem);
            padding: 2rem 1.5rem;
            overflow-y: auto;
            overflow-x: hidden;
            gap: clamp(0.8rem, 1.5vh, 1.2rem);
          }

          .loading-title {
            font-size: 2.2rem;
            letter-spacing: 1px;
          }

          .loading-subtitle {
            font-size: 0.9rem;
          }

          .features-preview {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: clamp(0.6rem, 2vw, 1rem);
            margin: clamp(0.6rem, 1.2vh, 1rem) 0;
            max-width: min(90vw, 400px);
            padding: clamp(0.2rem, 0.8vw, 0.4rem);
          }
          
          .feature-item {
            min-height: clamp(55px, 7vh, 70px);
            max-height: clamp(70px, 10vh, 85px);
            padding: clamp(0.6rem, 1.8vw, 0.9rem);
            box-sizing: border-box;
          }
          
          .feature-icon {
            font-size: clamp(1.2rem, 2.8vw, 1.5rem);
            margin-bottom: clamp(0.15rem, 0.4vh, 0.2rem);
          }
          
          .feature-item span {
            font-size: clamp(0.6rem, 1.6vw, 0.8rem);
            line-height: 1.2;
          }

          .loading-status {
            margin: 1rem 0;
            padding: 0.8rem 1.2rem;
            min-height: 48px;
          }

          .status-text {
            font-size: 0.88rem;
          }

          .creator-credit {
            margin-top: 1.2rem;
            padding: 0.9rem 1.3rem;
          }

          .presented-by {
            font-size: 0.82rem;
          }

          .creator-name {
            font-size: 1.2rem;
          }

          .acknowledgment-section {
            margin-top: 1.2rem;
            padding: 1.1rem 1.3rem;
          }

          .cognizant-vibe {
            font-size: 1.2rem;
            letter-spacing: 1.2px;
          }
            gap: 0.9rem;
          }

          .feature-item {
            padding: 0.9rem;
          }

          .feature-icon {
            font-size: 1.3rem;
          }

          .feature-item span {
            font-size: 0.75rem;
          }

          .tip-item {
            font-size: 0.9rem;
            padding: 0.9rem 1.3rem;
          }
        }

        /* Mobile Portrait (481px - 640px) */
        @media (min-width: 481px) and (max-width: 640px) {
          .loading-content {
            max-width: 95%;
            padding: 1.8rem 1.2rem;
          }

          .loading-header {
            margin-bottom: 2.5rem;
          }

          .logo-icon {
            width: 42px;
            height: 42px;
          }

          .loading-title {
            font-size: 2rem;
            letter-spacing: 0.8px;
          }

          .loading-subtitle {
            font-size: 0.88rem;
          }

          .loading-status {
            margin: 0.9rem 0;
            padding: 0.7rem 1rem;
            min-height: 46px;
          }

          .status-text {
            font-size: 0.85rem;
            letter-spacing: 0.2px;
          }

          .creator-credit {
            margin-top: 1rem;
            padding: 0.8rem 1.1rem;
          }

          .presented-by {
            font-size: 0.8rem;
          }

          .creator-name {
            font-size: 1.15rem;
            letter-spacing: 0.8px;
          }

          .acknowledgment-section {
            margin-top: 1rem;
            padding: 1rem 1.1rem;
          }

          .acknowledgment-header {
            gap: 0.7rem;
            margin-bottom: 0.7rem;
          }

          .vibe-icon {
            font-size: 1.1rem;
          }

          .thanks-text {
            font-size: 0.8rem;
          }

          .cognizant-vibe {
            font-size: 1.15rem;
            letter-spacing: 1px;
          }

          .vibe-subtitle {
            font-size: 0.75rem;
          }

          .features-preview {
            grid-template-columns: repeat(3, 1fr);
            gap: clamp(0.25rem, 1vw, 0.4rem);
            margin: clamp(0.4rem, 1.2vh, 0.8rem) 0;
            max-width: min(98vw, 320px);
          }

          .feature-item {
            padding: clamp(0.25rem, 0.8vw, 0.4rem);
            min-height: clamp(22px, 4.5vh, 28px);
          }

          .feature-icon {
            font-size: clamp(0.8rem, 2.2vw, 1rem);
          }

          .feature-item span {
            font-size: clamp(0.4rem, 1.3vw, 0.55rem);
            line-height: 1;
          }

          .tip-item {
            font-size: 0.85rem;
            padding: 0.8rem 1.1rem;
          }

          .tips-container {
            height: 55px;
          }

          .progress-container {
            margin: 1.5rem 0;
          }

          .progress-text {
            font-size: 0.85rem;
          }
        }

        /* Small Mobile Devices (320px - 480px) */
        @media (max-width: 480px) {
          .loading-content {
            max-width: 95%;
            padding: clamp(0.8rem, 2vh, 1.2rem) clamp(0.8rem, 2vw, 1rem);
          }

          .loading-header {
            margin-bottom: clamp(0.8rem, 2vh, 1.2rem);
          }

          .logo-icon {
            width: 38px;
            height: 38px;
          }

          .sparkle-1 {
            font-size: 14px;
            top: -6px;
            right: -6px;
          }

          .sparkle-2 {
            font-size: 10px;
            bottom: -3px;
            left: -3px;
          }

          .sparkle-3 {
            font-size: 12px;
            right: -10px;
          }

          .loading-title {
            font-size: 1.8rem;
            letter-spacing: 0.5px;
          }

          .loading-subtitle {
            font-size: 0.85rem;
          }

          .loading-status {
            margin: 0.8rem 0;
            padding: 0.6rem 0.9rem;
            min-height: 42px;
          }

          .status-text {
            font-size: 0.8rem;
            letter-spacing: 0.1px;
          }

          .creator-credit {
            margin-top: 0.8rem;
            padding: 0.7rem 0.9rem;
          }

          .presented-by {
            font-size: 0.75rem;
          }

          .creator-name {
            font-size: 1rem;
            letter-spacing: 0.6px;
          }

          .acknowledgment-section {
            margin-top: 0.8rem;
            padding: 0.9rem 0.9rem;
          }

          .acknowledgment-header {
            gap: 0.5rem;
            margin-bottom: 0.6rem;
          }

          .vibe-icon {
            font-size: 1rem;
          }

          .thanks-text {
            font-size: 0.75rem;
          }

          .cognizant-vibe {
            font-size: 1.05rem;
            letter-spacing: 0.8px;
          }

          .vibe-subtitle {
            font-size: 0.7rem;
          }

          .features-preview {
            grid-template-columns: repeat(3, 1fr);
            gap: clamp(0.2rem, 0.8vw, 0.35rem);
            margin: clamp(0.3rem, 1vh, 0.6rem) 0;
            max-width: min(99vw, 280px);
          }

          .feature-item {
            padding: clamp(0.2rem, 0.6vw, 0.35rem);
            min-height: clamp(20px, 4vh, 25px);
          }

          .feature-icon {
            font-size: clamp(0.7rem, 2vw, 0.9rem);
          }

          .feature-item span {
            font-size: clamp(0.35rem, 1.1vw, 0.5rem);
            font-weight: 500;
            line-height: 0.9;
          }

          .tip-item {
            font-size: 0.8rem;
            padding: 0.7rem 0.9rem;
          }

          .tips-container {
            height: 52px;
            margin: 1.2rem 0;
          }

          .progress-container {
            margin: 1.2rem 0;
          }

          .progress-bar {
            height: 6px;
          }

          .progress-text {
            font-size: 0.8rem;
            margin-top: 0.4rem;
          }

          .loading-animation {
            margin-top: 1.5rem;
          }

          .dot {
            width: 8px;
            height: 8px;
          }
        }

        /* Extra Small Mobile Devices (Below 320px) */
        @media (max-width: 319px) {
          .loading-content {
            max-width: 98%;
            padding: clamp(0.6rem, 1.5vh, 1rem) clamp(0.6rem, 1.5vw, 0.8rem);
          }

          .loading-header {
            margin-bottom: clamp(0.6rem, 1.5vh, 1rem);
          }

          .logo-icon {
            width: 32px;
            height: 32px;
          }

          .loading-title {
            font-size: 1.5rem;
            letter-spacing: 0.3px;
          }

          .loading-subtitle {
            font-size: 0.8rem;
          }

          .loading-status {
            margin: 0.6rem 0;
            padding: 0.5rem 0.7rem;
            min-height: 38px;
          }

          .status-text {
            font-size: 0.75rem;
            letter-spacing: 0px;
          }

          .creator-credit {
            margin-top: 0.6rem;
            padding: 0.6rem 0.7rem;
          }

          .presented-by {
            font-size: 0.7rem;
          }

          .creator-name {
            font-size: 0.9rem;
            letter-spacing: 0.4px;
          }

          .acknowledgment-section {
            margin-top: 0.6rem;
            padding: 0.7rem 0.7rem;
          }

          .thanks-text {
            font-size: 0.7rem;
          }

          .cognizant-vibe {
            font-size: 0.95rem;
            letter-spacing: 0.6px;
          }

          .vibe-subtitle {
            font-size: 0.65rem;
          }

          .features-preview {
            grid-template-columns: 1fr 1fr;
            gap: 0.4rem;
            margin: 1rem 0;
          }

          .feature-item {
            padding: 0.5rem 0.3rem;
          }

          .feature-icon {
            font-size: 1rem;
          }

          .feature-item span {
            font-size: 0.62rem;
          }

          .tip-item {
            font-size: 0.75rem;
            padding: 0.6rem 0.7rem;
          }

          .tips-container {
            height: 48px;
            margin: 1rem 0;
          }

          .progress-container {
            margin: 1rem 0;
          }

          .progress-bar {
            height: 5px;
          }

          .progress-text {
            font-size: 0.75rem;
            margin-top: 0.3rem;
          }

          .dot {
            width: 6px;
            height: 6px;
            gap: 0.3rem;
          }
        }

        /* Landscape Orientation Adjustments */
        @media (max-height: 500px) and (orientation: landscape) {
          .loading-content {
            padding: clamp(0.5rem, 1vh, 1rem);
          }

          .loading-header {
            margin-bottom: clamp(0.5rem, 1vh, 1rem);
          }

          .loading-title {
            font-size: clamp(1.2rem, 4vw, 1.5rem);
          }

          .loading-subtitle {
            font-size: clamp(0.7rem, 2vw, 0.8rem);
          }

          .creator-credit, .acknowledgment-section {
            margin-top: clamp(0.3rem, 1vh, 0.5rem);
            padding: clamp(0.3rem, 1vh, 0.5rem) clamp(0.5rem, 2vw, 1rem);
          }

          .features-preview {
            grid-template-columns: repeat(4, 1fr);
            gap: clamp(0.3rem, 1vw, 0.5rem);
            margin: clamp(0.5rem, 1vh, 1rem) 0;
          }

          .feature-item {
            padding: clamp(0.3rem, 1vh, 0.5rem);
          }

          .feature-icon {
            font-size: clamp(0.8rem, 2vw, 1rem);
          }

          .feature-item span {
            font-size: clamp(0.6rem, 1.5vw, 0.65rem);
          }

          .tips-container {
            height: clamp(30px, 6vh, 40px);
            margin: clamp(0.5rem, 1vh, 0.8rem) 0;
          }

          .tip-item {
            font-size: clamp(0.65rem, 1.8vw, 0.75rem);
            padding: clamp(0.3rem, 1vh, 0.5rem) clamp(0.5rem, 2vw, 1rem);
          }

          .progress-container {
            margin: clamp(0.5rem, 1vh, 0.8rem) 0;
          }
        }

        /* Very Small Height Mobile Screens (Portrait) */
        @media (max-height: 600px) and (orientation: portrait) {
          .loading-content {
            padding: clamp(0.6rem, 1.5vh, 1rem) clamp(0.8rem, 2vw, 1rem);
          }

          .loading-header {
            margin-bottom: clamp(0.6rem, 1.5vh, 1rem);
          }

          .creator-credit, .acknowledgment-section {
            margin-top: clamp(0.3rem, 1vh, 0.5rem);
            padding: clamp(0.3rem, 1vh, 0.5rem) clamp(0.5rem, 2vw, 0.8rem);
          }

          .features-preview {
            margin: clamp(0.5rem, 1.5vh, 0.8rem) 0;
            gap: clamp(0.3rem, 1vw, 0.5rem);
          }

          .tips-container {
            margin: clamp(0.5rem, 1.5vh, 0.8rem) 0;
          }

          .progress-container {
            margin: clamp(0.5rem, 1.5vh, 0.8rem) 0;
          }

          .loading-animation {
            margin-top: clamp(0.8rem, 2vh, 1rem);
          }
        }

        /* Ultra Small Height Mobile Screens */
        @media (max-height: 500px) and (orientation: portrait) {
          .loading-content {
            padding: clamp(0.4rem, 1vh, 0.6rem) clamp(0.6rem, 1.5vw, 0.8rem);
          }

          .loading-header {
            margin-bottom: clamp(0.4rem, 1vh, 0.6rem);
          }

          .logo-icon {
            width: clamp(28px, 6vw, 32px);
            height: clamp(28px, 6vw, 32px);
          }

          .loading-title {
            font-size: clamp(1.2rem, 4vw, 1.4rem);
            margin-bottom: clamp(0.2rem, 0.5vh, 0.3rem);
          }

          .loading-subtitle {
            font-size: clamp(0.65rem, 2vw, 0.75rem);
            margin-bottom: clamp(0.3rem, 1vh, 0.5rem);
          }

          .creator-credit, .acknowledgment-section {
            margin-top: clamp(0.2rem, 0.5vh, 0.3rem);
            padding: clamp(0.2rem, 0.5vh, 0.4rem) clamp(0.4rem, 1vw, 0.6rem);
          }

          .features-preview {
            grid-template-columns: repeat(4, 1fr);
            margin: clamp(0.3rem, 1vh, 0.5rem) 0;
            gap: clamp(0.2rem, 0.5vw, 0.3rem);
          }

          .feature-item {
            padding: clamp(0.2rem, 0.5vh, 0.4rem) clamp(0.1rem, 0.5vw, 0.2rem);
          }

          .feature-icon {
            font-size: clamp(0.8rem, 2vw, 0.9rem);
          }

          .feature-item span {
            font-size: clamp(0.55rem, 1.5vw, 0.6rem);
          }

          .tips-container {
            height: clamp(25px, 4vh, 35px);
            margin: clamp(0.3rem, 1vh, 0.5rem) 0;
          }

          .tip-item {
            font-size: clamp(0.6rem, 1.5vw, 0.7rem);
            padding: clamp(0.2rem, 0.5vh, 0.4rem) clamp(0.4rem, 1vw, 0.6rem);
          }

          .progress-container {
            margin: clamp(0.3rem, 1vh, 0.5rem) 0;
          }

          .loading-animation {
            margin-top: clamp(0.5rem, 1.5vh, 0.8rem);
          }

          .dot {
            width: clamp(5px, 1.5vw, 6px);
            height: clamp(5px, 1.5vw, 6px);
          }
        }
          }

          .loading-animation {
            margin-top: 1rem;
          }
        }

        /* High DPI Displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .loading-title {
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          .status-text, .creator-name, .cognizant-vibe {
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        }

        /* Reduced Motion for Accessibility */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }

          .loading-screen::before,
          .loading-screen::after {
            animation: none;
          }

          .logo-sparkles .sparkle {
            animation: none;
            opacity: 0.7;
          }

          .progress-shine {
            animation: none;
          }
        }
        /* Very small mobile screens - hide non-essential content */
        @media screen and (max-height: 600px) {
          .loading-content {
            gap: clamp(0.6rem, 1.5vh, 1rem);
            padding: clamp(0.6rem, 2vh, 1.5rem) clamp(0.6rem, 2vw, 1.5rem);
          }
          
          .features-preview {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: clamp(0.5rem, 2vw, 0.8rem);
            margin: clamp(0.4rem, 1vh, 0.6rem) 0;
            max-width: min(85vw, 320px);
            padding: clamp(0.15rem, 0.6vw, 0.3rem);
          }
          
          .feature-item {
            min-height: clamp(45px, 8vh, 55px);
            max-height: clamp(55px, 10vh, 70px);
            padding: clamp(0.5rem, 1.8vw, 0.7rem);
            box-sizing: border-box;
          }
          
          .feature-icon {
            font-size: clamp(1rem, 3vw, 1.2rem);
            margin-bottom: clamp(0.1rem, 0.4vh, 0.15rem);
          }
          
          .feature-item span {
            font-size: clamp(0.5rem, 1.8vw, 0.65rem);
            line-height: 1.1;
          }
          
          .acknowledgment-section {
            display: none;
          }
          
          .loading-status {
            margin: clamp(0.5rem, 1.5vh, 0.8rem) 0;
            padding: clamp(0.8rem, 2.5vw, 1rem) clamp(1.2rem, 3.5vw, 1.5rem);
          }
          
          .tips-container {
            height: clamp(25px, 4vh, 30px);
            margin: clamp(0.3rem, 0.8vh, 0.5rem) 0;
          }
          
          .creator-credit {
            margin: clamp(0.5rem, 1.2vh, 0.8rem) 0;
            padding: clamp(0.8rem, 2.5vw, 1rem) clamp(1.2rem, 3.5vw, 1.5rem);
          }
          
          .loading-animation {
            margin: clamp(0.5rem, 1.5vh, 1rem) 0;
          }
        }

        /* Extra small mobile screens - minimal content only */
        @media screen and (max-height: 500px) {
          .loading-content {
            gap: clamp(0.4rem, 1vh, 0.8rem);
            padding: clamp(0.5rem, 1.5vh, 1.2rem) clamp(0.5rem, 1.5vw, 1.2rem);
          }
          
          .features-preview {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: clamp(0.4rem, 1.8vw, 0.6rem);
            margin: clamp(0.3rem, 0.8vh, 0.5rem) 0;
            max-width: min(80vw, 300px);
            padding: clamp(0.1rem, 0.5vw, 0.2rem);
          }
          
          .feature-item {
            min-height: clamp(40px, 7vh, 50px);
            max-height: clamp(50px, 9vh, 60px);
            padding: clamp(0.4rem, 1.5vw, 0.6rem);
            box-sizing: border-box;
          }
          
          .feature-icon {
            font-size: clamp(0.9rem, 2.8vw, 1.1rem);
            margin-bottom: clamp(0.08rem, 0.3vh, 0.12rem);
          }
          
          .feature-item span {
            font-size: clamp(0.45rem, 1.6vw, 0.6rem);
            line-height: 1.1;
          }
          
          .tips-container {
            display: none;
          }
          
          .loading-status {
            margin: clamp(0.3rem, 1vh, 0.6rem) 0;
            padding: clamp(0.6rem, 2vw, 0.8rem) clamp(1rem, 3vw, 1.3rem);
          }
          
          .creator-credit {
            margin: clamp(0.3rem, 1vh, 0.6rem) 0;
            padding: clamp(0.6rem, 2vw, 0.8rem) clamp(1rem, 3vw, 1.3rem);
          }
          
          .loading-animation {
            margin: clamp(0.3rem, 1vh, 0.6rem) 0;
          }
        }

        /* Tiny screens - absolute minimum */
        @media screen and (max-height: 400px) {
          .loading-content {
            gap: clamp(0.3rem, 0.8vh, 0.6rem);
            padding: clamp(0.4rem, 1.2vh, 1rem) clamp(0.4rem, 1.2vw, 1rem);
          }
          
          .features-preview {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: clamp(0.25rem, 1vw, 0.4rem);
            margin: clamp(0.2rem, 0.6vh, 0.4rem) 0;
            max-width: min(75vw, 250px);
            padding: 0;
          }
          
          .feature-item {
            min-height: clamp(25px, 4vh, 35px);
            max-height: clamp(35px, 6vh, 45px);
            padding: clamp(0.25rem, 0.8vw, 0.4rem);
            box-sizing: border-box;
          }
          
          .feature-icon {
            font-size: clamp(0.6rem, 2vw, 0.8rem);
          }
          
          .feature-item span {
            font-size: clamp(0.35rem, 1.2vw, 0.45rem);
            line-height: 1;
          }
          
          .loading-status {
            margin: clamp(0.2rem, 0.8vh, 0.4rem) 0;
            padding: clamp(0.5rem, 1.5vw, 0.7rem) clamp(0.8rem, 2.5vw, 1.1rem);
          }
          
          .creator-credit {
            margin: clamp(0.2rem, 0.8vh, 0.4rem) 0;
            padding: clamp(0.5rem, 1.5vw, 0.7rem) clamp(0.8rem, 2.5vw, 1.1rem);
          }
          
          .loading-animation {
            margin: clamp(0.2rem, 0.8vh, 0.4rem) 0;
          }
            max-width: min(94vw, 220px);
          }
          
          .feature-item {
            min-height: clamp(16px, 2.5vh, 20px);
            padding: clamp(0.15rem, 0.6vw, 0.25rem);
          }
          
          .feature-icon {
            font-size: clamp(0.5rem, 1.5vw, 0.65rem);
            margin-bottom: 0;
          }
          
          .feature-item span {
            font-size: clamp(0.28rem, 0.9vw, 0.38rem);
            line-height: 0.8;
          }
          
          .creator-credit {
            display: none;
          }
          
          .loading-header h1 {
            font-size: clamp(1.2rem, 5vw, 1.5rem);
            margin: 0;
          }
          
          .loading-header .company-name {
            font-size: clamp(0.7rem, 2.5vw, 0.9rem);
            margin: 0;
          }
        }

        /* Narrow mobile screens - prevent overlapping */
        @media screen and (max-width: 400px) {
          .features-preview {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: clamp(0.4rem, 2vw, 0.7rem);
            max-width: min(85vw, 340px);
            padding: clamp(0.2rem, 1.2vw, 0.4rem);
          }
          
          .feature-item {
            min-height: clamp(45px, 11vw, 60px);
            max-height: clamp(60px, 14vw, 75px);
            padding: clamp(0.5rem, 2.2vw, 0.8rem);
            box-sizing: border-box;
            border-radius: clamp(6px, 1.5vw, 8px);
          }
          
          .feature-icon {
            font-size: clamp(1rem, 4vw, 1.3rem);
            margin-bottom: clamp(0.12rem, 0.6vw, 0.18rem);
          }
          
          .feature-item span {
            font-size: clamp(0.5rem, 2.2vw, 0.7rem);
            line-height: 1.2;
          }
        }

        /* Extra narrow mobile screens */
        @media screen and (max-width: 320px) {
          .features-preview {
            gap: clamp(0.3rem, 1.8vw, 0.5rem);
            max-width: min(90vw, 310px);
            padding: clamp(0.15rem, 1vw, 0.3rem);
          }
          
          .feature-item {
            min-height: clamp(40px, 12vw, 55px);
            max-height: clamp(55px, 16vw, 70px);
            padding: clamp(0.4rem, 2.5vw, 0.7rem);
          }
          
          .feature-icon {
            font-size: clamp(0.9rem, 4.2vw, 1.2rem);
          }
          
          .feature-item span {
            font-size: clamp(0.45rem, 2.4vw, 0.65rem);
          }
          
          .loading-title {
            font-size: clamp(1.5rem, 6vw, 2.2rem);
          }
          
          .loading-subtitle {
            font-size: clamp(0.7rem, 2.8vw, 0.9rem);
          }
        }

        /* Large Portrait Screens (Big phones, small tablets in portrait) */
        @media screen and (min-width: 414px) and (max-width: 768px) and (orientation: portrait) {
          .loading-content {
            max-width: min(85vw, 500px);
            padding: clamp(1.2rem, 3vh, 2.5rem) clamp(1.2rem, 3vw, 2.5rem);
            gap: clamp(1.2rem, 2.5vh, 2rem);
          }

          .features-preview {
            gap: clamp(0.8rem, 2.5vw, 1.2rem);
            max-width: min(80vw, 420px);
            padding: clamp(0.4rem, 1.2vw, 0.8rem);
          }
          
          .feature-item {
            min-height: clamp(60px, 9vh, 80px);
            max-height: clamp(80px, 12vh, 100px);
            padding: clamp(0.8rem, 2.2vw, 1.2rem);
          }
          
          .feature-icon {
            font-size: clamp(1.3rem, 3.2vw, 1.7rem);
            margin-bottom: clamp(0.2rem, 0.6vh, 0.3rem);
          }
          
          .feature-item span {
            font-size: clamp(0.7rem, 2vw, 0.9rem);
            line-height: 1.3;
          }
          
          .loading-title {
            font-size: clamp(2.2rem, 4.8vw, 3rem);
            margin: clamp(0.8rem, 2vh, 1.5rem) 0 clamp(0.8rem, 2vh, 1.5rem) 0;
          }
          
          .loading-subtitle {
            font-size: clamp(0.9rem, 2.2vw, 1.1rem);
            margin-bottom: clamp(1.2rem, 2.8vh, 2rem);
          }

          .logo-container {
            margin-bottom: clamp(1.5rem, 3.5vh, 2.5rem);
            padding-bottom: clamp(0.8rem, 2vh, 1.5rem);
          }

          .logo-icon {
            width: clamp(48px, 8vw, 64px);
            height: clamp(48px, 8vw, 64px);
          }
        }
          
          .progress-container {
            margin: clamp(0.3rem, 1vh, 0.5rem) 0;
          }
        }

        /* Final Override: Ensure Grid Always Shows on Tablets */
        @media (min-width: 641px) and (max-width: 1024px) {
          .features-preview {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
          }
          
          body {
            overflow: hidden !important;
            position: fixed !important;
            width: 100% !important;
            height: 100% !important;
          }
          
          .loading-wrapper {
            overflow: hidden !important;
            max-height: 100vh !important;
            max-height: 100dvh !important;
          }
          
          .loading-content {
            max-height: calc(100vh - 2rem) !important;
            max-height: calc(100dvh - 2rem) !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
          }
        }

        /* Landscape Tablets - 4 columns */
        @media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
          .features-preview {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
