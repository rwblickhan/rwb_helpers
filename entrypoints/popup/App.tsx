import { useState, useEffect } from "preact/hooks";
import { HotkeyInput } from "./HotkeyInput";

interface Settings {
  copyMarkdownLink: string;
}

const DEFAULT_SETTINGS: Settings = {
  copyMarkdownLink: "cmd+shift+l",
};

export function App() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const result = await browser.storage.sync.get("hotkeySettings");
      if (result.hotkeySettings) {
        setSettings({ ...DEFAULT_SETTINGS, ...result.hotkeySettings });
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
    setIsLoading(false);
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      await browser.storage.sync.set({ hotkeySettings: newSettings });
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1500);
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  const updateHotkey = (feature: keyof Settings, hotkey: string) => {
    const newSettings = { ...settings, [feature]: hotkey };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

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
              Copy current page as Markdown link
            </span>
          </div>
          <HotkeyInput
            value={settings.copyMarkdownLink}
            onChange={(hotkey) => updateHotkey("copyMarkdownLink", hotkey)}
          />
        </div>

        {justSaved && <div className="save-feedback">Saved!</div>}
      </main>
    </div>
  );
}
