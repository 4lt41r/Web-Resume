import React, { useState, useEffect, useRef } from 'react';
import { FileEdit, Download, Settings, Users, RotateCcw, Home } from 'lucide-react';
import JSZip from 'jszip';
import ResumeForm from './components/ResumeForm';
import ResumeTemplate from './components/ResumeTemplate';
import LoadingScreen from './components/LoadingScreen';
import AdminPanel from './components/AdminPanel';
import './App.css';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState('professional');
  const [showAdmin, setShowAdmin] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isGeneratingHTML, setIsGeneratingHTML] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const previewRef = useRef(null);
  const sidebarRef = useRef(null);
  const previewPanelRef = useRef(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  // Resume data - starts empty, gets filled when user clicks "Test Data"
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      linkedin: '',
      address: '',
      github: '',
      website: ''
    },
    summary: '',
    education: [],
    experience: [],
    skills: [],
    certifications: [],
    achievements: []
  });

  // Theme options
  const themes = [
    { value: 'professional', label: 'Professional' },
    { value: 'dark', label: 'Dark Mode' },
    { value: 'amazon', label: 'Amazon Style' },
    { value: 'netflix', label: 'Netflix Style' },
    { value: 'google', label: 'Google Style' }
  ];

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Welcome to Resume Builder Pro!",
      content: "Let's take a quick tour of the app's features. This tutorial will help you get started.",
      target: null
    },
    {
      title: "Sidebar Menu",
      content: "On mobile devices, swipe left-to-right or tap the menu button to access themes, test data, and controls.",
      target: "sidebar"
    },
    {
      title: "Live Preview",
      content: "On mobile devices, swipe right-to-left to view your resume preview. It automatically adjusts to your screen size.",
      target: "preview"
    },
    {
      title: "Fill Your Resume",
      content: "Start by clicking 'Test Data' to see an example, or fill in your own information in the form below.",
      target: "form"
    },
    {
      title: "Download HTML",
      content: "Once you're happy with your resume, use the HTML download buttons to save it as a complete web page that you can host online.",
      target: "download"
    }
  ];

  // Check if user has seen tutorial
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('resumeBuilderTutorialSeen');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  // Mobile detection and resize handler
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Close sidebar and preview on desktop
      if (!mobile) {
        setShowSidebar(false);
        setShowPreview(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Touch event handlers for swipe gestures
  const handleTouchStart = (e) => {
    if (!isMobile) return;
    
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (!isMobile) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;
    
    // Check if it's a horizontal swipe (more horizontal than vertical)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0 && touchStartX.current < 50) {
        // Swipe right from left edge - show sidebar
        setShowSidebar(true);
        setShowPreview(false);
      } else if (deltaX < 0 && touchStartX.current > window.innerWidth - 50) {
        // Swipe left from right edge - show preview
        setShowPreview(true);
        setShowSidebar(false);
      }
    }
  };

  // Tutorial functions
  const nextTutorialStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      closeTutorial();
    }
  };

  const prevTutorialStep = () => {
    if (tutorialStep > 0) {
      setTutorialStep(tutorialStep - 1);
    }
  };

  const closeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('resumeBuilderTutorialSeen', 'true');
  };

  const skipTutorial = () => {
    closeTutorial();
  };

  // Initialize loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Theme change handler
  const handleThemeChange = (event) => {
    const newTheme = event.target.value;
    setCurrentTheme(newTheme);
    
    // Update CSS custom properties based on theme
    const root = document.documentElement;
    
    switch (newTheme) {
      case 'dark':
        root.className = 'dark-theme';
        break;
      case 'amazon':
        root.className = 'amazon-theme';
        break;
      case 'netflix':
        root.className = 'netflix-theme';
        break;
      case 'google':
        root.className = 'google-theme';
        break;
      default:
        root.className = 'professional-theme';
        break;
    }
    
    showNotification('Theme updated successfully!', 'success');
  };

  // Notification handler
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ZIP package generation handler
  const generateZipPackage = async () => {
    if (!previewRef.current) {
      showNotification('Resume preview not available', 'error');
      return;
    }

    setIsGeneratingHTML(true);
    showNotification('Generating website package...', 'info');

    try {
      // Get all CSS styles from the current document
      const cssStyles = Array.from(document.styleSheets)
        .map(styleSheet => {
          try {
            return Array.from(styleSheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n');
          } catch {
            // Handle cross-origin stylesheets
            return '';
          }
        })
        .join('\n');

      // Create main CSS content with all styles including theme variables
      const mainCss = `/* Resume Builder - Main Styles */
/* Generated from Resume Builder Pro */

/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  line-height: 1.5;
  color: var(--text-color, #333);
  background: var(--body-bg, #f8fafc);
  padding: clamp(0.5rem, 2vw, 1rem);
  font-size: clamp(0.875rem, 1.5vw, 1rem);
}

.resume-container {
  max-width: min(210mm, 100vw);
  margin: 0 auto;
  background: var(--bg-color, white);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: clamp(4px, 1vw, 8px);
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out;
  border: 1px solid var(--border-color, #e2e8f0);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.resume-section {
  padding: clamp(0.75rem, 3vw, 1.25rem);
  margin-bottom: 2px;
  border-left: 3px solid var(--accent-color, #667eea);
  transition: all 0.2s ease;
  position: relative;
  background: var(--section-bg, white);
  border-bottom: 1px solid var(--border-color, #f1f5f9);
}

.resume-section:hover {
  background: var(--section-hover-bg, #fafbfc);
  transform: translateX(2px);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.resume-section:last-child {
  border-bottom: none;
}

/* Theme-specific variables */
.professional-theme {
  --accent-color: #2563eb;
  --secondary-color: #3b82f6;
  --text-color: #1e293b;
  --bg-color: #ffffff;
  --body-bg: #f8fafc;
  --section-bg: #ffffff;
  --section-hover-bg: #f8fafc;
  --border-color: #e2e8f0;
  --muted-text: #64748b;
  --header-text: #ffffff;
}

.amazon-theme {
  --accent-color: #ff9900;
  --secondary-color: #ff6b35;
  --text-color: #232f3e;
  --bg-color: #ffffff;
  --body-bg: #fef7f0;
  --section-bg: #ffffff;
  --section-hover-bg: #fef7f0;
  --border-color: #fed7aa;
  --muted-text: #78716c;
  --header-text: #ffffff;
}

.netflix-theme {
  --accent-color: #e50914;
  --secondary-color: #f40612;
  --text-color: #ffffff;
  --bg-color: #141414;
  --body-bg: #000000;
  --section-bg: #1a1a1a;
  --section-hover-bg: #262626;
  --border-color: #404040;
  --muted-text: #a3a3a3;
  --header-text: #ffffff;
}

.google-theme {
  --accent-color: #4285f4;
  --secondary-color: #34a853;
  --text-color: #202124;
  --bg-color: #ffffff;
  --body-bg: #f8f9fa;
  --section-bg: #ffffff;
  --section-hover-bg: #f8f9fa;
  --border-color: #dadce0;
  --muted-text: #5f6368;
  --header-text: #ffffff;
}

.dark-theme {
  --accent-color: #667eea;
  --secondary-color: #764ba2;
  --text-color: #e2e8f0;
  --bg-color: #1a202c;
  --body-bg: #2d3748;
  --section-bg: #2d3748;
  --section-hover-bg: #4a5568;
  --border-color: #4a5568;
  --muted-text: #a0aec0;
  --header-text: #ffffff;
}

/* Resume Template Styles */
.resume-template {
  width: 100%;
  max-width: none;
  margin: 0;
  color: var(--text-color);
}

.resume-header {
  background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
  color: var(--header-text);
  padding: clamp(1rem, 4vw, 2rem);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.resume-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.05)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.resume-header > * {
  position: relative;
  z-index: 1;
}

.resume-header h1 {
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  font-weight: 700;
  margin-bottom: clamp(0.25rem, 1vw, 0.5rem);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.resume-header .profession {
  font-size: clamp(0.9rem, 3vw, 1.25rem);
  opacity: 0.95;
  margin-bottom: clamp(0.5rem, 2vw, 1rem);
  font-weight: 500;
}

.contact-info {
  display: flex;
  justify-content: center;
  gap: clamp(0.75rem, 3vw, 1.5rem);
  flex-wrap: wrap;
  font-size: clamp(0.75rem, 2vw, 0.9rem);
  margin-top: clamp(0.5rem, 2vw, 1rem);
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;
}

.contact-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

/* Section Titles */
.section-title {
  color: var(--accent-color);
  font-size: clamp(1.1rem, 3vw, 1.4rem);
  font-weight: 600;
  margin-bottom: clamp(0.5rem, 2vw, 1rem);
  padding-bottom: 0.375rem;
  border-bottom: 2px solid var(--accent-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-icon {
  font-size: 1.1em;
}

/* Summary Section */
.summary-text {
  line-height: 1.6;
  font-size: clamp(0.85rem, 2vw, 1rem);
  color: var(--text-color);
  text-align: justify;
}

/* Experience Section */
.experience-item {
  margin-bottom: clamp(0.75rem, 2vw, 1.25rem);
  padding: clamp(0.75rem, 2vw, 1rem);
  background: var(--section-bg);
  border-radius: 6px;
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.experience-item:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.experience-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  gap: 1rem;
}

.experience-title {
  font-size: clamp(0.95rem, 2.5vw, 1.1rem);
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.25rem;
  line-height: 1.3;
}

.experience-company {
  font-weight: 500;
  color: var(--accent-color);
  margin-bottom: 0.25rem;
  font-size: clamp(0.85rem, 2vw, 1rem);
}

.experience-location {
  font-size: clamp(0.8rem, 1.8vw, 0.9rem);
  color: var(--muted-text);
}

.experience-date {
  font-size: clamp(0.8rem, 1.8vw, 0.9rem);
  color: var(--muted-text);
  font-weight: 500;
  text-align: right;
  white-space: nowrap;
}

.experience-description {
  margin-top: 0.5rem;
  line-height: 1.6;
  font-size: clamp(0.8rem, 1.8vw, 0.9rem);
  color: var(--text-color);
}

.experience-description ul {
  margin-left: 1rem;
  margin-top: 0.5rem;
}

.experience-description li {
  margin-bottom: 0.375rem;
  position: relative;
}

.experience-description li::marker {
  color: var(--accent-color);
}

/* Education Section */
.education-item {
  margin-bottom: clamp(0.5rem, 1.5vw, 1rem);
  padding: clamp(0.75rem, 2vw, 1rem);
  background: var(--section-bg);
  border-radius: 6px;
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.education-item:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.education-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.education-degree {
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.25rem;
  font-size: clamp(0.9rem, 2vw, 1rem);
  line-height: 1.3;
}

.education-school {
  color: var(--accent-color);
  font-weight: 500;
  margin-bottom: 0.25rem;
  font-size: clamp(0.85rem, 1.8vw, 0.95rem);
}

.education-date {
  font-size: clamp(0.8rem, 1.6vw, 0.85rem);
  color: var(--muted-text);
  white-space: nowrap;
}

.education-details {
  margin-top: 0.5rem;
  font-size: clamp(0.8rem, 1.6vw, 0.85rem);
  line-height: 1.5;
  color: var(--muted-text);
}

/* Skills Section */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(200px, 100%), 1fr));
  gap: clamp(0.75rem, 2vw, 1rem);
}

.skill-category {
  background: var(--section-bg);
  padding: clamp(0.75rem, 2vw, 1rem);
  border-radius: 6px;
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.skill-category:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.skill-category-title {
  font-weight: 600;
  color: var(--accent-color);
  margin-bottom: 0.75rem;
  font-size: clamp(0.85rem, 2vw, 1rem);
}

.skill-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-item {
  background: var(--accent-color);
  color: var(--header-text);
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: clamp(0.7rem, 1.6vw, 0.8rem);
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.skill-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  filter: brightness(1.1);
}

/* Certifications Section */
.certification-item {
  margin-bottom: clamp(0.75rem, 2vw, 1rem);
  padding: clamp(0.75rem, 2vw, 1rem);
  background: var(--section-bg);
  border-radius: 6px;
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.certification-item:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.certification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.certification-name {
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.25rem;
  font-size: clamp(0.9rem, 2vw, 1rem);
  line-height: 1.3;
}

.certification-issuer {
  color: var(--accent-color);
  font-weight: 500;
  margin-bottom: 0.25rem;
  font-size: clamp(0.8rem, 1.8vw, 0.9rem);
}

.certification-date {
  font-size: clamp(0.75rem, 1.6vw, 0.8rem);
  color: var(--muted-text);
  white-space: nowrap;
}

.certification-description {
  margin-top: 0.5rem;
  font-size: clamp(0.8rem, 1.6vw, 0.85rem);
  line-height: 1.5;
  color: var(--muted-text);
}

/* Achievements Section */
.achievement-item {
  margin-bottom: clamp(0.75rem, 2vw, 1rem);
  padding: clamp(0.75rem, 2vw, 1rem);
  background: var(--section-bg);
  border-radius: 6px;
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.achievement-item:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.achievement-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.achievement-title {
  font-weight: 600;
  color: var(--text-color);
  font-size: clamp(0.9rem, 2vw, 1rem);
  line-height: 1.3;
}

.achievement-date {
  font-size: clamp(0.75rem, 1.6vw, 0.8rem);
  color: var(--muted-text);
  white-space: nowrap;
}

.achievement-description {
  line-height: 1.6;
  font-size: clamp(0.8rem, 1.8vw, 0.9rem);
  color: var(--text-color);
}

/* Print styles */
@media print {
  body {
    background: white !important;
    padding: 0;
    font-size: 12px;
  }
  
  .resume-container {
    box-shadow: none;
    border-radius: 0;
    border: none;
    max-width: none;
  }
  
  .resume-section {
    break-inside: avoid;
    page-break-inside: avoid;
    padding: 12px;
  }
  
  .resume-header {
    padding: 20px;
  }
  
  .experience-item,
  .education-item,
  .certification-item,
  .achievement-item,
  .skill-category {
    break-inside: avoid;
    page-break-inside: avoid;
  }
}

/* Additional extracted styles from application */
${cssStyles}`;

      // Create mobile CSS content
      const mobileCss = `/* Resume Builder - Mobile & Responsive Styles */

/* Small tablets and large phones */
@media (max-width: 768px) {
  body {
    padding: clamp(0.25rem, 1vw, 0.5rem);
    font-size: clamp(0.8rem, 2vw, 0.9rem);
  }
  
  .resume-container {
    border-radius: 4px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
  }
  
  .resume-section {
    padding: clamp(0.5rem, 3vw, 1rem);
    border-left-width: 2px;
  }
  
  .resume-header {
    padding: clamp(1rem, 4vw, 1.5rem);
  }
  
  .resume-header h1 {
    font-size: clamp(1.25rem, 6vw, 2rem);
    margin-bottom: 0.375rem;
  }
  
  .resume-header .profession {
    font-size: clamp(0.85rem, 3.5vw, 1.1rem);
    margin-bottom: 0.75rem;
  }
  
  .contact-info {
    gap: clamp(0.5rem, 2vw, 1rem);
    font-size: clamp(0.7rem, 2vw, 0.8rem);
    flex-direction: column;
    align-items: center;
  }
  
  .contact-item {
    padding: 0.25rem 0.75rem;
    min-width: auto;
  }
  
  .section-title {
    font-size: clamp(1rem, 4vw, 1.25rem);
    margin-bottom: 0.75rem;
    flex-direction: column;
    text-align: center;
    gap: 0.25rem;
  }
  
  .experience-header,
  .education-header,
  .certification-header,
  .achievement-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.375rem;
  }
  
  .experience-date,
  .education-date,
  .certification-date,
  .achievement-date {
    text-align: left;
    font-size: clamp(0.7rem, 1.8vw, 0.8rem);
  }
  
  .skills-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .skill-items {
    gap: 0.375rem;
  }
  
  .skill-item {
    font-size: clamp(0.65rem, 1.8vw, 0.75rem);
    padding: 0.25rem 0.5rem;
  }
  
  .experience-description,
  .achievement-description,
  .certification-description,
  .summary-text {
    font-size: clamp(0.75rem, 2vw, 0.85rem);
    text-align: left;
  }
  
  .experience-description ul {
    margin-left: 0.75rem;
  }
}

/* Mobile phones */
@media (max-width: 480px) {
  body {
    padding: 0.25rem;
    font-size: 0.8rem;
  }
  
  .resume-container {
    border-radius: 2px;
    margin: 0;
    width: 100%;
  }
  
  .resume-section {
    padding: 0.75rem 0.5rem;
    margin-bottom: 1px;
  }
  
  .resume-header {
    padding: 1rem 0.75rem;
  }
  
  .resume-header h1 {
    font-size: clamp(1.1rem, 8vw, 1.75rem);
    line-height: 1.2;
  }
  
  .resume-header .profession {
    font-size: clamp(0.8rem, 5vw, 1rem);
    margin-bottom: 0.5rem;
  }
  
  .contact-info {
    gap: 0.5rem;
    font-size: 0.7rem;
  }
  
  .contact-item {
    padding: 0.2rem 0.5rem;
    font-size: 0.65rem;
  }
  
  .section-title {
    font-size: clamp(0.9rem, 5vw, 1.1rem);
    margin-bottom: 0.5rem;
    padding-bottom: 0.25rem;
  }
  
  .section-icon {
    font-size: 0.9em;
  }
  
  .experience-item,
  .education-item,
  .certification-item,
  .achievement-item,
  .skill-category {
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    border-radius: 4px;
  }
  
  .experience-title,
  .education-degree,
  .certification-name,
  .achievement-title {
    font-size: clamp(0.8rem, 3vw, 0.95rem);
    line-height: 1.3;
  }
  
  .experience-company,
  .education-school,
  .certification-issuer {
    font-size: clamp(0.75rem, 2.5vw, 0.85rem);
  }
  
  .experience-description,
  .achievement-description,
  .certification-description,
  .summary-text {
    font-size: 0.75rem;
    line-height: 1.5;
  }
  
  .education-details {
    font-size: 0.7rem;
  }
  
  .skill-category-title {
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
  }
  
  .skill-item {
    font-size: 0.65rem;
    padding: 0.2rem 0.4rem;
  }
  
  .experience-description ul {
    margin-left: 0.5rem;
  }
  
  .experience-description li {
    margin-bottom: 0.25rem;
    font-size: 0.7rem;
  }
}

/* Very small screens */
@media (max-width: 320px) {
  .resume-header h1 {
    font-size: 1.2rem;
  }
  
  .resume-header .profession {
    font-size: 0.85rem;
  }
  
  .contact-info {
    font-size: 0.65rem;
  }
  
  .section-title {
    font-size: 0.95rem;
  }
  
  .experience-title,
  .education-degree,
  .certification-name,
  .achievement-title {
    font-size: 0.85rem;
  }
  
  .experience-company,
  .education-school,
  .certification-issuer {
    font-size: 0.8rem;
  }
  
  .experience-description,
  .achievement-description,
  .certification-description,
  .summary-text {
    font-size: 0.7rem;
  }
  
  .skill-item {
    font-size: 0.6rem;
    padding: 0.15rem 0.35rem;
  }
}

/* Large screens optimization */
@media (min-width: 1200px) {
  body {
    padding: 2rem;
  }
  
  .resume-container {
    max-width: 210mm;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  }
  
  .resume-section {
    padding: 1.5rem;
  }
  
  .resume-header {
    padding: 2.5rem;
  }
  
  .skills-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
}

/* Ultra-wide screens */
@media (min-width: 1600px) {
  .resume-container {
    max-width: 240mm;
  }
  
  .skills-grid {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .resume-section {
    border: 2px solid var(--accent-color);
  }
  
  .skill-item {
    border: 1px solid var(--header-text);
  }
  
  .experience-item,
  .education-item,
  .certification-item,
  .achievement-item,
  .skill-category {
    border: 1px solid var(--text-color);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}`;

      // Get the resume content
      const element = previewRef.current;
      const resumeContent = element.outerHTML;

      // Create the main HTML file
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${resumeData.personalInfo.fullName || 'Resume'} - Professional Resume</title>
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="styles/mobile.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="${currentTheme}-theme">
    <div class="resume-container">
        ${resumeContent.replace(
          /<div class="resume-template[^"]*">/g, 
          '<div class="resume-template">'
        ).replace(
          /class="([^"]*)"/g, 
          (match, classes) => {
            if (classes.includes('resume-header') || 
                classes.includes('resume-summary') || 
                classes.includes('education-section') || 
                classes.includes('experience-section') || 
                classes.includes('skills-section') || 
                classes.includes('certifications-section') || 
                classes.includes('achievements-section')) {
              return `class="${classes} resume-section"`;
            }
            return match;
          }
        )}
    </div>
    <script src="scripts/main.js"></script>
