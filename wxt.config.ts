import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: ["storage", "tabs", "clipboardWrite"],
    host_permissions: ["<all_urls>"],
    commands: {
      "copy-markdown-link": {
        suggested_key: {
          default: "Ctrl+Shift+L",
        },
        description: "Copy current page as Markdown link",
      },
      "send-to-drafts": {
        suggested_key: {
          default: "Ctrl+Shift+D",
        },
        description: "Send current page to Drafts",
      },
    },
    chrome_url_overrides: {
      newtab: "newtab/index.html",
    },
  },
});
