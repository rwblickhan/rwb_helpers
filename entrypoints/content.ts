export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    console.log("rwb_helpers loaded on:", window.location.href);

    document.addEventListener("keydown", (event) => {
      if (event.metaKey && event.shiftKey && event.key === "l") {
        event.preventDefault();

        const title = document.title;
        const url = window.location.href;
        const markdownLink = `[${title}](${url})`;

        navigator.clipboard
          .writeText(markdownLink)
          .then(() => {
            console.log("Copied to clipboard:", markdownLink);
            const notification = document.createElement("div");
            notification.textContent = "Copied link to clipboard!";
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
          })
          .catch((err) => {
            console.error("Failed to copy to clipboard:", err);
          });
      }
    });
  },
});
