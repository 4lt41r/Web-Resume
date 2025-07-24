import React, { useState, useEffect } from 'react';
import { Download, Settings, Eye, Menu, X, Palette, Smartphone, Monitor, Tablet } from 'lucide-react';
import JSZip from 'jszip';
import ResumeForm from './components/ResumeForm';
import ResumeTemplate from './components/ResumeTemplate';
import LoadingScreen from './components/LoadingScreen';
import AdminPanel from './components/AdminPanel';
import './App.css';

// Capacitor imports for mobile features
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

// Available themes
const themes = [
  { id: 'professional', name: 'Professional', description: 'Clean and traditional', icon: '💼' },
  { id: 'creative', name: 'Creative', description: 'Bold and artistic', icon: '🎨' },
  { id: 'modern', name: 'Modern', description: 'Sleek and minimal', icon: '✨' },
  { id: 'elegant', name: 'Elegant', description: 'Sophisticated style', icon: '🌟' },
  { id: 'tech', name: 'Tech', description: 'Developer focused', icon: '⚡' },
];

// Preview modes
const previewModes = [
  { id: 'desktop', name: 'Desktop', icon: Monitor },
  { id: 'tablet', name: 'Tablet', icon: Tablet },
  { id: 'mobile', name: 'Mobile', icon: Smartphone },
];

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState('professional');
  const [previewMode, setPreviewMode] = useState('desktop');
  const [showAdmin, setShowAdmin] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  // Resume data state
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

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize Capacitor features
  useEffect(() => {
    const initializeApp = async () => {
      try {
        if (Capacitor.isNativePlatform()) {
          await StatusBar.setStyle({ style: Style.Default });
          await SplashScreen.hide();
        }

        // Check if this is the first visit
        const hasVisited = localStorage.getItem('hasVisited');
        if (!hasVisited) {
          setShowTutorial(true);
          localStorage.setItem('hasVisited', 'true');
        }

        // Load saved theme
        const savedTheme = localStorage.getItem('selectedTheme');
        if (savedTheme) {
          setCurrentTheme(savedTheme);
        }

        // Load saved resume data
        const savedData = localStorage.getItem('resumeData');
        if (savedData) {
          setResumeData(JSON.parse(savedData));
        }

        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing app:', error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Auto-save resume data
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('resumeData', JSON.stringify(resumeData));
    }, 1000);

    return () => clearTimeout(timer);
  }, [resumeData]);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('selectedTheme', currentTheme);
  }, [currentTheme]);

  // Notification system
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Handle touch events for mobile
  const handleTouchStart = (e) => {
    if (isMobile && showSidebar) {
      const touch = e.touches[0];
      window.touchStartX = touch.clientX;
    }
  };

  const handleTouchEnd = (e) => {
    if (isMobile && showSidebar && window.touchStartX) {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - window.touchStartX;
      
      if (deltaX < -100) { // Swipe left
        setShowSidebar(false);
      }
    }
  };

  // Load test data function for demo purposes
  const loadTestData = () => {
    if (window.confirm('This will replace your current data with test data. Are you sure?')) {
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

  // Generate HTML function for creating downloadable web package
  const generateHTML = async () => {
    try {
      setIsGenerating(true);
      
      // Fetch actual CSS files from the application
      const mainCssResponse = await fetch('/src_new/App.css');
      const mobileCssResponse = await fetch('/src_new/mobile.css');
      
      const mainCss = await mainCssResponse.text();
      const mobileCss = await mobileCssResponse.text();
      
      const resumeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${resumeData.personalInfo.fullName} - Resume</title>
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="styles/mobile.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="resume-container">
        <div class="resume-template ${currentTheme}">
            ${generateResumeContent()}
        </div>
    </div>
    <script src="scripts/main.js"></script>
</body>
</html>`;

      const jsContent = `
// Resume Interactive Features
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
        background: #667eea;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
    \`;
    
    printBtn.addEventListener('click', () => window.print());
    document.body.appendChild(printBtn);
    
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
});
`;

      const readmeContent = `# ${resumeData.personalInfo.fullName} - Resume Website

This is a static website version of ${resumeData.personalInfo.fullName}'s resume.

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
- ✅ Professional styling
- ✅ Interactive elements
- ✅ Fast loading
- ✅ SEO optimized

Generated on: ${new Date().toLocaleDateString()}
`;

      // Create ZIP file
      const zip = new JSZip();
      
      // Add files to ZIP
      zip.file('index.html', resumeHtml);
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
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume_Website.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showNotification('Resume website package downloaded successfully!', 'success');
    } catch (error) {
      console.error('Error generating resume package:', error);
      showNotification('Error generating resume package. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to generate resume content
  const generateResumeContent = () => {
    return `
      <!-- Personal Information Section -->
      <div class="resume-section personal-info">
        <div class="personal-info-content">
          <div class="personal-left">
            <h1 class="full-name">${resumeData.personalInfo.fullName}</h1>
            <div class="contact-info">
              ${resumeData.personalInfo.email ? `<div class="contact-item">
                <span class="contact-icon">📧</span>
                <span class="contact-text">${resumeData.personalInfo.email}</span>
              </div>` : ''}
              ${resumeData.personalInfo.phone ? `<div class="contact-item">
                <span class="contact-icon">📱</span>
                <span class="contact-text">${resumeData.personalInfo.phone}</span>
              </div>` : ''}
              ${resumeData.personalInfo.address ? `<div class="contact-item">
                <span class="contact-icon">📍</span>
                <span class="contact-text">${resumeData.personalInfo.address}</span>
              </div>` : ''}
            </div>
          </div>
          <div class="personal-right">
            <div class="social-links">
              ${resumeData.personalInfo.linkedin ? `<a href="https://${resumeData.personalInfo.linkedin}" class="social-link">
                <span class="social-icon">💼</span>
                <span class="social-text">LinkedIn</span>
              </a>` : ''}
              ${resumeData.personalInfo.github ? `<a href="https://${resumeData.personalInfo.github}" class="social-link">
                <span class="social-icon">🐙</span>
                <span class="social-text">GitHub</span>
              </a>` : ''}
              ${resumeData.personalInfo.website ? `<a href="https://${resumeData.personalInfo.website}" class="social-link">
                <span class="social-icon">🌐</span>
                <span class="social-text">Website</span>
              </a>` : ''}
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Section -->
      ${resumeData.summary ? `
      <div class="resume-section summary-section">
        <h2 class="section-title">
          <span class="section-icon">📋</span>
          Professional Summary
        </h2>
        <div class="summary-content">
          <p class="summary-text">${resumeData.summary}</p>
        </div>
      </div>` : ''}

      <!-- Experience Section -->
      ${resumeData.experience && resumeData.experience.length > 0 ? `
      <div class="resume-section experience-section">
        <h2 class="section-title">
          <span class="section-icon">💼</span>
          Professional Experience
        </h2>
        <div class="experience-content">
          ${resumeData.experience.map(exp => `
            <div class="experience-item">
              <div class="experience-header">
                <div class="experience-left">
                  <h3 class="position-title">${exp.position}</h3>
                  <div class="company-name">${exp.company}</div>
                  ${exp.location ? `<div class="location">${exp.location}</div>` : ''}
                </div>
                <div class="experience-right">
                  <div class="date-range">${exp.startDate} - ${exp.endDate}</div>
                </div>
              </div>
              ${exp.responsibilities && exp.responsibilities.length > 0 ? `
              <div class="responsibilities">
                <ul class="responsibilities-list">
                  ${exp.responsibilities.map(resp => `<li class="responsibility-item">${resp}</li>`).join('')}
                </ul>
              </div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>` : ''}

      <!-- Education Section -->
      ${resumeData.education && resumeData.education.length > 0 ? `
      <div class="resume-section education-section">
        <h2 class="section-title">
          <span class="section-icon">🎓</span>
          Education
        </h2>
        <div class="education-content">
          ${resumeData.education.map(edu => `
            <div class="education-item">
              <div class="education-header">
                <div class="education-left">
                  <h3 class="degree-title">${edu.degree}</h3>
                  <div class="institution-name">${edu.institution}</div>
                  ${edu.coursework ? `<div class="coursework">Relevant Coursework: ${edu.coursework}</div>` : ''}
                </div>
                <div class="education-right">
                  <div class="date-range">${edu.startDate} - ${edu.endDate}</div>
                  ${edu.gpa ? `<div class="gpa">GPA: ${edu.gpa}</div>` : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>` : ''}

      <!-- Skills Section -->
      ${resumeData.skills && resumeData.skills.length > 0 ? `
      <div class="resume-section skills-section">
        <h2 class="section-title">
          <span class="section-icon">⚡</span>
          Technical Skills
        </h2>
        <div class="skills-content">
          ${Object.entries(
            resumeData.skills.reduce((acc, skill) => {
              if (!acc[skill.category]) acc[skill.category] = [];
              acc[skill.category].push(skill.name);
              return acc;
            }, {})
          ).map(([category, skills]) => `
            <div class="skill-category">
              <h4 class="skill-category-title">${category}</h4>
              <div class="skill-tags">
                ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>` : ''}

      <!-- Certifications Section -->
      ${resumeData.certifications && resumeData.certifications.length > 0 ? `
      <div class="resume-section certifications-section">
        <h2 class="section-title">
          <span class="section-icon">🏆</span>
          Certifications
        </h2>
        <div class="certifications-content">
          ${resumeData.certifications.map(cert => `
            <div class="certification-item">
              <div class="certification-header">
                <div class="certification-left">
                  <h3 class="certification-name">${cert.name}</h3>
                  <div class="certification-issuer">${cert.issuer}</div>
                  ${cert.description ? `<div class="certification-description">${cert.description}</div>` : ''}
                </div>
                <div class="certification-right">
                  <div class="certification-date">${cert.date}</div>
                  ${cert.credentialId ? `<div class="credential-id">ID: ${cert.credentialId}</div>` : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>` : ''}

      <!-- Achievements Section -->
      ${resumeData.achievements && resumeData.achievements.length > 0 ? `
      <div class="resume-section achievements-section">
        <h2 class="section-title">
          <span class="section-icon">🌟</span>
          Key Achievements
        </h2>
        <div class="achievements-content">
          ${resumeData.achievements.map(achievement => `
            <div class="achievement-item">
              <div class="achievement-header">
                <h3 class="achievement-title">${achievement.title}</h3>
                <div class="achievement-date">${achievement.date}</div>
              </div>
              <div class="achievement-description">${achievement.description}</div>
            </div>
          `).join('')}
        </div>
      </div>` : ''}
    `;
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
          <div className="tutorial-content">
            <h2>Welcome to Resume Builder! 🎉</h2>
            <p>Let's take a quick tour of the features:</p>
            <div className="tutorial-steps">
              <div className={`tutorial-step ${tutorialStep === 0 ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>📝 Edit Your Resume</h3>
                  <p>Use the sidebar to input your personal information, experience, education, and skills.</p>
                </div>
              </div>
              <div className={`tutorial-step ${tutorialStep === 1 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>🎨 Choose a Theme</h3>
                  <p>Select from professional themes to match your style and industry.</p>
                </div>
              </div>
              <div className={`tutorial-step ${tutorialStep === 2 ? 'active' : ''}`}>
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>📱 Preview & Download</h3>
                  <p>Preview on different devices and download as a complete website package.</p>
                </div>
              </div>
            </div>
            <div className="tutorial-actions">
              <button 
                className="tutorial-btn secondary"
                onClick={() => setShowTutorial(false)}
              >
                Skip Tour
              </button>
              <button 
                className="tutorial-btn primary"
                onClick={() => {
                  if (tutorialStep < 2) {
                    setTutorialStep(tutorialStep + 1);
                  } else {
                    setShowTutorial(false);
                  }
                }}
              >
                {tutorialStep < 2 ? 'Next' : 'Get Started'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <>
          {/* Mobile Header */}
          <div className="mobile-header">
            <button 
              className="mobile-menu-btn"
              onClick={() => setShowSidebar(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="mobile-title">Resume Builder</h1>
            <div className="mobile-actions">
              <button 
                className="mobile-action-btn"
                onClick={() => setShowThemeSelector(true)}
              >
                <Palette size={20} />
              </button>
            </div>
          </div>

          {/* Sidebar Overlay */}
          {showSidebar && (
            <div className="sidebar-overlay" onClick={() => setShowSidebar(false)}>
              <div className="sidebar-content" onClick={(e) => e.stopPropagation()}>
                <div className="sidebar-header">
                  <h2>Edit Resume</h2>
                  <button 
                    className="close-btn"
                    onClick={() => setShowSidebar(false)}
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="sidebar-form">
                  <ResumeForm 
                    resumeData={resumeData} 
                    setResumeData={setResumeData} 
                    showNotification={showNotification}
                  />
                  <button 
                    className="sidebar-btn"
                    onClick={() => {
                      loadTestData();
                      setShowSidebar(false);
                    }}
                  >
                    Load Test Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Theme Selector Modal */}
      {showThemeSelector && (
        <div className="theme-selector-overlay" onClick={() => setShowThemeSelector(false)}>
          <div className="theme-selector-content" onClick={(e) => e.stopPropagation()}>
            <div className="theme-selector-header">
              <h2>Choose a Theme</h2>
              <button 
                className="close-btn"
                onClick={() => setShowThemeSelector(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="theme-grid">
              {themes.map(theme => (
                <div 
                  key={theme.id}
                  className={`theme-card ${currentTheme === theme.id ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentTheme(theme.id);
                    setShowThemeSelector(false);
                    showNotification(`${theme.name} theme applied!`, 'success');
                  }}
                >
                  <div className="theme-preview">
                    <div className={`theme-sample ${theme.id}`}>
                      <div className="sample-header"></div>
                      <div className="sample-content">
                        <div className="sample-line long"></div>
                        <div className="sample-line medium"></div>
                        <div className="sample-line short"></div>
                      </div>
                    </div>
                  </div>
                  <div className="theme-info">
                    <div className="theme-icon">{theme.icon}</div>
                    <h3>{theme.name}</h3>
                    <p>{theme.description}</p>
                  </div>
                  {currentTheme === theme.id && (
                    <div className="theme-selected">✓</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className={`main-layout ${isMobile ? 'mobile' : 'desktop'}`}>
        {/* Left Sidebar - Desktop Only */}
        {!isMobile && (
          <div className="left-sidebar">
            <div className="sidebar-header">
              <h1 className="app-title">Resume Builder</h1>
              <div className="sidebar-actions">
                <button 
                  className="action-btn"
                  onClick={() => setShowAdmin(!showAdmin)}
                  title="Admin Panel"
                >
                  <Settings size={18} />
                </button>
              </div>
            </div>
            
            <div className="sidebar-content">
              <ResumeForm 
                resumeData={resumeData} 
                setResumeData={setResumeData} 
                showNotification={showNotification}
              />
              
              <div className="sidebar-footer">
                <button 
                  className="sidebar-btn secondary"
                  onClick={loadTestData}
                >
                  Load Test Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="main-content">
          {/* Top Bar */}
          <div className="top-bar">
            <div className="top-bar-left">
              {!isMobile && (
                <div className="theme-selector">
                  <label>Theme:</label>
                  <select 
                    value={currentTheme} 
                    onChange={(e) => setCurrentTheme(e.target.value)}
                    className="theme-select"
                  >
                    {themes.map(theme => (
                      <option key={theme.id} value={theme.id}>
                        {theme.icon} {theme.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="preview-modes">
                {previewModes.map(mode => (
                  <button 
                    key={mode.id}
                    className={`preview-btn ${previewMode === mode.id ? 'active' : ''}`}
                    onClick={() => setPreviewMode(mode.id)}
                    title={mode.name}
                  >
                    <mode.icon size={16} />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="top-bar-right">
              <button 
                className="action-btn primary"
                onClick={generateHTML}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <div className="spinner"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    Download Website Package
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Resume Preview */}
          <div className={`resume-preview ${previewMode}`}>
            <div className="preview-container">
              <ResumeTemplate 
                data={resumeData}
                theme={currentTheme}
                previewMode={previewMode}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Admin Panel */}
      {showAdmin && (
        <AdminPanel 
          onClose={() => setShowAdmin(false)}
          resumeData={resumeData}
          setResumeData={setResumeData}
          showNotification={showNotification}
        />
      )}

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-content">
            <span className="notification-message">{notification.message}</span>
            <button 
              className="notification-close"
              onClick={() => setNotification(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
