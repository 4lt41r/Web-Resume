import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Download, 
  Save, 
  FileText, 
  Palette, 
  Settings,
  Plus,
  Trash2,
  Eye,
  Copy,
  RefreshCw
} from 'lucide-react';

const AdminPanel = ({ onClose, showNotification, currentTheme }) => {
  const [activeTab, setActiveTab] = useState('templates');
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Professional',
      value: 'professional',
      description: 'Clean and modern professional template',
      isActive: true
    },
    {
      id: 2,
      name: 'Dark Mode',
      value: 'dark',
      description: 'Dark theme for modern appeal',
      isActive: true
    },
    {
      id: 3,
      name: 'Amazon Style',
      value: 'amazon',
      description: 'Amazon-inspired orange theme',
      isActive: true
    },
    {
      id: 4,
      name: 'Netflix Style',
      value: 'netflix',
      description: 'Netflix-inspired red theme',
      isActive: true
    },
    {
      id: 5,
      name: 'Google Style',
      value: 'google',
      description: 'Google-inspired colorful theme',
      isActive: true
    }
  ]);

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    value: '',
    description: '',
    cssContent: ''
  });

  const [systemSettings, setSystemSettings] = useState({
    maxFileSize: '5MB',
    allowedFormats: ['PDF', 'DOCX'],
    defaultTheme: 'professional',
    enableAnalytics: true,
    maintenanceMode: false,
    autoSave: true,
    version: '2.1.0'
  });

  const fileInputRef = useRef(null);

  // Template Management
  const handleAddTemplate = () => {
    if (!newTemplate.name || !newTemplate.value) {
      showNotification('Please fill in template name and value', 'error');
      return;
    }

    const template = {
      id: Date.now(),
      ...newTemplate,
      isActive: true
    };

    setTemplates(prev => [...prev, template]);
    setNewTemplate({ name: '', value: '', description: '', cssContent: '' });
    showNotification('Template added successfully!', 'success');
  };

  const handleDeleteTemplate = (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      setTemplates(prev => prev.filter(t => t.id !== id));
      showNotification('Template deleted successfully!', 'info');
    }
  };

  const handleToggleTemplate = (id) => {
    setTemplates(prev => prev.map(t => 
      t.id === id ? { ...t, isActive: !t.isActive } : t
    ));
    showNotification('Template status updated!', 'success');
  };

  const handleExportTemplate = (template) => {
    const dataStr = JSON.stringify(template, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${template.value}-template.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Template exported successfully!', 'success');
  };

  const handleImportTemplate = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const templateData = JSON.parse(e.target.result);
        const importedTemplate = {
          ...templateData,
          id: Date.now(),
          isActive: true
        };
        
        setTemplates(prev => [...prev, importedTemplate]);
        showNotification('Template imported successfully!', 'success');
      } catch (error) {
        console.error('Template import error:', error);
        showNotification('Invalid template file format', 'error');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // System Settings
  const handleSettingChange = (key, value) => {
    setSystemSettings(prev => ({
      ...prev,
      [key]: value
    }));
    showNotification('Setting updated!', 'success');
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(systemSettings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'resume-builder-settings.json');
    linkElement.click();
    
    showNotification('Settings exported successfully!', 'success');
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      setSystemSettings({
        maxFileSize: '5MB',
        allowedFormats: ['PDF', 'DOCX'],
        defaultTheme: 'professional',
        enableAnalytics: true,
        maintenanceMode: false,
        autoSave: true,
        version: '2.1.0'
      });
      showNotification('Settings reset to default!', 'info');
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div className="admin-title">
          <Settings size={24} />
          <h2>Admin Panel</h2>
        </div>
        <button className="admin-close" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          <Palette size={16} />
          Templates
        </button>
        <button 
          className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings size={16} />
          Settings
        </button>
        <button 
          className={`admin-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <FileText size={16} />
          Analytics
        </button>
      </div>

      <div className="admin-content">
        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="templates-section">
            <div className="section-header">
              <h3>Template Management</h3>
              <div className="header-actions">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImportTemplate}
                  accept=".json"
                  style={{ display: 'none' }}
                />
                <button 
                  className="btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={16} />
                  Import
                </button>
              </div>
            </div>

            {/* Add New Template */}
            <div className="add-template-form">
              <h4>Add New Template</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label>Template Name</label>
                  <input
                    type="text"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Modern Template"
                  />
                </div>
                <div className="form-group">
                  <label>Template Value</label>
                  <input
                    type="text"
                    value={newTemplate.value}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="modern-template"
                  />
                </div>
                <div className="form-group form-grid-full">
                  <label>Description</label>
                  <input
                    type="text"
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="A modern and sleek template design"
                  />
                </div>
                <div className="form-group form-grid-full">
                  <label>CSS Content</label>
                  <textarea
                    value={newTemplate.cssContent}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, cssContent: e.target.value }))}
                    placeholder="/* Custom CSS for template */"
                    rows="6"
                  />
                </div>
              </div>
              <button className="btn" onClick={handleAddTemplate}>
                <Plus size={16} />
                Add Template
              </button>
            </div>

            {/* Templates List */}
            <div className="templates-list">
              <h4>Existing Templates ({templates.length})</h4>
              {templates.map((template) => (
                <div key={template.id} className="template-item">
                  <div className="template-info">
                    <div className="template-header">
                      <h5>{template.name}</h5>
                      <div className="template-badges">
                        <span className={`status-badge ${template.isActive ? 'active' : 'inactive'}`}>
                          {template.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {template.value === currentTheme && (
                          <span className="status-badge current">Current</span>
                        )}
                      </div>
                    </div>
                    <p className="template-description">{template.description}</p>
                    <div className="template-meta">
                      <span className="template-value">Value: {template.value}</span>
                    </div>
                  </div>
                  <div className="template-actions">
                    <button 
                      className="btn btn-icon"
                      onClick={() => handleToggleTemplate(template.id)}
                      title={template.isActive ? 'Deactivate' : 'Activate'}
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className="btn btn-icon"
                      onClick={() => handleExportTemplate(template)}
                      title="Export Template"
                    >
                      <Download size={16} />
                    </button>
                    <button 
                      className="btn btn-icon"
                      onClick={() => navigator.clipboard.writeText(JSON.stringify(template, null, 2))}
                      title="Copy to Clipboard"
                    >
                      <Copy size={16} />
                    </button>
                    <button 
                      className="btn btn-icon btn-danger"
                      onClick={() => handleDeleteTemplate(template.id)}
                      title="Delete Template"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="settings-section">
            <div className="section-header">
              <h3>System Settings</h3>
              <div className="header-actions">
                <button className="btn" onClick={handleExportSettings}>
                  <Download size={16} />
                  Export
                </button>
                <button className="btn btn-danger" onClick={handleResetSettings}>
                  <RefreshCw size={16} />
                  Reset
                </button>
              </div>
            </div>

            <div className="settings-grid">
              <div className="setting-item">
                <label>Maximum File Size</label>
                <select
                  value={systemSettings.maxFileSize}
                  onChange={(e) => handleSettingChange('maxFileSize', e.target.value)}
                >
                  <option value="2MB">2MB</option>
                  <option value="5MB">5MB</option>
                  <option value="10MB">10MB</option>
                  <option value="20MB">20MB</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Default Theme</label>
                <select
                  value={systemSettings.defaultTheme}
                  onChange={(e) => handleSettingChange('defaultTheme', e.target.value)}
                >
                  {templates.filter(t => t.isActive).map(template => (
                    <option key={template.id} value={template.value}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="setting-item">
                <label>Enable Analytics</label>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={systemSettings.enableAnalytics}
                    onChange={(e) => handleSettingChange('enableAnalytics', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <label>Maintenance Mode</label>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={systemSettings.maintenanceMode}
                    onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <label>Auto Save</label>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={systemSettings.autoSave}
                    onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <label>Application Version</label>
                <input
                  type="text"
                  value={systemSettings.version}
                  onChange={(e) => handleSettingChange('version', e.target.value)}
                  placeholder="2.1.0"
                />
              </div>
            </div>

            <div className="settings-info">
              <h4>Current Configuration</h4>
              <pre className="settings-json">
                {JSON.stringify(systemSettings, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <div className="section-header">
              <h3>Usage Analytics</h3>
            </div>

            <div className="analytics-grid">
              <div className="analytics-card">
                <div className="card-header">
                  <h4>Template Usage</h4>
                  <FileText size={20} />
                </div>
                <div className="card-content">
                  <div className="analytics-chart">
                    {templates.map((template, index) => (
                      <div key={template.id} className="chart-bar">
                        <div className="bar-label">{template.name}</div>
                        <div className="bar-container">
                          <div 
                            className="bar-fill"
                            style={{ 
                              width: `${Math.random() * 80 + 20}%`,
                              backgroundColor: `hsl(${index * 72}, 70%, 50%)`
                            }}
                          ></div>
                        </div>
                        <div className="bar-value">{Math.floor(Math.random() * 100)}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="analytics-card">
                <div className="card-header">
                  <h4>System Status</h4>
                  <Settings size={20} />
                </div>
                <div className="card-content">
                  <div className="status-grid">
                    <div className="status-item">
                      <span className="status-label">Active Templates</span>
                      <span className="status-value">{templates.filter(t => t.isActive).length}</span>
                    </div>
                    <div className="status-item">
                      <span className="status-label">Total Templates</span>
                      <span className="status-value">{templates.length}</span>
                    </div>
                    <div className="status-item">
                      <span className="status-label">Current Theme</span>
                      <span className="status-value">{currentTheme}</span>
                    </div>
                    <div className="status-item">
                      <span className="status-label">App Version</span>
                      <span className="status-value">{systemSettings.version}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="analytics-card full-width">
                <div className="card-header">
                  <h4>Recent Activity</h4>
                  <RefreshCw size={20} />
                </div>
                <div className="card-content">
                  <div className="activity-list">
                    <div className="activity-item">
                      <div className="activity-time">2 minutes ago</div>
                      <div className="activity-description">Template "Professional" was used to generate PDF</div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-time">5 minutes ago</div>
                      <div className="activity-description">New template "Modern" was added to the system</div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-time">10 minutes ago</div>
                      <div className="activity-description">System settings were updated</div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-time">15 minutes ago</div>
                      <div className="activity-description">Template "Dark Mode" was activated</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
