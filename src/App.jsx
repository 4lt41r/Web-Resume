import React, { useState, useEffect } from 'react';
import { Download, Settings, Eye, FileText, Palette } from 'lucide-react';
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
  { id: 'professional', name: 'Professional', class: 'professional-theme' },
  { id: 'dark', name: 'Dark Mode', class: 'dark-theme' },
  { id: 'amazon', name: 'Amazon', class: 'amazon-theme' },
  { id: 'netflix', name: 'Netflix', class: 'netflix-theme' },
  { id: 'google', name: 'Google', class: 'google-theme' },
];

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState('professional');
  const [showAdmin, setShowAdmin] = useState(false);
  const [notification, setNotification] = useState(null);
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: 'Alex Johnson',
      profession: 'Senior Software Engineer',
      email: 'alex.johnson@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      website: 'https://alexjohnson.dev',
      linkedin: 'https://linkedin.com/in/alexjohnson',
      summary: 'Experienced software engineer with 7+ years developing scalable web applications and leading cross-functional teams. Passionate about clean code, innovative solutions, and mentoring junior developers. Proven track record of delivering high-impact projects on time and within budget.'
    },
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'Stanford University',
        graduationDate: '2017-05',
        gpa: '3.8',
        details: 'Magna Cum Laude, Dean\'s List for 6 semesters'
      },
      {
        degree: 'Master of Science in Software Engineering',
        institution: 'MIT',
        graduationDate: '2019-05',
        gpa: '3.9',
        details: 'Thesis: "Optimizing Distributed Systems for Real-time Applications"'
      }
    ],
    experience: [
      {
        position: 'Senior Software Engineer',
        company: 'Google',
        startDate: '2021-01',
        endDate: '',
        current: true,
        description: '• Led development of microservices architecture serving 10M+ daily users\n• Reduced system latency by 40% through performance optimization\n• Mentored 5 junior engineers and conducted technical interviews\n• Collaborated with product managers to define technical requirements'
      },
      {
        position: 'Software Engineer II',
        company: 'Microsoft',
        startDate: '2019-06',
        endDate: '2020-12',
        current: false,
        description: '• Developed cloud-native applications using Azure services\n• Implemented CI/CD pipelines reducing deployment time by 60%\n• Built RESTful APIs handling 1M+ requests per day\n• Participated in on-call rotation and incident response'
      },
      {
        position: 'Software Engineer Intern',
        company: 'Facebook',
        startDate: '2018-06',
        endDate: '2018-08',
        current: false,
        description: '• Built React components for internal developer tools\n• Improved code coverage by 25% through comprehensive testing\n• Collaborated with senior engineers on feature development\n• Presented final project to engineering leadership'
      }
    ],
    skills: [
      {
        category: 'Programming Languages',
        items: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'C++']
      },
      {
        category: 'Frontend Technologies',
        items: ['React', 'Vue.js', 'Angular', 'HTML5', 'CSS3', 'Sass']
      },
      {
        category: 'Backend Technologies',
        items: ['Node.js', 'Express', 'Django', 'Spring Boot', 'GraphQL']
      },
      {
        category: 'Databases',
        items: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'DynamoDB']
      },
      {
        category: 'Cloud & DevOps',
        items: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform']
      }
    ],
    certifications: [
      {
        name: 'AWS Solutions Architect Professional',
        issuer: 'Amazon Web Services',
        date: '2023-03',
        credentialId: 'AWS-SAP-2023-001',
        details: 'Advanced certification for designing distributed systems on AWS'
      },
      {
        name: 'Certified Kubernetes Administrator',
        issuer: 'Cloud Native Computing Foundation',
        date: '2022-09',
        credentialId: 'CKA-2022-789',
        details: 'Demonstrates expertise in Kubernetes administration and troubleshooting'
      },
      {
        name: 'Google Cloud Professional Developer',
        issuer: 'Google Cloud',
        date: '2022-01',
        credentialId: 'GCP-PD-2022-456',
        details: 'Proficiency in developing applications on Google Cloud Platform'
      }
    ],
    achievements: [
      {
        title: 'Innovation Award Winner',
        description: 'Received company-wide innovation award for developing AI-powered code review system that reduced review time by 50%',
        date: '2023-12'
      },
      {
        title: 'Open Source Contributor',
        description: 'Active contributor to React ecosystem with 500+ GitHub stars across personal projects. Maintained popular npm packages with 10K+ weekly downloads',
        date: '2020-01'
      },
      {
        title: 'Technical Conference Speaker',
        description: 'Keynote speaker at ReactConf 2023 on "Building Scalable Component Libraries". Presented at 5+ technical conferences with 1000+ attendees',
        date: '2023-10'
      },
      {
        title: 'Team Leadership Excellence',
        description: 'Successfully led cross-functional team of 12 engineers to deliver major platform migration 2 weeks ahead of schedule, resulting in $2M cost savings',
        date: '2022-08'
      }
    ]
  });

  // Simulate loading screen on app start
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Initialize mobile features if running on native platform
    if (Capacitor.isNativePlatform()) {
      StatusBar.setStyle({ style: Style.Default });
      StatusBar.setBackgroundColor({ color: '#2c3e50' });
      setTimeout(() => {
        SplashScreen.hide();
      }, 1500);
    }

    return () => clearTimeout(timer);
  }, []);

  // Apply theme to document body and status bar
  useEffect(() => {
    const themeClass = themes.find(theme => theme.id === currentTheme)?.class;
    if (themeClass) {
      document.body.className = themeClass;
    }

    // Update status bar for mobile
    if (Capacitor.isNativePlatform()) {
      const isDarkTheme = currentTheme === 'dark' || currentTheme === 'netflix';
      StatusBar.setStyle({ style: isDarkTheme ? Style.Dark : Style.Default });
      
      let statusBarColor = '#2c3e50';
      switch (currentTheme) {
        case 'amazon':
          statusBarColor = '#ff9900';
          break;
        case 'netflix':
          statusBarColor = '#000000';
          break;
        case 'google':
          statusBarColor = '#4285f4';
          break;
        case 'dark':
          statusBarColor = '#121212';
          break;
      }
      StatusBar.setBackgroundColor({ color: statusBarColor });
    }
  }, [currentTheme]);

  const handleThemeChange = (themeId) => {
    setCurrentTheme(themeId);
  };

  const handleResumeDataChange = (newData) => {
    setResumeData(newData);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    const duration = Capacitor.isNativePlatform() ? 4000 : 3000;
    setTimeout(() => setNotification(null), duration);
  };

  const validateResumeData = () => {
    const { personalInfo, experience, education } = resumeData;
    
    if (!personalInfo.fullName?.trim()) {
      showNotification('Please enter your full name', 'error');
      return false;
    }
    
    if (!personalInfo.email?.trim()) {
      showNotification('Please enter your email address', 'error');
      return false;
    }
    
    if (!personalInfo.profession?.trim()) {
      showNotification('Please enter your profession', 'error');
      return false;
    }
    
    if (experience.length === 0 && education.length === 0) {
      showNotification('Please add at least one experience or education entry', 'error');
      return false;
    }
    
    return true;
  };

  const handleDownloadHTML = () => {
    if (!validateResumeData()) return;
    
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${resumeData.personalInfo.fullName} - Resume</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .section { margin-bottom: 25px; }
    h1 { color: #2563eb; }
    h2 { border-bottom: 2px solid #2563eb; color: #2563eb; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${resumeData.personalInfo.fullName}</h1>
    <p>${resumeData.personalInfo.profession}</p>
    <p>${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone}</p>
  </div>
  
  <div class="section">
    <h2>About Me</h2>
    <p>${resumeData.personalInfo.summary}</p>
  </div>
  
  <div class="section">
    <h2>Experience</h2>
    ${resumeData.experience.map(exp => `
      <div style="margin-bottom: 15px;">
        <h3>${exp.position} - ${exp.company}</h3>
        <p><strong>${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</strong></p>
        <p>${exp.description}</p>
      </div>
    `).join('')}
  </div>
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.personalInfo.fullName || 'resume'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('HTML resume downloaded successfully!');
  };

  const handleOpenInBrowser = () => {
    if (!validateResumeData()) return;
    
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${resumeData.personalInfo.fullName} - Resume</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 30px; }
    .section { margin-bottom: 25px; }
    h1 { color: #2563eb; margin-bottom: 10px; }
    h2 { border-bottom: 2px solid #2563eb; color: #2563eb; padding-bottom: 5px; }
    .contact { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; }
    .experience-item { margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${resumeData.personalInfo.fullName}</h1>
      <p style="font-size: 18px; color: #666;">${resumeData.personalInfo.profession}</p>
      <div class="contact">
        <span>📧 ${resumeData.personalInfo.email}</span>
        <span>📞 ${resumeData.personalInfo.phone}</span>
        <span>📍 ${resumeData.personalInfo.location}</span>
      </div>
    </div>
    
    <div class="section">
      <h2>About Me</h2>
      <p>${resumeData.personalInfo.summary}</p>
    </div>
    
    <div class="section">
      <h2>Experience</h2>
      ${resumeData.experience.map(exp => `
        <div class="experience-item">
          <h3 style="margin: 0 0 5px 0; color: #333;">${exp.position} - ${exp.company}</h3>
          <p style="margin: 0 0 10px 0; font-weight: bold; color: #666;">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</p>
          <p style="margin: 0; line-height: 1.6;">${exp.description.replace(/\n/g, '<br>')}</p>
        </div>
      `).join('')}
    </div>
    
    <div class="section">
      <h2>Education</h2>
      ${resumeData.education.map(edu => `
        <div class="experience-item">
          <h3 style="margin: 0 0 5px 0; color: #333;">${edu.degree}</h3>
          <p style="margin: 0 0 10px 0; font-weight: bold; color: #666;">${edu.institution} - ${edu.graduationDate}</p>
          <p style="margin: 0;">GPA: ${edu.gpa} | ${edu.details}</p>
        </div>
      `).join('')}
    </div>
    
    <div class="section">
      <h2>Skills</h2>
      ${resumeData.skills.map(skill => `
        <div style="margin-bottom: 10px;">
          <strong>${skill.category}:</strong> ${skill.items.join(', ')}
        </div>
      `).join('')}
    </div>
  </div>
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showNotification('Resume opened in new browser tab!');
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="app">
      {/* Notification */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div className="title-row">
              <div className="title-content">
                <FileText size={32} className="text-primary" />
                <h1>Resume Builder</h1>
              </div>
            </div>
            
            <div className="controls-row">
              <div className="theme-selector">
                <Palette size={20} />
                <select 
                  value={currentTheme} 
                  onChange={(e) => handleThemeChange(e.target.value)}
                  className="form-input"
                >
                  {themes.map(theme => (
                    <option key={theme.id} value={theme.id}>
                      {theme.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="action-buttons">
                <div className="download-options">
                  <button 
                    onClick={handleDownloadHTML}
                    className="btn btn-secondary"
                    title="Download as HTML"
                  >
                    <Download size={16} />
                    <span>HTML</span>
                  </button>
                  <button 
                    onClick={handleOpenInBrowser}
                    className="btn btn-accent"
                    title="Open in Browser"
                  >
                    <Eye size={16} />
                    <span>Browser</span>
                  </button>
                </div>

                <button 
                  onClick={() => setShowAdmin(!showAdmin)}
                  className="btn btn-secondary"
                  title="Admin Panel"
                >
                  <Settings size={16} />
                  <span className="admin-text">Admin</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Panel */}
      {showAdmin && (
        <AdminPanel onClose={() => setShowAdmin(false)} />
      )}

      {/* Main Content */}
      <main className="app-main">
        <div className="container">
          <div className="resume-builder">
            <div className="form-section">
              <div className="card">
                <h2 className="mb-6">Resume Information</h2>
                <ResumeForm 
                  resumeData={resumeData}
                  onChange={handleResumeDataChange}
                />
              </div>
            </div>

            <div className="preview-section">
              <div className="preview-header">
                <div className="flex items-center gap-2">
                  <Eye size={20} />
                  <h2>Live Preview</h2>
                </div>
                <div className="theme-indicator">
                  <span className="text-sm text-secondary">
                    Current Theme: {themes.find(theme => theme.id === currentTheme)?.name}
                  </span>
                </div>
              </div>
              
              <div className="preview-container">
                <ResumeTemplate 
                  resumeData={resumeData}
                  theme={currentTheme}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="container text-center">
          <p>&copy; 2025 Professional Resume Builder. Create stunning resumes with ease.</p>
          <p className="text-sm text-secondary mt-2">
            Built with React, Vite & Modern Web Technologies | 
            <span className="ml-2">🚀 Fast • 📱 Responsive • 🎨 Beautiful</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
