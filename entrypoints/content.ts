
function showNotification(message: string) {
  const container = document.createElement("div");

  container.style.cssText = `
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 0 !important;
    height: 0 !important;
    border: none !important;
    margin: 0 !important;
    padding: 0 !important;
    background: transparent !important;
    pointer-events: none !important;
    overflow: visible !important;
    z-index: 2147483647 !important;
    transform: none !important;
    opacity: 1 !important;
    visibility: visible !important;
    display: block !important;
  `;

  const shadow = container.attachShadow({ mode: "closed" });

  const notification = document.createElement("div");
  notification.textContent = message;

  const style = document.createElement("style");
  style.textContent = `
    div {
      position: fixed !important;
      top: 20px !important;
      right: 20px !important;
      background: hsl(208 100% 45%) !important;
      color: white !important;
      padding: 10px 20px !important;
      border-radius: 4px !important;
      z-index: 2147483647 !important;
      font-family: Charter, "Bitstream Charter", "Sitka Text", Cambria, serif !important;
      font-size: 17px !important;
      width: fit-content !important;
      max-width: 300px !important;
      word-wrap: break-word !important;
      cursor: pointer !important;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2) !important;
      margin: 0 !important;
      border: none !important;
      outline: none !important;
      line-height: 1.4 !important;
      letter-spacing: normal !important;
      text-align: left !important;
      text-decoration: none !important;
      text-transform: none !important;
      white-space: normal !important;
      pointer-events: auto !important;
      transform: none !important;
      opacity: 1 !important;
      visibility: visible !important;
      display: block !important;
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