</body>
</html>`;

      // Create the JavaScript file
      const jsContent = `// Resume Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add print functionality
    const printBtn = document.createElement('button');
    printBtn.innerHTML = '🖨️ Print Resume';
    printBtn.style.cssText = \`
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent-color, #667eea);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        transition: all 0.3s ease;
    \`;
    
    printBtn.addEventListener('click', () => window.print());
    printBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
    });
    printBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    });
    
    document.body.appendChild(printBtn);
    
    // Add stagger animation to sections
    const sections = document.querySelectorAll('.resume-section');
    sections.forEach((section, index) => {
        section.style.animationDelay = (index * 0.1) + 's';
        section.classList.add('animate-in');
    });
    
    // Add hover effects to skill items
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Add fade-in animation
    const resumeContainer = document.querySelector('.resume-container');
    if (resumeContainer) {
        resumeContainer.style.opacity = '0';
        resumeContainer.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            resumeContainer.style.transition = 'all 0.8s ease-out';
            resumeContainer.style.opacity = '1';
            resumeContainer.style.transform = 'translateY(0)';
        }, 100);
    }
});`;

      // Create the README file
      const readmeContent = `# ${resumeData.personalInfo.fullName || 'Professional'} Resume Website

This is a static website version of ${resumeData.personalInfo.fullName || 'a professional'}'s resume.

## Files Included:
- \`index.html\` - Main resume page
- \`styles/main.css\` - Main stylesheet
- \`styles/mobile.css\` - Mobile responsive styles
- \`scripts/main.js\` - Interactive features
- \`README.md\` - This file

## How to Use:

### Local Viewing:
Simply open \`index.html\` in your web browser.

### Web Hosting:
Upload all files to your web hosting service:

1. **GitHub Pages**: 
   - Create a new repository
   - Upload all files
   - Enable GitHub Pages in repository settings

2. **Netlify**:
   - Drag and drop the folder to netlify.com
   - Your site will be live instantly

3. **Vercel**:
   - Connect your GitHub repository
   - Deploy automatically

4. **Firebase Hosting**:
   - Use Firebase CLI to deploy

## Features:
- ✅ Responsive design for all devices
- ✅ Print-friendly layout
- ✅ Professional styling with theme: ${currentTheme}
- ✅ Interactive elements and animations
- ✅ Fast loading
- ✅ SEO optimized

Generated on: ${new Date().toLocaleDateString()}
Package created by: Resume Builder Pro
`;

      // Create ZIP file
      const zip = new JSZip();
      
      // Add files to ZIP
      zip.file('index.html', htmlContent);
      zip.file('README.md', readmeContent);
      
      // Create folders and add files
      const stylesFolder = zip.folder('styles');
      stylesFolder.file('main.css', mainCss);
      stylesFolder.file('mobile.css', mobileCss);
      
      const scriptsFolder = zip.folder('scripts');
      scriptsFolder.file('main.js', jsContent);
      
      // Generate ZIP blob
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      // Create download link
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${(resumeData.personalInfo.fullName || 'Resume').replace(/\s+/g, '_')}_Website_Package.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showNotification('Website package downloaded successfully! 🎉', 'success');
    } catch (error) {
      console.error('ZIP generation failed:', error);
      showNotification('Failed to generate website package. Please try again.', 'error');
    } finally {
      setIsGeneratingHTML(false);
    }
  };

  // Reset form data
  const resetForm = () => {
    if (window.confirm('Are you sure you want to reset all form data? This action cannot be undone.')) {
      setResumeData({
        personalInfo: {
          fullName: '',
          email: '',
          phone: '',
          linkedin: '',
          address: '',
          github: '',
          website: ''
        },
        summary: '',
        education: [],
        experience: [],
        skills: [],
        certifications: [],
        achievements: []
      });
      showNotification('Form data reset successfully!', 'success');
    }
  };

  // Load test data
  const loadTestData = () => {
    if (window.confirm('Load sample data? This will replace current form data.')) {
      setResumeData({
        personalInfo: {
          fullName: 'Alex Johnson',
          email: 'alex.johnson@email.com',
          phone: '+1 (555) 123-4567',
          linkedin: 'linkedin.com/in/alexjohnson',
          address: 'San Francisco, CA',
          github: 'github.com/alexjohnson',
          website: 'alexjohnson.dev'
        },
        summary: 'Experienced Full Stack Developer with 5+ years of expertise in React, Node.js, and cloud technologies. Passionate about creating scalable web applications and leading development teams. Proven track record of delivering high-quality software solutions that drive business growth and improve user experience.',
        education: [
          {
            id: 1,
            degree: 'Master of Science in Computer Science',
            institution: 'Stanford University',
            startDate: '2016',
            endDate: '2018',
            gpa: '3.8/4.0',
            coursework: 'Data Structures, Algorithms, Machine Learning, Database Systems'
          },
          {
            id: 2,
            degree: 'Bachelor of Science in Software Engineering',
            institution: 'University of California, Berkeley',
            startDate: '2012',
            endDate: '2016',
            gpa: '3.7/4.0',
            coursework: 'Software Development, Web Technologies, Computer Networks'
          }
        ],
        experience: [
          {
            id: 1,
            position: 'Senior Full Stack Developer',
            company: 'TechCorp Solutions',
            startDate: '2020',
            endDate: 'Present',
            location: 'San Francisco, CA',
            responsibilities: [
              'Led development team of 6 engineers in building scalable web applications',
              'Architected and implemented microservices using Node.js and Docker',
              'Reduced application load time by 40% through performance optimization',
              'Mentored junior developers and conducted code reviews',
              'Collaborated with product managers to define technical requirements'
            ]
          },
          {
            id: 2,
            position: 'Frontend Developer',
            company: 'Digital Innovations Inc',
            startDate: '2018',
            endDate: '2020',
            location: 'San Jose, CA',
            responsibilities: [
              'Developed responsive web applications using React and TypeScript',
              'Implemented modern UI/UX designs with 98% accuracy to mockups',
              'Integrated REST APIs and GraphQL endpoints',
              'Optimized web applications for mobile devices and cross-browser compatibility',
              'Participated in agile development processes and sprint planning'
            ]
          },
          {
            id: 3,
            position: 'Junior Software Developer',
            company: 'StartupHub',
            startDate: '2017',
            endDate: '2018',
            location: 'Palo Alto, CA',
            responsibilities: [
              'Built interactive user interfaces using JavaScript and jQuery',
              'Developed RESTful APIs using Python Flask framework',
              'Maintained and debugged existing codebase',
              'Collaborated with design team to implement user-friendly interfaces',
              'Participated in daily standups and sprint retrospectives'
            ]
          }
        ],
        skills: [
          { id: 1, name: 'JavaScript', category: 'Programming Languages' },
          { id: 2, name: 'TypeScript', category: 'Programming Languages' },
          { id: 3, name: 'Python', category: 'Programming Languages' },
          { id: 4, name: 'Java', category: 'Programming Languages' },
          { id: 5, name: 'React', category: 'Frontend Frameworks' },
          { id: 6, name: 'Vue.js', category: 'Frontend Frameworks' },
          { id: 7, name: 'Angular', category: 'Frontend Frameworks' },
          { id: 8, name: 'Node.js', category: 'Backend Technologies' },
          { id: 9, name: 'Express.js', category: 'Backend Technologies' },
          { id: 10, name: 'MongoDB', category: 'Databases' },
          { id: 11, name: 'PostgreSQL', category: 'Databases' },
          { id: 12, name: 'AWS', category: 'Cloud Platforms' },
          { id: 13, name: 'Docker', category: 'DevOps' },
          { id: 14, name: 'Kubernetes', category: 'DevOps' },
          { id: 15, name: 'Git', category: 'Version Control' }
        ],
        certifications: [
          {
            id: 1,
            name: 'AWS Certified Solutions Architect',
            issuer: 'Amazon Web Services',
            date: '2023',
            credentialId: 'AWS-SAA-2023-001',
            description: 'Professional-level certification demonstrating expertise in designing distributed systems on AWS'
          },
          {
            id: 2,
            name: 'Certified Kubernetes Administrator (CKA)',
            issuer: 'Cloud Native Computing Foundation',
            date: '2022',
            credentialId: 'CKA-2022-456',
            description: 'Demonstrates skills in Kubernetes cluster administration and troubleshooting'
          },
          {
            id: 3,
            name: 'Google Cloud Professional Developer',
            issuer: 'Google Cloud',
            date: '2021',
            credentialId: 'GCP-PD-2021-789',
            description: 'Validates ability to build scalable and reliable applications on Google Cloud Platform'
          }
        ],
        achievements: [
          {
            id: 1,
            title: 'Innovation Award Winner',
            description: 'Received company-wide innovation award for developing an automated testing framework that reduced testing time by 60%',
            date: '2023'
          },
          {
            id: 2,
            title: 'Open Source Contributor',
            description: 'Active contributor to popular React libraries with over 500+ GitHub stars and 2000+ downloads',
            date: '2022'
          },
          {
            id: 3,
            title: 'Tech Conference Speaker',
            description: 'Presented at ReactConf 2022 on "Building Scalable React Applications with Modern Architecture"',
            date: '2022'
          },
          {
            id: 4,
            title: 'Hackathon Winner',
            description: 'First place winner at TechCrunch Disrupt Hackathon for developing AI-powered code review tool',
            date: '2021'
          }
        ]
      });
      showNotification('Test data loaded successfully!', 'success');
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div 
      className="app"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="tutorial-overlay">
          <div className="tutorial-modal">
            <div className="tutorial-header">
              <h3>{tutorialSteps[tutorialStep].title}</h3>
              <button className="tutorial-close" onClick={closeTutorial}>×</button>
            </div>
            <div className="tutorial-content">
              <p>{tutorialSteps[tutorialStep].content}</p>
            </div>
            <div className="tutorial-footer">
              <div className="tutorial-progress">
                <span>{tutorialStep + 1} / {tutorialSteps.length}</span>
                <div className="progress-dots">
                  {tutorialSteps.map((_, index) => (
                    <span 
                      key={index} 
                      className={`dot ${index === tutorialStep ? 'active' : ''}`}
                    />
                  ))}
                </div>
              </div>
              <div className="tutorial-buttons">
                <button 
                  className="btn-tutorial btn-skip" 
                  onClick={skipTutorial}
                >
                  Skip Tour
                </button>
                {tutorialStep > 0 && (
                  <button 
                    className="btn-tutorial btn-prev" 
                    onClick={prevTutorialStep}
                  >
                    Previous
                  </button>
                )}
                <button 
                  className="btn-tutorial btn-next" 
                  onClick={nextTutorialStep}
                >
                  {tutorialStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Overlay */}
      {isMobile && showSidebar && (
        <div className="sidebar-overlay" onClick={() => setShowSidebar(false)}>
          <div 
            ref={sidebarRef}
            className="sidebar-panel"
            onClick={e => e.stopPropagation()}
          >
            <div className="sidebar-header">
              <div className="sidebar-title">
                <FileEdit size={24} />
                <h3>Resume Builder Pro</h3>
              </div>
              <button 
                className="sidebar-close"
                onClick={() => setShowSidebar(false)}
              >
                ×
              </button>
            </div>
            
            <div className="sidebar-content">
              <div className="sidebar-section">
                <h4>Theme</h4>
                <select
                  value={currentTheme}
                  onChange={handleThemeChange}
                  className="sidebar-select"
                >
                  {themes.map(theme => (
                    <option key={theme.value} value={theme.value}>
                      {theme.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sidebar-section">
                <h4>Quick Actions</h4>
                <div className="sidebar-buttons">
                  <button 
                    className="sidebar-btn"
                    onClick={() => {
                      loadTestData();
                      setShowSidebar(false);
                    }}
                  >
                    <Users size={16} />
                    Load Test Data
                  </button>
                  
                  <button 
                    className="sidebar-btn"
                    onClick={() => {
                      resetForm();
                      setShowSidebar(false);
                    }}
                  >
                    <RotateCcw size={16} />
                    Reset Form
                  </button>
                  
                  <button 
                    className="sidebar-btn"
                    onClick={() => {
                      setShowAdmin(!showAdmin);
                      setShowSidebar(false);
                    }}
                  >
                    <Settings size={16} />
                    Admin Panel
                  </button>
                </div>
              </div>

              <div className="sidebar-section">
                <h4>Download Website Package</h4>
                <div className="sidebar-buttons">
                  <button 
                    className="sidebar-btn"
                    onClick={() => {
                      generateZipPackage();
                      setShowSidebar(false);
                    }}
                    disabled={isGeneratingHTML}
                  >
                    <Download size={16} />
                    {isGeneratingHTML ? 'Generating...' : 'Download ZIP Package'}
                  </button>
                </div>
              </div>

              <div className="sidebar-section">
                <h4>Help</h4>
                <button 
                  className="sidebar-btn"
                  onClick={() => {
                    setShowTutorial(true);
                    setTutorialStep(0);
                    setShowSidebar(false);
                  }}
                >
                  <FileEdit size={16} />
                  Show Tutorial
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Panel Overlay */}
      {isMobile && showPreview && (
        <div className="preview-overlay" onClick={() => setShowPreview(false)}>
          <div 
            ref={previewPanelRef}
            className="preview-panel"
            onClick={e => e.stopPropagation()}
          >
            <div className="preview-panel-header">
              <h3>Resume Preview</h3>
              <div className="preview-panel-controls">
                <span className="theme-indicator-mobile">
                  {themes.find(t => t.value === currentTheme)?.label}
                </span>
                <button 
                  className="preview-close"
                  onClick={() => setShowPreview(false)}
                >
                  ×
                </button>
              </div>
            </div>
            <div className="preview-panel-content">
              <ResumeTemplate 
                resumeData={resumeData}
                theme={currentTheme}
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Buttons */}
      {isMobile && (
        <div className="mobile-menu-buttons">
          <button 
            className="mobile-menu-btn sidebar-trigger"
            onClick={() => setShowSidebar(true)}
            title="Open Menu"
          >
            <Settings size={20} />
          </button>
          <button 
            className="mobile-menu-btn preview-trigger"
            onClick={() => setShowPreview(true)}
            title="Show Preview"
          >
            <FileEdit size={20} />
          </button>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Header - Hidden on mobile when panels are open */}
      <header className={`app-header ${isMobile && (showSidebar || showPreview) ? 'hidden' : ''}`}>
        <div className="container">
          <div className="header-content">
            <div className="title-row">
              <div className="title-content">
                <FileEdit className="lucide" size={32} />
                <h1>Resume Builder Pro</h1>
              </div>
            </div>
            
            {!isMobile && (
              <div className="controls-row">
                <div className="theme-selector">
                  <label htmlFor="theme-select">Theme:</label>
                  <select
                    id="theme-select"
                    value={currentTheme}
                    onChange={handleThemeChange}
                  >
                    {themes.map(theme => (
                      <option key={theme.value} value={theme.value}>
                        {theme.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="action-buttons">
                  <button 
                    className="btn"
                    onClick={loadTestData}
                    title="Load Test Data"
                  >
                    <Users size={16} />
                    <span>Test Data</span>
                  </button>

                  <button 
                    className="btn"
                    onClick={resetForm}
                    title="Reset Form"
                  >
                    <RotateCcw size={16} />
                    <span>Reset</span>
                  </button>

                  <button 
                    className="btn"
                    onClick={() => setShowAdmin(!showAdmin)}
                    title="Admin Panel"
                  >
                    <Settings size={16} />
                    <span className="admin-text">Admin</span>
                  </button>
                </div>

                <div className="download-options">
                  <button 
                    className="btn"
                    onClick={() => generateZipPackage()}
                    disabled={isGeneratingHTML}
                    title="Download Complete Website Package"
                  >
                    <Download size={16} />
                    <span>{isGeneratingHTML ? 'Generating Package...' : 'Download ZIP Package'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`app-main ${isMobile && (showSidebar || showPreview) ? 'hidden' : ''}`}>
        <div className="container">
          {showAdmin ? (
            <AdminPanel 
              onClose={() => setShowAdmin(false)}
              showNotification={showNotification}
              currentTheme={currentTheme}
            />
          ) : (
            <div className="resume-builder">
              {/* Form Section */}
              <section className="form-section">
                <ResumeForm 
                  resumeData={resumeData}
                  setResumeData={setResumeData}
                  showNotification={showNotification}
                />
              </section>

              {/* Preview Section - Hidden on mobile */}
              {!isMobile && (
                <section className="preview-section">
                  <div className="preview-header">
                    <h2>Live Preview</h2>
                    <div className="theme-indicator">
                      Current Theme: {themes.find(t => t.value === currentTheme)?.label}
                    </div>
                  </div>
                  <div className="preview-container">
                    <ResumeTemplate 
                      ref={previewRef}
                      resumeData={resumeData}
                      theme={currentTheme}
                    />
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className={`app-footer ${isMobile && (showSidebar || showPreview) ? 'hidden' : ''}`}>
        <div className="container">
          <p>© 2024 Resume Builder Pro. Created with React & modern web technologies.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
