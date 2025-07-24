import React, { useState, useEffect, useRef } from 'react';
import { FileEdit, Download, Settings, Users, RotateCcw, Home } from 'lucide-react';
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

  // HTML generation handler
  const generateHTML = async (format = 'standard') => {
    if (!previewRef.current) {
      showNotification('Resume preview not available', 'error');
      return;
    }

    setIsGeneratingHTML(true);
    showNotification('Generating HTML...', 'info');

    try {
      const element = previewRef.current;
      
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

      // Get the resume content
      const resumeContent = element.outerHTML;
      
      // Create complete HTML document with inline CSS
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${resumeData.personalInfo.fullName || 'Resume'} - Professional Resume</title>
    <style>
        /* Reset and base styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
            padding: 20px;
        }
        
        .resume-container {
            max-width: 8.5in;
            margin: 0 auto;
            background: white;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
            animation: fadeInUp 0.8s ease-out;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .resume-section {
            padding: 24px;
            margin-bottom: 8px;
            border-left: 4px solid transparent;
            transition: all 0.3s ease;
            position: relative;
            background: white;
        }
        
        .resume-section:hover {
            background: #fafafa;
            border-left-color: var(--accent-color, #667eea);
            transform: translateX(4px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .resume-section::before {
            content: '';
            position: absolute;
            left: -4px;
            top: 0;
            bottom: 0;
            width: 4px;
            background: linear-gradient(to bottom, var(--accent-color, #667eea), var(--secondary-color, #764ba2));
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .resume-section:hover::before {
            opacity: 1;
        }
        
        .section-header {
            animation: slideInLeft 0.6s ease-out;
        }
        
        .section-content {
            animation: slideInRight 0.6s ease-out 0.2s both;
        }
        
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        /* Theme-specific variables */
        .professional-theme {
            --accent-color: #2563eb;
            --secondary-color: #3b82f6;
            --text-color: #1e293b;
            --bg-color: #ffffff;
        }
        
        .amazon-theme {
            --accent-color: #ff9900;
            --secondary-color: #ff6b35;
            --text-color: #232f3e;
            --bg-color: #ffffff;
        }
        
        .netflix-theme {
            --accent-color: #e50914;
            --secondary-color: #f40612;
            --text-color: #333333;
            --bg-color: #ffffff;
        }
        
        .google-theme {
            --accent-color: #4285f4;
            --secondary-color: #34a853;
            --text-color: #202124;
            --bg-color: #ffffff;
        }
        
        .dark-theme {
            --accent-color: #667eea;
            --secondary-color: #764ba2;
            --text-color: #e2e8f0;
            --bg-color: #1a202c;
        }
        
        .dark-theme body {
            background: #2d3748;
            color: #e2e8f0;
        }
        
        .dark-theme .resume-container {
            background: #1a202c;
        }
        
        .dark-theme .resume-section {
            background: #1a202c;
        }
        
        .dark-theme .resume-section:hover {
            background: #2d3748;
        }
        
        /* Responsive design */
        @media (max-width: 768px) {
            body {
                padding: 10px;
            }
            
            .resume-section {
                padding: 16px;
            }
        }
        
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .resume-container {
                box-shadow: none;
                border-radius: 0;
            }
            
            .resume-section {
                break-inside: avoid;
                page-break-inside: avoid;
            }
        }
        
        ${cssStyles}
    </style>
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
    
    <script>
        // Add interactive features
        document.addEventListener('DOMContentLoaded', function() {
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
            
            // Add smooth scroll for long resumes
            if (document.body.scrollHeight > window.innerHeight) {
                document.body.style.scrollBehavior = 'smooth';
            }
        });
    </script>
</body>
</html>`;

      // Create and download the file
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume_${format}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showNotification('HTML file downloaded successfully!', 'success');
    } catch (error) {
      console.error('HTML generation failed:', error);
      showNotification('Failed to generate HTML. Please try again.', 'error');
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
                <h4>Download HTML</h4>
                <div className="sidebar-buttons">
                  <button 
                    className="sidebar-btn"
                    onClick={() => {
                      generateHTML('standard');
                      setShowSidebar(false);
                    }}
                    disabled={isGeneratingHTML}
                  >
                    <Download size={16} />
                    {isGeneratingHTML ? 'Generating...' : 'HTML Standard'}
                  </button>
                  
                  <button 
                    className="sidebar-btn"
                    onClick={() => {
                      generateHTML('optimized');
                      setShowSidebar(false);
                    }}
                    disabled={isGeneratingHTML}
                  >
                    <Download size={16} />
                    {isGeneratingHTML ? 'Generating...' : 'HTML Optimized'}
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
                    onClick={() => generateHTML('standard')}
                    disabled={isGeneratingHTML}
                    title="Download HTML (Standard)"
                  >
                    <Download size={16} />
                    <span>{isGeneratingHTML ? 'Generating...' : 'HTML Standard'}</span>
                  </button>

                  <button 
                    className="btn"
                    onClick={() => generateHTML('optimized')}
                    disabled={isGeneratingHTML}
                    title="Download HTML (Optimized)"
                  >
                    <Download size={16} />
                    <span>{isGeneratingHTML ? 'Generating...' : 'HTML Optimized'}</span>
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
