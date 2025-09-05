export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });

  // Handle keyboard shortcuts
  browser.commands.onCommand.addListener(async (command) => {
    if (command === "copy-markdown-link") {
      try {
        // Get the active tab
        const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.title && tab.url) {
          const markdownLink = `[${tab.title}](${tab.url})`;
          
          // Copy to clipboard using the Clipboard API via content script
          await browser.tabs.sendMessage(tab.id!, {
            action: "copyToClipboard",
            text: markdownLink
          });
          
          console.log("Copied markdown link:", markdownLink);
        }
      } catch (error) {
        console.error("Failed to copy markdown link:", error);
      }
    }
  });
});
