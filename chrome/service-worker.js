// Open command palette when shortcut is pressed
chrome.commands.onCommand.addListener((command) => {
  if (command === "open-command-palette") {
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "toggle-palette" });
      }
    });
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "get-cookie") {
    chrome.cookies.get({
      url: message.url,
      name: message.name,
    }).then((cookie) => {
      if (cookie) {
        sendResponse({ value: cookie.value });
      } else {
        sendResponse({ error: `Cookie "${message.name}" not found` });
      }
    });
    return true; // keep message channel open for async sendResponse
  }

  if (message.action === "set-cookies") {
    const { url, cookies } = message;
    const promises = Object.entries(cookies).map(([name, value]) =>
      chrome.cookies.set({ url, name, value, path: "/" })
    );
    Promise.all(promises).then(() => sendResponse({ ok: true }));
    return true; // keep message channel open for async sendResponse
  }
});
