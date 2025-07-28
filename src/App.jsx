import React, { useState, useEffect, useRef } from 'react';
import { FileEdit, FileText, Download, Settings, Users, RotateCcw, Home, Briefcase, Star, Sparkles } from 'lucide-react';
import JSZip from 'jszip';
import ResumeForm from './components/ResumeForm';
import ResumeTemplate from './components/ResumeTemplate';
import LoadingScreen from './components/LoadingScreen';
import DesktopLoadingScreen from './components/DesktopLoadingScreen';
import AdminPanel from './components/AdminPanel';
import SwipeHandler from './components/SwipeHandler';
import TabletGestureHints from './components/TabletGestureHints';
import './App.css';

const App = () => {
  // Unified device detection function
  const detectDeviceType = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const aspectRatio = width / height;
    
    // Enhanced tablet detection - includes landscape tablets and touch devices
    const mobile = width <= 768 && isTouchDevice;
    const tablet = (
      (width > 768 && width <= 1366 && isTouchDevice) || // Standard tablet range
      (width > 1024 && aspectRatio < 1.5 && isTouchDevice) || // Landscape tablets
      (navigator.userAgent.match(/iPad/i) != null) || // iPad detection
      (navigator.userAgent.match(/Android/i) != null && !navigator.userAgent.match(/Mobile/i)) // Android tablets
    );
    const desktop = !isTouchDevice || (width > 1366 && !tablet);
    
    // Fullscreen detection - multiple methods for cross-browser compatibility
    const isCurrentlyFullscreen = !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement ||
      // PWA/standalone mode detection
      window.navigator.standalone ||
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      // Android WebView detection
      (window.outerHeight === window.innerHeight && window.outerWidth === window.innerWidth) ||
      // Height-based detection for mobile apps
      (height >= screen.height * 0.95 && width >= screen.width * 0.95)
    );
    
    return { mobile, tablet, desktop, isCurrentlyFullscreen };
  };
  
  // Get initial device state using unified function
  const initialDevice = detectDeviceType();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isDesktop, setIsDesktop] = useState(initialDevice.desktop);
  const [isTablet, setIsTablet] = useState(initialDevice.tablet);
  const [_isFullscreen, setIsFullscreen] = useState(initialDevice.isCurrentlyFullscreen);
  const [currentTheme, setCurrentTheme] = useState('professional');
  const [showAdmin, setShowAdmin] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isGeneratingHTML, setIsGeneratingHTML] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isMobile, setIsMobile] = useState(initialDevice.mobile);
  const [hasMouseKeyboard, setHasMouseKeyboard] = useState(false);
  const [recentlyClosed, setRecentlyClosed] = useState(false);
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [isLandscape, setIsLandscape] = useState(() => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const aspectRatio = windowWidth / windowHeight;
    return windowWidth > windowHeight || aspectRatio > 1.2 || (windowWidth >= 768 && aspectRatio > 1.0);
  });
  const previewRef = useRef(null);
  const sidebarRef = useRef(null);
  const previewPanelRef = useRef(null);
  const formRef = useRef(null);
  const previewContainerRef = useRef(null);
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
    { value: 'classy', label: 'Default Classy' },
    { value: 'dark', label: 'Dark Mode' },
    { value: 'amazon', label: 'Amazon Style' },
    { value: 'netflix', label: 'Netflix Style' },
    { value: 'google', label: 'Google Style' }
  ];

  // Keyboard escape key handler for closing sidebars
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        if (showSidebar) {
          setShowSidebar(false);
        } else if (showPreview) {
          setShowPreview(false);
        } else if (showLeftSidebar) {
          setShowLeftSidebar(false);
        } else if (showRightSidebar) {
          setShowRightSidebar(false);
        }
      }
    };

    // Add event listener when sidebars are open
    if (showSidebar || showPreview || showLeftSidebar || showRightSidebar) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showSidebar, showPreview, showLeftSidebar, showRightSidebar]);

  // Input method detection - detect if user has mouse/keyboard or touch-only
  useEffect(() => {
    let hasUsedMouse = false;
    let hasUsedKeyboard = false;
    let hasUsedTouch = false;

    const handleMouseMove = () => {
      if (!hasUsedMouse) {
        hasUsedMouse = true;
        updateInputMethod();
      }
    };

    const handleKeyDown = (e) => {
      // Ignore tab, alt, ctrl, shift, cmd keys as they might be used by screen readers
      if (!['Tab', 'Alt', 'Control', 'Shift', 'Meta'].includes(e.key)) {
        if (!hasUsedKeyboard) {
          hasUsedKeyboard = true;
          updateInputMethod();
        }
      }
    };

    const handleTouchStart = () => {
      if (!hasUsedTouch) {
        hasUsedTouch = true;
        updateInputMethod();
      }
    };

    const updateInputMethod = () => {
      // Device has mouse/keyboard if user has used mouse or keyboard
      const hasMouseKeyboardInput = hasUsedMouse || hasUsedKeyboard;
      
      // Also check for non-touch devices (desktops without touch screens)
      const isNonTouchDevice = !('ontouchstart' in window) && navigator.maxTouchPoints === 0;
      
      // Set mouse/keyboard availability
      setHasMouseKeyboard(hasMouseKeyboardInput || isNonTouchDevice);
    };

    // Initial detection - assume non-touch devices have mouse/keyboard
    const isNonTouchDevice = !('ontouchstart' in window) && navigator.maxTouchPoints === 0;
    setHasMouseKeyboard(isNonTouchDevice);

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('keydown', handleKeyDown, { passive: true });
    document.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  // Mobile, tablet, desktop, and fullscreen detection and resize handler
  useEffect(() => {
    const checkDeviceType = () => {
      const { mobile, tablet, desktop, isCurrentlyFullscreen } = detectDeviceType();
      
      // Update orientation state
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const aspectRatio = windowWidth / windowHeight;
      const currentIsLandscape = (
        windowWidth > windowHeight ||
        aspectRatio > 1.2 ||
        (windowWidth >= 768 && aspectRatio > 1.0)
      );
      
      setIsMobile(mobile);
      setIsTablet(tablet);
      setIsDesktop(desktop);
      setIsFullscreen(isCurrentlyFullscreen);
      setIsLandscape(currentIsLandscape);
      
      // Close sidebar and preview on desktop only
      if (desktop && !tablet) {
        setShowSidebar(false);
        setShowPreview(false);
      }
      
      // For tablets without mouse/keyboard, also close sidebars when switching to desktop mode
      if (desktop && tablet && hasMouseKeyboard) {
        setShowSidebar(false);
        setShowPreview(false);
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(checkDeviceType, 100);
    window.addEventListener('resize', checkDeviceType);
    window.addEventListener('orientationchange', checkDeviceType);
    
    // Fullscreen change event listeners
    document.addEventListener('fullscreenchange', checkDeviceType);
    document.addEventListener('webkitfullscreenchange', checkDeviceType);
    document.addEventListener('mozfullscreenchange', checkDeviceType);
    document.addEventListener('MSFullscreenChange', checkDeviceType);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkDeviceType);
      window.removeEventListener('orientationchange', checkDeviceType);
      document.removeEventListener('fullscreenchange', checkDeviceType);
      document.removeEventListener('webkitfullscreenchange', checkDeviceType);
      document.removeEventListener('mozfullscreenchange', checkDeviceType);
      document.removeEventListener('MSFullscreenChange', checkDeviceType);
    };
  }, [hasMouseKeyboard]);

  // Touch event handlers for swipe gestures - Enhanced for tablets
  const handleTouchStart = (e) => {
    // Allow gestures on mobile and tablet devices
    if (!isMobile && !isTablet) return;
    
    // Don't prevent default on interactive elements (buttons, inputs, etc.)
    const target = e.target;
    const isInteractiveElement = target.tagName === 'BUTTON' || 
                                target.tagName === 'INPUT' || 
                                target.tagName === 'SELECT' || 
                                target.tagName === 'TEXTAREA' ||
                                target.tagName === 'A' ||
                                target.closest('button') || 
                                target.closest('input') || 
                                target.closest('select') ||
                                target.closest('a') ||
                                target.closest('.sidebar-panel') ||
                                target.closest('.preview-panel') ||
                                target.closest('.sidebar-btn') ||
                                target.closest('.sidebar-close') ||
                                target.closest('.preview-close');
    
    // Only prevent default if not touching interactive elements or if touching the main content area
    if (!isInteractiveElement && !showSidebar && !showPreview) {
      e.preventDefault();
    }
    
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    // Allow gestures on mobile and tablet devices
    if (!isMobile && !isTablet) return;
    
    // Don't prevent default on interactive elements (buttons, inputs, etc.)
    const target = e.target;
    const isInteractiveElement = target.tagName === 'BUTTON' || 
                                target.tagName === 'INPUT' || 
                                target.tagName === 'SELECT' || 
                                target.tagName === 'TEXTAREA' ||
                                target.tagName === 'A' ||
                                target.closest('button') || 
                                target.closest('input') || 
                                target.closest('select') ||
                                target.closest('a') ||
                                target.closest('.sidebar-panel') ||
                                target.closest('.preview-panel') ||
                                target.closest('.sidebar-btn') ||
                                target.closest('.sidebar-close') ||
                                target.closest('.preview-close');
    
    // Only prevent default if not touching interactive elements or if touching the main content area
    if (!isInteractiveElement && !showSidebar && !showPreview) {
      e.preventDefault();
    }
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;
    
    // Enhanced sensitivity settings for tablets and mobile
    const minSwipeDistance = isTablet ? 60 : 50; // Lower threshold for tablets for easier gestures
    const screenWidth = window.innerWidth;
    
    // Check if it's a horizontal swipe (more horizontal than vertical)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      
      // For tablets: Allow gestures from anywhere on screen with high sensitivity
      if (isTablet) {
        if (deltaX > 0) {
          // Swipe right (left to right) - show menu sidebar from anywhere
          setShowSidebar(true);
          setShowPreview(false);
        } else if (deltaX < 0) {
          // Swipe left (right to left) - show preview sidebar from anywhere
          setShowPreview(true);
          setShowSidebar(false);
        }
      } 
      // For mobile: Keep original edge-based behavior with enhanced center detection
      else if (isMobile) {
        if (deltaX > 0 && (touchStartX.current < 100 || Math.abs(deltaX) > 100)) {
          // Swipe right from left area or strong swipe - show sidebar
          setShowSidebar(true);
          setShowPreview(false);
        } else if (deltaX < 0 && (touchStartX.current > screenWidth - 100 || Math.abs(deltaX) > 100)) {
          // Swipe left from right area or strong swipe - show preview
          setShowPreview(true);
          setShowSidebar(false);
        }
      }
    }
  };

  // Enhanced swipe handlers for center screen gestures
  const handleSwipeLeft = () => {
    if ((isMobile || isTablet) && !showSidebar && !showPreview) {
      setShowPreview(true);
    }
  };

  const handleSwipeRight = () => {
    if ((isMobile || isTablet) && !showSidebar && !showPreview) {
      setShowSidebar(true);
    }
  };

  // Close all panels function
  const closeAllPanels = () => {
    setShowSidebar(false);
    setShowPreview(false);
    // Add a brief delay before showing menu buttons again
    setRecentlyClosed(true);
    setTimeout(() => {
      setRecentlyClosed(false);
    }, 300); // 300ms delay
  };

  // Desktop sidebar controls
  const toggleLeftSidebar = () => {
    setShowLeftSidebar(!showLeftSidebar);
    if (showRightSidebar) setShowRightSidebar(false);
  };

  const toggleRightSidebar = () => {
    setShowRightSidebar(!showRightSidebar);
    if (showLeftSidebar) setShowLeftSidebar(false);
  };

  const closeDesktopSidebars = () => {
    setShowLeftSidebar(false);
    setShowRightSidebar(false);
  };

  // Body scroll management - prevent background scrolling when sidebars are open
  useEffect(() => {
    const hasActiveSidebar = showSidebar || showPreview || showLeftSidebar || showRightSidebar;
    
    if (hasActiveSidebar) {
      // Store current scroll position
      const scrollY = window.scrollY;
      
      // Apply to both html and body for maximum compatibility
      document.documentElement.classList.add('body-no-scroll');
      document.body.classList.add('body-no-scroll');
      
      // Lock body position
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.body.style.overflow = 'hidden';
      
      // Lock html element as well
      document.documentElement.style.position = 'fixed';
      document.documentElement.style.height = '100%';
      document.documentElement.style.width = '100%';
      document.documentElement.style.overflow = 'hidden';
      
      // Prevent scrolling on window
      document.documentElement.style.scrollBehavior = 'auto';
      
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      
      // Remove classes
      document.documentElement.classList.remove('body-no-scroll');
      document.body.classList.remove('body-no-scroll');
      
      // Restore body styles
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.overflow = '';
      
      // Restore html styles
      document.documentElement.style.position = '';
      document.documentElement.style.height = '';
      document.documentElement.style.width = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.scrollBehavior = '';
      
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup function
    return () => {
      document.documentElement.classList.remove('body-no-scroll');
      document.body.classList.remove('body-no-scroll');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.overflow = '';
      document.documentElement.style.position = '';
      document.documentElement.style.height = '';
      document.documentElement.style.width = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.scrollBehavior = '';
    };
  }, [showSidebar, showPreview, showLeftSidebar, showRightSidebar]);

  // Synchronized scrolling between form and preview
  useEffect(() => {
    if (!isDesktop || !showRightSidebar) return;

    const formElement = formRef.current;
    const previewElement = previewContainerRef.current;

    if (!formElement || !previewElement) return;

    let isScrolling = false;

    const syncScroll = (source, target) => {
      if (isScrolling) return;
      isScrolling = true;
      
      const sourceScrollRatio = source.scrollTop / (source.scrollHeight - source.clientHeight);
      const targetScrollTop = sourceScrollRatio * (target.scrollHeight - target.clientHeight);
      
      target.scrollTop = targetScrollTop;
      
      setTimeout(() => {
        isScrolling = false;
      }, 50);
    };

    const handleFormScroll = () => syncScroll(formElement, previewElement);
    const handlePreviewScroll = () => syncScroll(previewElement, formElement);

    formElement.addEventListener('scroll', handleFormScroll, { passive: true });
    previewElement.addEventListener('scroll', handlePreviewScroll, { passive: true });

    return () => {
      formElement.removeEventListener('scroll', handleFormScroll);
      previewElement.removeEventListener('scroll', handlePreviewScroll);
    };
  }, [isDesktop, showRightSidebar]);

  // Initialize loading screen with realistic delay
  useEffect(() => {
    // Simulate actual app initialization with multiple stages
    const initializeApp = async () => {
      // Stage 1: Initial setup (500ms)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Stage 2: Load resources (750ms)
      await new Promise(resolve => setTimeout(resolve, 750));
      
      // Stage 3: Initialize components (750ms)
      await new Promise(resolve => setTimeout(resolve, 750));
      
      // Stage 4: Setup themes and templates (500ms)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Stage 5: Finalize and prepare launch (500ms)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Total: 3 seconds for a fast, responsive loading experience
      setIsLoading(false);
    };

    initializeApp();
  }, []);

  // Dynamic sidebar height to match resume content
  useEffect(() => {
    const adjustSidebarToContentHeight = () => {
      // For right sidebar (preview sidebar), use viewport height for scrollable content
      if (showRightSidebar) {
        const rightSidebar = document.querySelector('.desktop-sidebar.right-sidebar');
        if (rightSidebar) {
          rightSidebar.style.height = '100vh';
          rightSidebar.style.bottom = '0';
        }
      }
      
      // For left sidebar, keep viewport height
      if (showLeftSidebar) {
        const leftSidebar = document.querySelector('.desktop-sidebar.left-sidebar');
        if (leftSidebar) {
          leftSidebar.style.height = '100vh';
          leftSidebar.style.bottom = '0';
        }
      }
    };

    // Adjust when sidebar opens, content changes, or window resizes
    if (showRightSidebar || showLeftSidebar) {
      // Small delay to ensure DOM is updated
      setTimeout(adjustSidebarToContentHeight, 100);
    }
    
    // Also adjust on window resize
    window.addEventListener('resize', adjustSidebarToContentHeight);
    
    return () => {
      window.removeEventListener('resize', adjustSidebarToContentHeight);
    };
  }, [showRightSidebar, showLeftSidebar, resumeData, currentTheme]);

  // Theme change handler
  const handleThemeChange = (event) => {
    const newTheme = event.target.value;
    setCurrentTheme(newTheme);
    
    // Theme is now only applied to the resume preview via ResumeTemplate component
    // No longer updating the entire document's theme
    
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
  /* Add proper padding to prevent content from sticking to borders */
  padding: clamp(16px, 3vw, 24px);
  box-sizing: border-box;
  /* Ensure minimum spacing from container edges */
  min-height: 100vh;
  background: var(--surface-color, #ffffff);
}

.resume-header {
  background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
  color: var(--header-text);
  padding: clamp(1.5rem, 4vw, 2.5rem);
  text-align: center;
  position: relative;
  overflow: hidden;
  /* Header spans full width but maintains proper padding */
  margin: 0 calc(-1 * clamp(16px, 3vw, 24px)) clamp(1rem, 3vw, 1.5rem) calc(-1 * clamp(16px, 3vw, 24px));
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
  background: var(--section-hover-bg);
}

.experience-item:hover .experience-title {
  color: var(--accent-color);
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
  background: var(--section-hover-bg);
}

.education-item:hover .education-degree {
  color: var(--accent-color);
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
  background: var(--section-hover-bg);
}

.skill-category:hover .skill-category-title {
  color: var(--accent-color);
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

/* Netflix theme specific skill styling */
.netflix-theme .skill-item {
  background: #000000;
  color: #ffffff;
  border: 1px solid #333333;
}

.netflix-theme .skill-item:hover {
  background: var(--accent-color);
  color: var(--header-text);
  border-color: var(--accent-color);
  filter: none;
}

/* Dark theme specific skill styling */
.dark-theme .skill-item {
  background: #4a5568;
  color: #e2e8f0;
}

.dark-theme .skill-item:hover {
  background: var(--accent-color);
  color: var(--header-text);
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
  background: var(--section-hover-bg);
}

.certification-item:hover .certification-name {
  color: var(--accent-color);
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
  background: var(--section-hover-bg);
}

.achievement-item:hover .achievement-title {
  color: var(--accent-color);
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
    // Use state-based orientation detection for consistent behavior
    // This ensures orientation changes are properly detected and handled
    
    // Debug logging (remove in production)
    console.log('Loading Screen Detection:', {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      aspectRatio: (window.innerWidth / window.innerHeight).toFixed(2),
      isLandscape,
      screenType: isLandscape ? 'Desktop (Landscape)' : 'Mobile (Portrait)'
    });
    
    if (isLandscape) {
      return <DesktopLoadingScreen key="landscape-desktop" />;
    } else {
      return <LoadingScreen key="portrait-mobile" />;
    }
  }

  return (
    <div 
      className="app"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Enhanced Swipe Handler for center screen gestures - Optimized for tablets */}
      <SwipeHandler 
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        threshold={isTablet ? 60 : 80}
        restraint={isTablet ? 150 : 100}
        isTablet={isTablet}
      />

      {/* Tablet Gesture Hints */}
      <TabletGestureHints 
        isTablet={isTablet}
        showSidebar={showSidebar}
        showPreview={showPreview}
      />

      {/* Sidebar Overlay */}
      {(isMobile || isTablet) && showSidebar && (
        <div className="sidebar-overlay" onClick={closeAllPanels}>
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
                onClick={closeAllPanels}
              >
                ×
              </button>
            </div>
            
            <div className="sidebar-content">
              <div className="sidebar-section">
                <h4>Quick Actions</h4>
                <div className="sidebar-buttons">
                  <button 
                    className="sidebar-btn"
                    onClick={() => {
                      loadTestData();
                      closeAllPanels();
                    }}
                  >
                    <Users size={16} />
                    Load Test Data
                  </button>
                  
                  <button 
                    className="sidebar-btn"
                    onClick={() => {
                      resetForm();
                      closeAllPanels();
                    }}
                  >
                    <RotateCcw size={16} />
                    Reset Form
                  </button>
                  
                  <button 
                    className="sidebar-btn"
                    onClick={() => {
                      setShowAdmin(!showAdmin);
                      closeAllPanels();
                    }}
                  >
                    <Settings size={16} />
                    Admin Panel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Panel Overlay */}
      {(isMobile || isTablet) && showPreview && (
        <div className="preview-overlay" onClick={closeAllPanels}>
          <div 
            ref={previewPanelRef}
            className="preview-panel"
            onClick={e => e.stopPropagation()}
          >
            <div className="preview-panel-header">
              <h3>Resume Preview</h3>
              <div className="preview-panel-controls">
                <select
                  value={currentTheme}
                  onChange={handleThemeChange}
                  className="theme-select-inline"
                >
                  {themes.map(theme => (
                    <option key={theme.value} value={theme.value}>
                      {theme.label}
                    </option>
                  ))}
                </select>
                <button 
                  className="preview-close"
                  onClick={closeAllPanels}
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
              
              {/* Download Overlay Button - Bottom Right */}
              <button 
                className="preview-download-overlay-mobile"
                onClick={() => {
                  generateZipPackage();
                  closeAllPanels();
                }}
                disabled={isGeneratingHTML}
                title={isGeneratingHTML ? 'Generating...' : 'Download ZIP Package'}
              >
                <Download size={16} />
                {isGeneratingHTML && <div className="loading-spinner-mini"></div>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Buttons - Show for touch devices when header controls are hidden and no sidebars are open */}
      {(isMobile || isTablet) && !hasMouseKeyboard && !showSidebar && !showPreview && !showLeftSidebar && !showRightSidebar && !recentlyClosed && (
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

      {/* Desktop Edge Buttons - Show for desktop with mouse/keyboard */}
      {isDesktop && hasMouseKeyboard && (
        <>
          {/* Left Edge Button */}
          <button 
            className={`desktop-edge-btn left-edge ${showLeftSidebar ? 'active' : ''}`}
            onClick={toggleLeftSidebar}
            title="Toggle Actions Menu"
          >
            {showLeftSidebar ? '◀' : '▶'}
          </button>
          
          {/* Right Edge Button */}
          <button 
            className={`desktop-edge-btn right-edge ${showRightSidebar ? 'active' : ''}`}
            onClick={toggleRightSidebar}
            title="Toggle Preview & Export"
          >
            {showRightSidebar ? '▶' : '◀'}
          </button>
        </>
      )}

      {/* Desktop Left Sidebar - Actions Menu */}
      {isDesktop && hasMouseKeyboard && showLeftSidebar && (
        <>
          <div className="desktop-sidebar-overlay" onClick={closeDesktopSidebars}></div>
          <div className="desktop-sidebar left-sidebar">
            <div className="sidebar-header">
              <div className="sidebar-title">
                <FileEdit size={24} />
                <h3>Resume Builder Pro</h3>
              </div>
              <button 
                className="sidebar-close"
                onClick={() => setShowLeftSidebar(false)}
              >
                ×
              </button>
            </div>
            
            <div className="desktop-sidebar-content">
              <div className="sidebar-section">
                <h4>Quick Actions</h4>
                <div className="sidebar-buttons">
                  <button 
                    className="sidebar-btn"
                    onClick={() => {
                      loadTestData();
                      setShowLeftSidebar(false);
                    }}
                  >
                    <Users size={16} />
                    Load Test Data
                  </button>
                  
                  <button 
                    className="sidebar-btn"
                    onClick={() => {
                      resetForm();
                      setShowLeftSidebar(false);
                    }}
                  >
                    <RotateCcw size={16} />
                    Reset Form
                  </button>
                </div>
              </div>

              <div className="sidebar-section">
                <h4>Admin</h4>
                <div className="sidebar-buttons">
                  <button 
                    className="sidebar-btn"
                    onClick={() => {
                      setShowAdmin(!showAdmin);
                      setShowLeftSidebar(false);
                    }}
                  >
                    <Settings size={16} />
                    Admin Panel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Desktop Right Sidebar - Preview with Theme in Header */}
      {isDesktop && hasMouseKeyboard && showRightSidebar && (
        <>
          <div className="desktop-sidebar-overlay" onClick={closeDesktopSidebars}></div>
          <div className="desktop-sidebar right-sidebar">
            <div className="sidebar-header">
              <div className="sidebar-title">
                <FileText size={24} />
                <h3>Live Preview</h3>
              </div>
              <div className="sidebar-header-controls">
                <select
                  value={currentTheme}
                  onChange={handleThemeChange}
                  className="theme-select-header"
                >
                  {themes.map(theme => (
                    <option key={theme.value} value={theme.value}>
                      {theme.label}
                    </option>
                  ))}
                </select>
                <button 
                  className="sidebar-close"
                  onClick={() => setShowRightSidebar(false)}
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="desktop-sidebar-content">
              <h4>Preview</h4>
              <div className="desktop-preview-container" ref={previewContainerRef}>
                <ResumeTemplate 
                  ref={previewRef}
                  resumeData={resumeData}
                  theme={currentTheme}
                />
                
                {/* Download Overlay Button */}
                <button 
                  className="preview-download-overlay"
                  onClick={() => {
                    generateZipPackage();
                  }}
                  disabled={isGeneratingHTML}
                  title={isGeneratingHTML ? 'Generating...' : 'Download ZIP Package'}
                >
                  <Download size={20} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Notification */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Minimal Header with App Name and Logo */}
      <header className="app-header-minimal">
        <div className="header-brand">
          <div className="logo-container">
            <div className="logo-icon-group">
              <FileEdit className="logo-icon primary-icon" size={24} />
              <Star className="logo-icon accent-icon" size={16} />
              <Sparkles className="logo-icon sparkle-icon" size={12} />
            </div>
          </div>
          <h1 className="app-title">Resume Builder Pro</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className={`app-main main-content ${(isMobile || isTablet) && (showSidebar || showPreview) ? 'hidden' : ''} ${isDesktop && showRightSidebar ? 'sidebar-open' : ''}`}>
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
              <section className="form-section" ref={formRef}>
                <ResumeForm 
                  resumeData={resumeData}
                  setResumeData={setResumeData}
                  showNotification={showNotification}
                />
              </section>

              {/* Preview Section - Hidden on mobile and touch-only tablets, and on desktop with sidebars */}
              {!isMobile && hasMouseKeyboard && !isDesktop && (
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
      <footer className={`app-footer ${(isMobile || isTablet) && (showSidebar || showPreview) ? 'hidden' : ''}`}>
        <div className="container">
          <p>© 2024 Resume Builder Pro. Created with React & modern web technologies.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
