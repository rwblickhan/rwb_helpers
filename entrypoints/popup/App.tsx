export function App() {
  const openShortcutsPage = () => {
    // Cross-browser shortcuts page URLs
    const userAgent = navigator.userAgent.toLowerCase();
    let shortcutsUrl;
    
    if (userAgent.includes('firefox')) {
      // Firefox uses about:addons with a specific view
      shortcutsUrl = "about:addons";
    } else if (userAgent.includes('safari')) {
      // Safari doesn't have a direct shortcuts page, open preferences
      shortcutsUrl = "safari://preferences/extensions";
    } else {
      // Chrome/Chromium-based browsers
      shortcutsUrl = "chrome://extensions/shortcuts";
    }
    
    browser.tabs.create({ url: shortcutsUrl });
  };

  return (
    <div className="popup-app">
      <header className="popup-header">
        <h1>rwb helpers</h1>
      </header>

      <main className="popup-main">
        <div className="setting-item">
          <div className="setting-info">
            <span className="setting-name">Copy Markdown Link</span>
            <span className="setting-description">
              Use keyboard shortcut: Cmd+Shift+L (Mac) / Ctrl+Shift+L (Windows/Linux)
            </span>
          </div>
          <div className="setting-controls">
            <button 
              className="action-button" 
              onClick={openShortcutsPage}
              title="Configure keyboard shortcuts"
            >
              Configure Shortcuts
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
