
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

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Copied to clipboard:", text);
    showNotification("Copied link to clipboard!");
    return true;
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    return false;
  }
}

export default defineContentScript({
  matches: ["<all_urls>"],
  async main() {
    console.log("rwb_helpers loaded on:", window.location.href);

    // Listen for messages from the background script
    browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
      if (message.action === "copyToClipboard") {
        const success = await copyToClipboard(message.text);
        sendResponse({ success });
      }
    });
  },
});
