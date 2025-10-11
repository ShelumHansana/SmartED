import React, { useState } from 'react';
import '../styles/AdminSettings.css';

const AdminSettings = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'SmartED LMS',
    siteDescription: 'Advanced Learning Management System',
    timezone: 'UTC-5',
    dateFormat: 'MM/DD/YYYY',
    language: 'English',
    
    // Email Settings
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: 'admin@smarted.com',
    smtpPassword: '',
    emailFromName: 'SmartED System',
    emailSignature: 'Best regards,\nSmartED Team',
    
    // Security Settings
    sessionTimeout: '30',
    maxLoginAttempts: '3',
    passwordMinLength: '8',
    requireSpecialChars: true,
    enableTwoFactor: false,
    ipWhitelist: '',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    notifyOnNewUser: true,
    notifyOnGradeUpdate: true,
    notifyOnSystemUpdate: false,
    
    // System Settings
    maintenanceMode: false,
    debugMode: false,
    cacheEnabled: true,
    compressionEnabled: true,
    backupFrequency: 'daily',
    logLevel: 'info',
    
    // Integration Settings
    googleClassroomEnabled: false,
    zoomIntegration: false,
    slackIntegration: false,
    microsoftTeamsEnabled: false,
  });

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const handleInputChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setUnsavedChanges(true);
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // In a real application, this would make an API call
    setUnsavedChanges(false);
    alert('Settings saved successfully!');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      // Reset to default values
      console.log('Resetting settings to defaults');
      setUnsavedChanges(false);
      alert('Settings reset to defaults!');
    }
  };

  const testEmailSettings = () => {
    console.log('Testing email configuration...');
    alert('Test email sent! Check your inbox.');
  };

  const generateBackup = () => {
    console.log('Generating system backup...');
    alert('Backup generation started. You will receive a notification when complete.');
  };

  const clearCache = () => {
    console.log('Clearing system cache...');
    alert('System cache cleared successfully!');
  };

  const sections = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'email', name: 'Email', icon: '✉️' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'system', name: 'System', icon: '💻' },
    { id: 'integrations', name: 'Integrations', icon: '🔗' },
    { id: 'backup', name: 'Backup & Maintenance', icon: '🛠️' },
  ];

  return (
    <div className="admin-settings">
      <div className="settings-header">
        <h2>System Settings</h2>
        <div className="header-actions">
          {unsavedChanges && (
            <span className="unsaved-indicator">● Unsaved changes</span>
          )}
          <button className="reset-btn" onClick={handleReset}>
            Reset to Defaults
          </button>
          <button 
            className={`save-btn ${unsavedChanges ? 'has-changes' : ''}`} 
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="settings-content">
        <div className="settings-sidebar">
          <nav className="settings-nav">
            {sections.map(section => (
              <button
                key={section.id}
                className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="nav-icon">{section.icon}</span>
                <span className="nav-text">{section.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="settings-main">
          {activeSection === 'general' && (
            <div className="settings-section">
              <h3>General Settings</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <label>Site Name</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => handleInputChange('siteName', e.target.value)}
                  />
                </div>
                <div className="setting-item">
                  <label>Site Description</label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                    rows="3"
                  />
                </div>
                <div className="setting-item">
                  <label>Timezone</label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                  >
                    <option value="UTC-12">UTC-12 (Baker Island)</option>
                    <option value="UTC-8">UTC-8 (Pacific Time)</option>
                    <option value="UTC-5">UTC-5 (Eastern Time)</option>
                    <option value="UTC+0">UTC+0 (Greenwich Mean Time)</option>
                    <option value="UTC+5:30">UTC+5:30 (India Standard Time)</option>
                    <option value="UTC+8">UTC+8 (China Standard Time)</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>Date Format</label>
                  <select
                    value={settings.dateFormat}
                    onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    <option value="DD-MMM-YYYY">DD-MMM-YYYY</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>Language</label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Español</option>
                    <option value="French">Français</option>
                    <option value="German">Deutsch</option>
                    <option value="Chinese">中文</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'email' && (
            <div className="settings-section">
              <h3>Email Configuration</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <label>SMTP Host</label>
                  <input
                    type="text"
                    value={settings.smtpHost}
                    onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                  />
                </div>
                <div className="setting-item">
                  <label>SMTP Port</label>
                  <input
                    type="number"
                    value={settings.smtpPort}
                    onChange={(e) => handleInputChange('smtpPort', e.target.value)}
                  />
                </div>
                <div className="setting-item">
                  <label>SMTP Username</label>
                  <input
                    type="email"
                    value={settings.smtpUsername}
                    onChange={(e) => handleInputChange('smtpUsername', e.target.value)}
                  />
                </div>
                <div className="setting-item">
                  <label>SMTP Password</label>
                  <input
                    type="password"
                    value={settings.smtpPassword}
                    onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
                    placeholder="Enter password"
                  />
                </div>
                <div className="setting-item">
                  <label>From Name</label>
                  <input
                    type="text"
                    value={settings.emailFromName}
                    onChange={(e) => handleInputChange('emailFromName', e.target.value)}
                  />
                </div>
                <div className="setting-item full-width">
                  <label>Email Signature</label>
                  <textarea
                    value={settings.emailSignature}
                    onChange={(e) => handleInputChange('emailSignature', e.target.value)}
                    rows="4"
                  />
                </div>
              </div>
              <div className="section-actions">
                <button className="test-btn" onClick={testEmailSettings}>
                  Test Email Configuration
                </button>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="settings-section">
              <h3>Security Settings</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <label>Session Timeout (minutes)</label>
                  <input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleInputChange('sessionTimeout', e.target.value)}
                    min="5"
                    max="480"
                  />
                </div>
                <div className="setting-item">
                  <label>Max Login Attempts</label>
                  <input
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => handleInputChange('maxLoginAttempts', e.target.value)}
                    min="1"
                    max="10"
                  />
                </div>
                <div className="setting-item">
                  <label>Password Min Length</label>
                  <input
                    type="number"
                    value={settings.passwordMinLength}
                    onChange={(e) => handleInputChange('passwordMinLength', e.target.value)}
                    min="6"
                    max="20"
                  />
                </div>
                <div className="setting-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.requireSpecialChars}
                      onChange={(e) => handleInputChange('requireSpecialChars', e.target.checked)}
                    />
                    Require Special Characters
                  </label>
                </div>
                <div className="setting-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.enableTwoFactor}
                      onChange={(e) => handleInputChange('enableTwoFactor', e.target.checked)}
                    />
                    Enable Two-Factor Authentication
                  </label>
                </div>
                <div className="setting-item full-width">
                  <label>IP Whitelist (comma-separated)</label>
                  <textarea
                    value={settings.ipWhitelist}
                    onChange={(e) => handleInputChange('ipWhitelist', e.target.value)}
                    placeholder="192.168.1.1, 10.0.0.1, ..."
                    rows="3"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="settings-section">
              <h3>Notification Preferences</h3>
              <div className="settings-grid">
                <div className="setting-group">
                  <h4>Notification Methods</h4>
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                      />
                      Email Notifications
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={settings.smsNotifications}
                        onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
                      />
                      SMS Notifications
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications}
                        onChange={(e) => handleInputChange('pushNotifications', e.target.checked)}
                      />
                      Push Notifications
                    </label>
                  </div>
                </div>
                
                <div className="setting-group">
                  <h4>Event Notifications</h4>
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={settings.notifyOnNewUser}
                        onChange={(e) => handleInputChange('notifyOnNewUser', e.target.checked)}
                      />
                      New User Registration
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={settings.notifyOnGradeUpdate}
                        onChange={(e) => handleInputChange('notifyOnGradeUpdate', e.target.checked)}
                      />
                      Grade Updates
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={settings.notifyOnSystemUpdate}
                        onChange={(e) => handleInputChange('notifyOnSystemUpdate', e.target.checked)}
                      />
                      System Updates
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'system' && (
            <div className="settings-section">
              <h3>System Configuration</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                    />
                    Maintenance Mode
                  </label>
                  <span className="setting-help">Prevents users from accessing the system</span>
                </div>
                <div className="setting-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.debugMode}
                      onChange={(e) => handleInputChange('debugMode', e.target.checked)}
                    />
                    Debug Mode
                  </label>
                  <span className="setting-help">Shows detailed error messages</span>
                </div>
                <div className="setting-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.cacheEnabled}
                      onChange={(e) => handleInputChange('cacheEnabled', e.target.checked)}
                    />
                    Enable Caching
                  </label>
                </div>
                <div className="setting-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={settings.compressionEnabled}
                      onChange={(e) => handleInputChange('compressionEnabled', e.target.checked)}
                    />
                    Enable Compression
                  </label>
                </div>
                <div className="setting-item">
                  <label>Log Level</label>
                  <select
                    value={settings.logLevel}
                    onChange={(e) => handleInputChange('logLevel', e.target.value)}
                  >
                    <option value="error">Error</option>
                    <option value="warn">Warning</option>
                    <option value="info">Info</option>
                    <option value="debug">Debug</option>
                  </select>
                </div>
              </div>
              <div className="section-actions">
                <button className="action-btn" onClick={clearCache}>
                  Clear System Cache
                </button>
              </div>
            </div>
          )}

          {activeSection === 'integrations' && (
            <div className="settings-section">
              <h3>Third-Party Integrations</h3>
              <div className="integration-cards">
                <div className="integration-card">
                  <div className="integration-info">
                    <h4>Google Classroom</h4>
                    <p>Sync courses and assignments with Google Classroom</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.googleClassroomEnabled}
                      onChange={(e) => handleInputChange('googleClassroomEnabled', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="integration-card">
                  <div className="integration-info">
                    <h4>Zoom Integration</h4>
                    <p>Enable virtual classroom meetings with Zoom</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.zoomIntegration}
                      onChange={(e) => handleInputChange('zoomIntegration', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="integration-card">
                  <div className="integration-info">
                    <h4>Slack Integration</h4>
                    <p>Send notifications and updates to Slack channels</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.slackIntegration}
                      onChange={(e) => handleInputChange('slackIntegration', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="integration-card">
                  <div className="integration-info">
                    <h4>Microsoft Teams</h4>
                    <p>Collaborate and communicate via Microsoft Teams</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.microsoftTeamsEnabled}
                      onChange={(e) => handleInputChange('microsoftTeamsEnabled', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'backup' && (
            <div className="settings-section">
              <h3>Backup & Maintenance</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <label>Backup Frequency</label>
                  <select
                    value={settings.backupFrequency}
                    onChange={(e) => handleInputChange('backupFrequency', e.target.value)}
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
              
              <div className="backup-actions">
                <h4>Manual Actions</h4>
                <div className="action-buttons">
                  <button className="action-btn primary" onClick={generateBackup}>
                    Generate Backup Now
                  </button>
                  <button className="action-btn" onClick={clearCache}>
                    Clear All Cache
                  </button>
                  <button className="action-btn warning">
                    Run System Diagnostics
                  </button>
                  <button className="action-btn danger">
                    Reset System Logs
                  </button>
                </div>
              </div>

              <div className="backup-status">
                <h4>Backup Status</h4>
                <div className="status-item">
                  <span className="status-label">Last Backup:</span>
                  <span className="status-value">Yesterday, 2:00 AM</span>
                  <span className="status-indicator success">✓</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Backup Size:</span>
                  <span className="status-value">2.3 GB</span>
                </div>
                <div className="status-item">
                  <span className="status-label">Next Backup:</span>
                  <span className="status-value">Today, 2:00 AM</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
