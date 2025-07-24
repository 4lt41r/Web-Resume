import React, { useState, useEffect } from 'react';
import { FileEdit, Zap, Star, Sparkles } from 'lucide-react';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);

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
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % tips.length);
    }, 1500);

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
              <Zap className="sparkle sparkle-3" size={14} />
            </div>
          </div>
          <h1 className="loading-title">Resume Builder Pro</h1>
          <p className="loading-subtitle">Creating your professional resume...</p>
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
            <span>HTML Export</span>
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
          width: 100%;
          height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          overflow: hidden;
        }

        .loading-screen::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%);
          animation: float 6s ease-in-out infinite;
        }

        .loading-content {
          text-align: center;
          color: white;
          max-width: 500px;
          padding: 2rem;
          position: relative;
          z-index: 2;
        }

        .loading-header {
          margin-bottom: 3rem;
        }

        .logo-container {
          position: relative;
          display: inline-block;
          margin-bottom: 1.5rem;
        }

        .logo-icon {
          color: white;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
          animation: pulse 2s ease-in-out infinite;
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
          color: #ffd700;
          animation: sparkle 2s ease-in-out infinite;
        }

        .sparkle-1 {
          top: -8px;
          right: -8px;
          animation-delay: 0s;
        }

        .sparkle-2 {
          bottom: -4px;
          left: -4px;
          animation-delay: 0.7s;
        }

        .sparkle-3 {
          top: 50%;
          right: -12px;
          animation-delay: 1.4s;
        }

        .loading-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          background: linear-gradient(45deg, #ffffff, #f0f8ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: titleGlow 3s ease-in-out infinite;
        }

        .loading-subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
          margin: 0;
          font-weight: 300;
        }

        .progress-container {
          margin: 2rem 0;
          position: relative;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          overflow: hidden;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
          border-radius: 10px;
          transition: width 0.3s ease;
          position: relative;
          overflow: hidden;
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
            rgba(255, 255, 255, 0.6),
            transparent
          );
          animation: shine 2s infinite;
        }

        .progress-text {
          margin-top: 0.5rem;
          font-weight: 600;
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .tips-container {
          margin: 2rem 0;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tip-wrapper {
          position: relative;
          width: 100%;
        }

        .tip-item {
          font-size: 1rem;
          opacity: 0;
          transform: translateY(20px);
          animation: tipFadeIn 1.5s ease-in-out forwards;
          background: rgba(255, 255, 255, 0.1);
          padding: 1rem 1.5rem;
          border-radius: 25px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .features-preview {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin: 2rem 0;
        }

        .feature-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: transform 0.3s ease;
          animation: featureFloat 3s ease-in-out infinite;
        }

        .feature-item:nth-child(1) { animation-delay: 0s; }
        .feature-item:nth-child(2) { animation-delay: 0.5s; }
        .feature-item:nth-child(3) { animation-delay: 1s; }
        .feature-item:nth-child(4) { animation-delay: 1.5s; }

        .feature-icon {
          font-size: 1.5rem;
        }

        .feature-item span {
          font-size: 0.8rem;
          font-weight: 500;
        }

        .loading-animation {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 2rem;
        }

        .dot {
          width: 10px;
          height: 10px;
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

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        @media (max-width: 768px) {
          .loading-content {
            padding: 1rem;
            max-width: 90%;
          }

          .loading-title {
            font-size: 2rem;
          }

          .features-preview {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.8rem;
          }

          .feature-item {
            padding: 0.8rem;
          }

          .feature-icon {
            font-size: 1.2rem;
          }

          .feature-item span {
            font-size: 0.7rem;
          }

          .tip-item {
            font-size: 0.9rem;
            padding: 0.8rem 1.2rem;
          }
        }

        @media (max-width: 480px) {
          .loading-title {
            font-size: 1.8rem;
          }

          .features-preview {
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
          }

          .tip-item {
            font-size: 0.8rem;
            padding: 0.6rem 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
