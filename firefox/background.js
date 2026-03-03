// Open command palette when shortcut is pressed
browser.commands.onCommand.addListener((command) => {
  if (command === "open-command-palette") {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      if (tabs[0]) {
        browser.tabs.sendMessage(tabs[0].id, { action: "toggle-palette" });
      }
    });
  }
});

// Handle messages from content script
browser.runtime.onMessage.addListener((message) => {
  if (message.action === "get-cookie") {
    return browser.cookies.get({
      url: message.url,
      name: message.name,
    }).then((cookie) => {
      if (cookie) {
        return { value: cookie.value };
      }
      return { error: `Cookie "${message.name}" not found` };
    });
  }

  if (message.action === "set-cookies") {
    const { url, cookies } = message;
    const promises = Object.entries(cookies).map(([name, value]) =>
      browser.cookies.set({ url, name, value, path: "/" })
    );
    return Promise.all(promises).then(() => ({ ok: true }));
  }
});
