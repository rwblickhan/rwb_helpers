export default defineBackground(() => {
  browser.commands.onCommand.addListener(async (command) => {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (command === "copy-markdown-link") {
      try {
        if (tab && tab.id && tab.title && tab.url) {
          const markdownLink = `[${tab.title}](${tab.url})`;
          await browser.tabs.sendMessage(tab.id, {
            action: "copyToClipboard",
            text: markdownLink,
          });
          console.log("Copied markdown link:", markdownLink);
        }
      } catch (error) {
        console.error("Failed to copy markdown link:", error);
      }
    }

    if (command === "send-to-drafts") {
      try {
        if (tab && tab.title && tab.url) {
          const text = `${tab.title}\n${tab.url}`;
          const draftsUrl = `drafts://x-callback-url/create?text=${encodeURIComponent(
            text
          )}`;
          await browser.tabs.create({ url: draftsUrl });
          if (tab.id) await browser.tabs.remove(tab.id);
          console.log("Sent to Drafts and closed tab:", tab.title);
        }
      } catch (error) {
        console.error("Failed to send to Drafts:", error);
      }
    }
  });
});
