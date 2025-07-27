import React from 'react';
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Code, 
  Award, 
  Trophy, 
  Plus, 
  Trash2,
  FileText
} from 'lucide-react';

const ResumeForm = ({ resumeData, setResumeData, showNotification }) => {
  
  // Personal Info handlers
  const updatePersonalInfo = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  // Summary handler
  const updateSummary = (value) => {
    setResumeData(prev => ({
      ...prev,
      summary: value
    }));
  };

  // Education handlers
  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      degree: '',
      institution: '',
      startDate: '',
      endDate: '',
      gpa: '',
      coursework: ''
    };
    
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
    
    showNotification('Education entry added', 'success');
  };

  const updateEducation = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
    
    showNotification('Education entry removed', 'info');
  };

  // Experience handlers
  const addExperience = () => {
    const newExperience = {
      id: Date.now(),
      position: '',
      company: '',
      startDate: '',
      endDate: '',
      location: '',
      responsibilities: ['']
    };
    
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
    
    showNotification('Experience entry added', 'success');
  };

  const updateExperience = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
    
    showNotification('Experience entry removed', 'info');
  };

  const addResponsibility = (experienceId) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === experienceId 
          ? { ...exp, responsibilities: [...exp.responsibilities, ''] }
          : exp
      )
    }));
  };

  const updateResponsibility = (experienceId, index, value) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === experienceId 
          ? { 
              ...exp, 
              responsibilities: exp.responsibilities.map((resp, i) =>
                i === index ? value : resp
              )
            }
          : exp
      )
    }));
  };

  const removeResponsibility = (experienceId, index) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === experienceId 
          ? { 
              ...exp, 
              responsibilities: exp.responsibilities.filter((_, i) => i !== index)
            }
          : exp
      )
    }));
  };

  // Skills handlers
  const addSkill = () => {
    const newSkill = {
      id: Date.now(),
      name: '',
      category: 'Technical Skills'
    };
    
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
    
    showNotification('Skill added', 'success');
  };

  const updateSkill = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const removeSkill = (id) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
    
    showNotification('Skill removed', 'info');
  };

  // Certification handlers
  const addCertification = () => {
    const newCertification = {
      id: Date.now(),
      name: '',
      issuer: '',
      date: '',
      credentialId: '',
      description: ''
    };
    
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCertification]
    }));
    
    showNotification('Certification added', 'success');
  };

  const updateCertification = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const removeCertification = (id) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id)
    }));
    
    showNotification('Certification removed', 'info');
  };

  // Achievement handlers
  const addAchievement = () => {
    const newAchievement = {
      id: Date.now(),
      title: '',
      description: '',
      date: ''
    };
    
    setResumeData(prev => ({
      ...prev,
      achievements: [...prev.achievements, newAchievement]
    }));
    
    showNotification('Achievement added', 'success');
  };

  const updateAchievement = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      achievements: prev.achievements.map(achievement =>
        achievement.id === id ? { ...achievement, [field]: value } : achievement
      )
    }));
  };

  const removeAchievement = (id) => {
    setResumeData(prev => ({
      ...prev,
      achievements: prev.achievements.filter(achievement => achievement.id !== id)
    }));
    
    showNotification('Achievement removed', 'info');
  };

  return (
    <div className="resume-form">
      {/* Personal Information */}
      <div className="form-section-item">
        <div className="section-header">
          <h3>
            <User size={20} />
            Personal Information
          </h3>
        </div>
        
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-input"
              value={resumeData.personalInfo.fullName}
              onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              className="form-input"
              value={resumeData.personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              placeholder="john.doe@email.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              className="form-input"
              value={resumeData.personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">LinkedIn</label>
            <input
              type="text"
              className="form-input"
              value={resumeData.personalInfo.linkedin}
              onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
              placeholder="linkedin.com/in/johndoe"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-input"
              value={resumeData.personalInfo.address}
              onChange={(e) => updatePersonalInfo('address', e.target.value)}
              placeholder="City, State"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">GitHub</label>
            <input
              type="text"
              className="form-input"
              value={resumeData.personalInfo.github}
              onChange={(e) => updatePersonalInfo('github', e.target.value)}
              placeholder="github.com/johndoe"
            />
          </div>
          
          <div className="form-group form-grid-full">
            <label className="form-label">Website/Portfolio</label>
            <input
              type="text"
              className="form-input"
              value={resumeData.personalInfo.website}
              onChange={(e) => updatePersonalInfo('website', e.target.value)}
              placeholder="johndoe.dev"
            />
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="form-section-item">
        <div className="section-header">
          <h3>
            <FileText size={20} />
            Professional Summary
          </h3>
        </div>
        
        <div className="form-group">
          <label className="form-label">Summary</label>
          <textarea
            className="form-input form-textarea"
            value={resumeData.summary}
            onChange={(e) => updateSummary(e.target.value)}
            placeholder="Write a compelling professional summary that highlights your key skills, experience, and career objectives..."
            rows="4"
          />
        </div>
      </div>

      {/* Education */}
      <div className="form-section-item">
        <div className="section-header">
          <h3>
            <GraduationCap size={20} />
            Education
          </h3>
          <button className="btn" onClick={addEducation}>
            <Plus size={16} />
            <span>Add Education</span>
          </button>
        </div>
        
        <div className="form-items">
          {resumeData.education.map((education, index) => (
            <div key={education.id} className="form-item">
              <div className="item-header">
                <h4>Education #{index + 1}</h4>
                <button 
                  className="btn btn-danger"
                  onClick={() => removeEducation(education.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Degree *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={education.degree}
                    onChange={(e) => updateEducation(education.id, 'degree', e.target.value)}
                    placeholder="Bachelor of Science in Computer Science"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Institution *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={education.institution}
                    onChange={(e) => updateEducation(education.id, 'institution', e.target.value)}
                    placeholder="University Name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input
                    type="text"
                    className="form-input"
                    value={education.startDate}
                    onChange={(e) => updateEducation(education.id, 'startDate', e.target.value)}
                    placeholder="2018"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input
                    type="text"
                    className="form-input"
                    value={education.endDate}
                    onChange={(e) => updateEducation(education.id, 'endDate', e.target.value)}
                    placeholder="2022"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">GPA</label>
                  <input
                    type="text"
                    className="form-input"
                    value={education.gpa}
                    onChange={(e) => updateEducation(education.id, 'gpa', e.target.value)}
                    placeholder="3.8/4.0"
                  />
                </div>
                
                <div className="form-group form-grid-full">
                  <label className="form-label">Relevant Coursework</label>
                  <input
                    type="text"
                    className="form-input"
                    value={education.coursework}
                    onChange={(e) => updateEducation(education.id, 'coursework', e.target.value)}
                    placeholder="Data Structures, Algorithms, Database Systems"
                  />
                </div>
              </div>
            </div>
          ))}
          
          {resumeData.education.length === 0 && (
            <p className="empty-state">No education entries yet. Click "Add Education" to get started.</p>
          )}
        </div>
      </div>

      {/* Work Experience */}
      <div className="form-section-item">
        <div className="section-header">
          <h3>
            <Briefcase size={20} />
            Work Experience
          </h3>
          <button className="btn" onClick={addExperience}>
            <Plus size={16} />
            <span>Add Experience</span>
          </button>
        </div>
        
        <div className="form-items">
          {resumeData.experience.map((experience, index) => (
            <div key={experience.id} className="form-item">
              <div className="item-header">
                <h4>Experience #{index + 1}</h4>
                <button 
                  className="btn btn-danger"
                  onClick={() => removeExperience(experience.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Position *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={experience.position}
                    onChange={(e) => updateExperience(experience.id, 'position', e.target.value)}
                    placeholder="Software Engineer"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Company *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={experience.company}
                    onChange={(e) => updateExperience(experience.id, 'company', e.target.value)}
                    placeholder="Company Name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input
                    type="text"
                    className="form-input"
                    value={experience.startDate}
                    onChange={(e) => updateExperience(experience.id, 'startDate', e.target.value)}
                    placeholder="2020"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input
                    type="text"
                    className="form-input"
                    value={experience.endDate}
                    onChange={(e) => updateExperience(experience.id, 'endDate', e.target.value)}
                    placeholder="Present"
                  />
                </div>
                
                <div className="form-group form-grid-full">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-input"
                    value={experience.location}
                    onChange={(e) => updateExperience(experience.id, 'location', e.target.value)}
                    placeholder="City, State"
                  />
                </div>
              </div>
              
              <div className="responsibilities-section">
                <div className="section-header">
                  <h4>Key Responsibilities</h4>
                  <button 
                    className="btn"
                    onClick={() => addResponsibility(experience.id)}
                  >
                    <Plus size={16} />
                    <span>Add</span>
                  </button>
                </div>
                
                {experience.responsibilities.map((responsibility, respIndex) => (
                  <div key={respIndex} className="responsibility-item">
                    <textarea
                      className="form-input form-textarea"
                      value={responsibility}
                      onChange={(e) => updateResponsibility(experience.id, respIndex, e.target.value)}
                      placeholder="Describe a key responsibility or achievement..."
                      rows="2"
                    />
                    <button
                      className="btn btn-danger"
                      onClick={() => removeResponsibility(experience.id, respIndex)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {resumeData.experience.length === 0 && (
            <p className="empty-state">No work experience entries yet. Click "Add Experience" to get started.</p>
          )}
        </div>
      </div>

      {/* Skills */}
      <div className="form-section-item">
        <div className="section-header">
          <h3>
            <Code size={20} />
            Skills
          </h3>
          <button className="btn" onClick={addSkill}>
            <Plus size={16} />
            <span>Add Skill</span>
          </button>
        </div>
        
        <div className="form-items">
          {resumeData.skills.map((skill, index) => (
            <div key={skill.id} className="form-item">
              <div className="item-header">
                <h4>Skill #{index + 1}</h4>
                <button 
                  className="btn btn-danger"
                  onClick={() => removeSkill(skill.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Skill Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                    placeholder="JavaScript"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={skill.category}
                    onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                  >
                    <option value="Programming Languages">Programming Languages</option>
                    <option value="Frontend Frameworks">Frontend Frameworks</option>
                    <option value="Backend Technologies">Backend Technologies</option>
                    <option value="Databases">Databases</option>
                    <option value="Cloud Platforms">Cloud Platforms</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Version Control">Version Control</option>
                    <option value="Design Tools">Design Tools</option>
                    <option value="Soft Skills">Soft Skills</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
          
          {resumeData.skills.length === 0 && (
            <p className="empty-state">No skills added yet. Click "Add Skill" to get started.</p>
          )}
        </div>
      </div>

      {/* Certifications */}
      <div className="form-section-item">
        <div className="section-header">
          <h3>
            <Award size={20} />
            Certifications
          </h3>
          <button className="btn" onClick={addCertification}>
            <Plus size={16} />
            <span>Add Certification</span>
          </button>
        </div>
        
        <div className="form-items">
          {resumeData.certifications.map((certification, index) => (
            <div key={certification.id} className="form-item">
              <div className="item-header">
                <h4>Certification #{index + 1}</h4>
                <button 
                  className="btn btn-danger"
                  onClick={() => removeCertification(certification.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Certification Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={certification.name}
                    onChange={(e) => updateCertification(certification.id, 'name', e.target.value)}
                    placeholder="AWS Certified Solutions Architect"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Issuing Organization</label>
                  <input
                    type="text"
                    className="form-input"
                    value={certification.issuer}
                    onChange={(e) => updateCertification(certification.id, 'issuer', e.target.value)}
                    placeholder="Amazon Web Services"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Date Obtained</label>
                  <input
                    type="text"
                    className="form-input"
                    value={certification.date}
                    onChange={(e) => updateCertification(certification.id, 'date', e.target.value)}
                    placeholder="2023"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Credential ID</label>
                  <input
                    type="text"
                    className="form-input"
                    value={certification.credentialId}
                    onChange={(e) => updateCertification(certification.id, 'credentialId', e.target.value)}
                    placeholder="ABC123456"
                  />
                </div>
                
                <div className="form-group form-grid-full">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input form-textarea"
                    value={certification.description}
                    onChange={(e) => updateCertification(certification.id, 'description', e.target.value)}
                    placeholder="Brief description of the certification..."
                    rows="2"
                  />
                </div>
              </div>
            </div>
          ))}
          
          {resumeData.certifications.length === 0 && (
            <p className="empty-state">No certifications added yet. Click "Add Certification" to get started.</p>
          )}
        </div>
      </div>

      {/* Achievements */}
      <div className="form-section-item">
        <div className="section-header">
          <h3>
            <Trophy size={20} />
            Achievements & Awards
          </h3>
          <button className="btn" onClick={addAchievement}>
            <Plus size={16} />
            <span>Add Achievement</span>
          </button>
        </div>
        
        <div className="form-items">
          {resumeData.achievements.map((achievement, index) => (
            <div key={achievement.id} className="form-item">
              <div className="item-header">
                <h4>Achievement #{index + 1}</h4>
                <button 
                  className="btn btn-danger"
                  onClick={() => removeAchievement(achievement.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Achievement Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={achievement.title}
                    onChange={(e) => updateAchievement(achievement.id, 'title', e.target.value)}
                    placeholder="Innovation Award Winner"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="text"
                    className="form-input"
                    value={achievement.date}
                    onChange={(e) => updateAchievement(achievement.id, 'date', e.target.value)}
                    placeholder="2023"
                  />
                </div>
                
                <div className="form-group form-grid-full">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input form-textarea"
                    value={achievement.description}
                    onChange={(e) => updateAchievement(achievement.id, 'description', e.target.value)}
                    placeholder="Describe your achievement and its impact..."
                    rows="3"
                  />
                </div>
              </div>
            </div>
          ))}
          
          {resumeData.achievements.length === 0 && (
            <p className="empty-state">No achievements added yet. Click "Add Achievement" to get started.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeForm;
