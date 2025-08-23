interface HotkeySettings {
  copyMarkdownLink: string;
}

const DEFAULT_SETTINGS: HotkeySettings = {
  copyMarkdownLink: "cmd+shift+l",
};

function parseHotkey(hotkey: string) {
  const parts = hotkey.toLowerCase().split("+");
  return {
    metaKey: parts.includes("cmd") || parts.includes("meta"),
    ctrlKey: parts.includes("ctrl"),
    altKey: parts.includes("alt"),
    shiftKey: parts.includes("shift"),
    key:
      parts.find(
        (part) => !["cmd", "meta", "ctrl", "alt", "shift"].includes(part)
      ) || "",
  };
}

function showNotification(message: string) {
  const container = document.createElement("div");

  container.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    border: none;
    margin: 0;
    padding: 0;
    background: transparent;
    pointer-events: none;
    overflow: visible;
  `;

  const shadow = container.attachShadow({ mode: "closed" });

  const notification = document.createElement("div");
  notification.textContent = message;

  const style = document.createElement("style");
  style.textContent = `
    div {
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
      width: fit-content;
      max-width: 300px;
      word-wrap: break-word;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      margin: 0;
      border: none;
      outline: none;
      line-height: 1.4;
      letter-spacing: normal;
      text-align: left;
      text-decoration: none;
      text-transform: none;
      white-space: normal;
      pointer-events: auto;
    }
  `;

  shadow.appendChild(style);
  shadow.appendChild(notification);

  notification.addEventListener("click", () => {
    container.remove();
  });

  document.body.appendChild(container);
  setTimeout(() => container.remove(), 3000);
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
      const result = await browser.storage.sync.get("hotkeySettings");
      if (result.hotkeySettings) {
        settings = { ...DEFAULT_SETTINGS, ...result.hotkeySettings };
        copyLinkHotkey = parseHotkey(settings.copyMarkdownLink);
      }
    } catch (error) {
      console.error("Failed to load hotkey settings:", error);
    }

    document.addEventListener("keydown", (event) => {
      if (
        event.metaKey === copyLinkHotkey.metaKey &&
        event.ctrlKey === copyLinkHotkey.ctrlKey &&
        event.altKey === copyLinkHotkey.altKey &&
        event.shiftKey === copyLinkHotkey.shiftKey &&
        event.key.toLowerCase() === copyLinkHotkey.key
      ) {
        event.preventDefault();
        copyMarkdownLink();
      }
    });

    browser.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === "sync" && changes.hotkeySettings) {
        settings = { ...DEFAULT_SETTINGS, ...changes.hotkeySettings.newValue };
        copyLinkHotkey = parseHotkey(settings.copyMarkdownLink);
      }
    });
  },
});
