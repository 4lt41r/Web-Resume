import React, { forwardRef } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github, 
  Globe,
  GraduationCap,
  Briefcase,
  Award,
  Trophy,
  Calendar
} from 'lucide-react';

const ResumeTemplate = forwardRef(({ resumeData, theme }, ref) => {
  const { personalInfo, summary, education, experience, skills, certifications, achievements } = resumeData;

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div ref={ref} className={`resume-template ${theme}-theme`}>
      {/* Header Section */}
      <header className="resume-section resume-header">
        <div className="header-content">
          <h1 className="full-name">{personalInfo.fullName || 'Your Name'}</h1>
          
          <div className="contact-info">
            {personalInfo.email && (
              <div className="contact-item">
                <Mail size={16} />
                <span>{personalInfo.email}</span>
              </div>
            )}
            
            {personalInfo.phone && (
              <div className="contact-item">
                <Phone size={16} />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            
            {personalInfo.address && (
              <div className="contact-item">
                <MapPin size={16} />
                <span>{personalInfo.address}</span>
              </div>
            )}
            
            {personalInfo.linkedin && (
              <div className="contact-item">
                <Linkedin size={16} />
                <span>{personalInfo.linkedin}</span>
              </div>
            )}
            
            {personalInfo.github && (
              <div className="contact-item">
                <Github size={16} />
                <span>{personalInfo.github}</span>
              </div>
            )}
            
            {personalInfo.website && (
              <div className="contact-item">
                <Globe size={16} />
                <span>{personalInfo.website}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Professional Summary */}
      {summary && (
        <section className="resume-section resume-summary">
          <h2 className="section-title">Professional Summary</h2>
          <div className="section-content">
            <p className="summary-text">{summary}</p>
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="resume-section education-section">
          <h2 className="section-title">
            <GraduationCap size={20} />
            Education
          </h2>
          <div className="section-content">
            {education.map((edu) => (
              <div key={edu.id} className="education-item">
                <div className="item-header">
                  <h3 className="degree">{edu.degree}</h3>
                  <div className="date-range">
                    {edu.startDate && edu.endDate && (
                      <span className="dates">
                        <Calendar size={14} />
                        {edu.startDate} - {edu.endDate}
                      </span>
                    )}
                  </div>
                </div>
                <div className="institution">{edu.institution}</div>
                {edu.gpa && (
                  <div className="gpa">GPA: {edu.gpa}</div>
                )}
                {edu.coursework && (
                  <div className="coursework">
                    <strong>Relevant Coursework:</strong> {edu.coursework}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <section className="resume-section experience-section">
          <h2 className="section-title">
            <Briefcase size={20} />
            Professional Experience
          </h2>
          <div className="section-content">
            {experience.map((exp) => (
              <div key={exp.id} className="experience-item">
                <div className="item-header">
                  <div className="position-company">
                    <h3 className="position">{exp.position}</h3>
                    <div className="company">{exp.company}</div>
                  </div>
                  <div className="date-location">
                    {(exp.startDate || exp.endDate) && (
                      <div className="date-range">
                        <Calendar size={14} />
                        <span className="dates">
                          {exp.startDate} - {exp.endDate}
                        </span>
                      </div>
                    )}
                    {exp.location && (
                      <div className="location">
                        <MapPin size={14} />
                        <span>{exp.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className="responsibilities">
                    {exp.responsibilities
                      .filter(resp => resp.trim() !== '')
                      .map((responsibility, index) => (
                        <li key={index}>{responsibility}</li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="resume-section skills-section">
          <h2 className="section-title">
            <Award size={20} />
            Technical Skills
          </h2>
          <div className="section-content">
            <div className="skills-grid">
              {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <div key={category} className="skill-category">
                  <h4 className="category-title">{category}</h4>
                  <div className="skills-list">
                    {categorySkills.map((skill) => (
                      <span key={skill.id} className="skill-item">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="resume-section certifications-section">
          <h2 className="section-title">
            <Award size={20} />
            Certifications
          </h2>
          <div className="section-content">
            {certifications.map((cert) => (
              <div key={cert.id} className="certification-item">
                <div className="item-header">
                  <h3 className="cert-name">{cert.name}</h3>
                  {cert.date && (
                    <div className="cert-date">
                      <Calendar size={14} />
                      <span>{cert.date}</span>
                    </div>
                  )}
                </div>
                <div className="cert-issuer">{cert.issuer}</div>
                {cert.credentialId && (
                  <div className="credential-id">
                    <strong>Credential ID:</strong> {cert.credentialId}
                  </div>
                )}
                {cert.description && (
                  <div className="cert-description">{cert.description}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <section className="resume-section achievements-section">
          <h2 className="section-title">
            <Trophy size={20} />
            Achievements & Awards
          </h2>
          <div className="section-content">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="achievement-item">
                <div className="item-header">
                  <h3 className="achievement-title">{achievement.title}</h3>
                  {achievement.date && (
                    <div className="achievement-date">
                      <Calendar size={14} />
                      <span>{achievement.date}</span>
                    </div>
                  )}
                </div>
                {achievement.description && (
                  <div className="achievement-description">{achievement.description}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="resume-footer">
        <div className="footer-line"></div>
        <p className="footer-text">
          Generated with Resume Builder Pro • {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
});

ResumeTemplate.displayName = 'ResumeTemplate';

export default ResumeTemplate;
