interface HotkeySettings {
  copyMarkdownLink: string;
}

const DEFAULT_SETTINGS: HotkeySettings = {
  copyMarkdownLink: 'cmd+shift+l'
};

function parseHotkey(hotkey: string) {
  const parts = hotkey.toLowerCase().split('+');
  return {
    metaKey: parts.includes('cmd') || parts.includes('meta'),
    ctrlKey: parts.includes('ctrl'),
    altKey: parts.includes('alt'),
    shiftKey: parts.includes('shift'),
    key: parts.find(part => !['cmd', 'meta', 'ctrl', 'alt', 'shift'].includes(part)) || ''
  };
}

function showNotification(message: string) {
  const notification = document.createElement("div");
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: hsl(208 100% 45%);
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    z-index: 10000;
    font-family: Charter, "Bitstream Charter", "Sitka Text", Cambria, serif;
    font-size: 17px;
  `;
  notification.addEventListener("click", () => {
    notification.remove();
  });
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

function copyMarkdownLink() {
  const title = document.title;
  const url = window.location.href;
  const markdownLink = `[${title}](${url})`;

  navigator.clipboard
    .writeText(markdownLink)
    .then(() => {
      console.log("Copied to clipboard:", markdownLink);
      showNotification("Copied link to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy to clipboard:", err);
    });
}

export default defineContentScript({
  matches: ["<all_urls>"],
  async main() {
    console.log("rwb_helpers loaded on:", window.location.href);

    let settings = DEFAULT_SETTINGS;
    let copyLinkHotkey = parseHotkey(settings.copyMarkdownLink);
    
    try {
      const result = await browser.storage.sync.get('hotkeySettings');
      if (result.hotkeySettings) {
        settings = { ...DEFAULT_SETTINGS, ...result.hotkeySettings };
        copyLinkHotkey = parseHotkey(settings.copyMarkdownLink);
      }
    } catch (error) {
      console.error('Failed to load hotkey settings:', error);
    }

    document.addEventListener("keydown", (event) => {
      if (event.metaKey === copyLinkHotkey.metaKey &&
          event.ctrlKey === copyLinkHotkey.ctrlKey &&
          event.altKey === copyLinkHotkey.altKey &&
          event.shiftKey === copyLinkHotkey.shiftKey &&
          event.key.toLowerCase() === copyLinkHotkey.key) {
        event.preventDefault();
        copyMarkdownLink();
      }
    });

    browser.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'sync' && changes.hotkeySettings) {
        settings = { ...DEFAULT_SETTINGS, ...changes.hotkeySettings.newValue };
        copyLinkHotkey = parseHotkey(settings.copyMarkdownLink);
      }
    });
  },
});
