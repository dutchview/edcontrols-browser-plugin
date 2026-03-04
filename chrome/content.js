(() => {
  // ---------------------------------------------------------------------------
  // Inline CSS (injected into shadow DOM for reliable isolation)
  // ---------------------------------------------------------------------------
  const CSS_TEXT = `
:host { all: initial; }

.ec-overlay {
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 20vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  animation: ec-fade-in 0.15s ease-out;
}
.ec-overlay.ec-closing { animation: ec-fade-out 0.1s ease-in forwards; }
@keyframes ec-fade-in { from { opacity: 0 } to { opacity: 1 } }
@keyframes ec-fade-out { from { opacity: 1 } to { opacity: 0 } }

.ec-modal {
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 12px;
  width: 560px;
  max-width: 90vw;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  animation: ec-slide-up 0.15s ease-out;
}
.ec-overlay.ec-closing .ec-modal { animation: ec-slide-down 0.1s ease-in forwards; }
@keyframes ec-slide-up {
  from { opacity: 0; transform: translateY(-12px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes ec-slide-down {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to   { opacity: 0; transform: translateY(-8px) scale(0.98); }
}

.ec-input-wrap {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #333;
  gap: 10px;
}
.ec-input-wrap .ec-icon { color: #888; flex-shrink: 0; }
.ec-input-wrap .ec-back-btn {
  background: none;
  border: 1px solid #444;
  border-radius: 6px;
  color: #aaa;
  cursor: pointer;
  padding: 2px 8px;
  font-size: 12px;
  flex-shrink: 0;
}
.ec-input-wrap .ec-back-btn:hover { background: #333; color: #fff; }

.ec-search {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #e0e0e0;
  font-size: 15px;
  caret-color: #64B5F6;
}
.ec-search::placeholder { color: #666; }

.ec-list {
  max-height: 400px;
  overflow-y: auto;
  padding: 6px;
}
.ec-list::-webkit-scrollbar { width: 6px; }
.ec-list::-webkit-scrollbar-thumb { background: #444; border-radius: 3px; }

/* Command items */
.ec-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  color: #ccc;
  font-size: 14px;
  transition: background 0.08s;
}
.ec-item:hover, .ec-item.ec-active { background: #2a2d31; color: #fff; }
.ec-item .ec-item-icon { font-size: 18px; width: 24px; text-align: center; flex-shrink: 0; }
.ec-item .ec-item-label { flex: 1; }
.ec-item .ec-item-hint { font-size: 12px; color: #666; }

/* User cards */
.ec-card {
  display: block;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  color: #ccc;
  transition: background 0.08s;
}
.ec-card:hover, .ec-card.ec-active { background: #2a2d31; color: #fff; }
.ec-card + .ec-card { border-top: 1px solid #2a2a2a; }

.ec-card-main {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.ec-card-email { font-size: 14px; font-weight: 500; color: #e0e0e0; }
.ec-card:hover .ec-card-email, .ec-card.ec-active .ec-card-email { color: #fff; }
.ec-card-name { font-size: 12px; color: #888; }

.ec-card-details {
  display: flex;
  flex-wrap: wrap;
  gap: 2px 14px;
  margin-top: 3px;
  padding-left: 1px;
}
.ec-card-detail { font-size: 12px; color: #555; }
.ec-card:hover .ec-card-detail, .ec-card.ec-active .ec-card-detail { color: #888; }

.ec-tag {
  display: inline-block;
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 500;
  flex-shrink: 0;
  margin-left: auto;
  line-height: 16px;
}
.ec-tag-ok { background: rgba(76, 175, 80, 0.15); color: #66BB6A; }
.ec-tag-warn { background: rgba(255, 152, 0, 0.15); color: #FFA726; }

.ec-empty { padding: 24px; text-align: center; color: #666; font-size: 14px; }

/* JSON Viewer */
.ec-json-overlay {
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  background: #1a1a1a;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  animation: ec-fade-in 0.15s ease-out;
}
.ec-json-overlay.ec-closing { animation: ec-fade-out 0.1s ease-in forwards; }

.ec-json-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #1e1e1e;
  border-bottom: 1px solid #333;
  flex-shrink: 0;
}
.ec-json-toolbar-title {
  font-size: 13px;
  color: #888;
  margin-right: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ec-json-btn {
  background: #2a2d31;
  border: 1px solid #444;
  border-radius: 6px;
  color: #ccc;
  cursor: pointer;
  padding: 5px 12px;
  font-size: 12px;
  white-space: nowrap;
}
.ec-json-btn:hover { background: #333; color: #fff; }

.ec-json-search {
  background: #2a2d31;
  border: 1px solid #444;
  border-radius: 6px;
  color: #e0e0e0;
  padding: 5px 10px;
  font-size: 12px;
  outline: none;
  width: 200px;
  caret-color: #64B5F6;
}
.ec-json-search::placeholder { color: #666; }
.ec-json-search:focus { border-color: #64B5F6; }

.ec-json-tree {
  flex: 1;
  overflow: auto;
  padding: 16px;
  font-family: "SF Mono", "Fira Code", "Cascadia Code", Menlo, Consolas, monospace;
  font-size: 13px;
  line-height: 1.6;
}
.ec-json-tree::-webkit-scrollbar { width: 8px; height: 8px; }
.ec-json-tree::-webkit-scrollbar-thumb { background: #444; border-radius: 4px; }

.ec-jn { padding-left: 20px; }
.ec-jn-row { display: flex; align-items: baseline; }
.ec-jn-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  cursor: pointer;
  color: #666;
  font-size: 10px;
  flex-shrink: 0;
  user-select: none;
  border-radius: 3px;
  margin-right: 2px;
}
.ec-jn-toggle:hover { background: #333; color: #aaa; }
.ec-jn-key { color: #9CDCFE; }
.ec-jn-colon { color: #666; margin: 0 4px; }
.ec-jn-str { color: #CE9178; }
.ec-jn-num { color: #B5CEA8; }
.ec-jn-bool { color: #C586C0; }
.ec-jn-null { color: #666; font-style: italic; }
.ec-jn-brace { color: #888; }
.ec-jn-preview { color: #555; font-style: italic; margin-left: 4px; }
.ec-jn-comma { color: #666; }
.ec-jn-children { overflow: hidden; }
.ec-jn-children.ec-collapsed { display: none; }

.ec-jn-match { background: rgba(255, 213, 79, 0.25); border-radius: 2px; outline: 1px solid rgba(255, 213, 79, 0.5); }

/* Toast */
.ec-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: #1e1e1e;
  border: 1px solid #333;
  color: #e0e0e0;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 2147483647;
  animation: ec-toast-in 0.2s ease-out;
}
.ec-toast.ec-toast-out { animation: ec-toast-out 0.15s ease-in forwards; }
.ec-toast.ec-toast-success { border-color: #4CAF50; }
.ec-toast.ec-toast-error { border-color: #f44336; }
@keyframes ec-toast-in {
  from { opacity: 0; transform: translateX(-50%) translateY(12px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}
@keyframes ec-toast-out {
  from { opacity: 1; transform: translateX(-50%) translateY(0); }
  to   { opacity: 0; transform: translateX(-50%) translateY(12px); }
}
`;

  // ---------------------------------------------------------------------------
  // URL parser — extracts resource info from the current hash route
  // ---------------------------------------------------------------------------
  function parseResourceFromHash() {
    const hash = location.hash || "";
    // Match: #/projects/{projectId}/{audits|tickets|templates|maps}/{docId}
    const m = hash.match(/^#\/projects\/([^/]+)\/(audits|tickets|templates|maps)\/([^?/]+)/);
    if (m) return { type: m[2].replace(/s$/, ""), projectId: m[1], docId: m[3] };
    return null;
  }

  function parseProjectIdFromHash() {
    const hash = location.hash || "";
    const m = hash.match(/^#\/projects\/([^/?]+)/);
    return m ? m[1] : null;
  }

  // ---------------------------------------------------------------------------
  // Command registry
  // ---------------------------------------------------------------------------
  const COMMANDS = [
    {
      id: "copy-access-token",
      label: "Copy Access Token",
      icon: "\uD83D\uDD11",
      hint: "access_token",
      action: () => copyAccessToken(),
    },
    {
      id: "switch-user",
      label: "Switch User",
      icon: "\uD83D\uDC64",
      hint: "impersonate",
      action: () => enterSwitchUserMode(),
    },
    {
      id: "switch-to-project",
      label: "Switch to Project",
      icon: "\uD83D\uDCC1",
      hint: "find project & impersonate",
      action: () => enterSearchMode("project"),
    },
    {
      id: "switch-to-contract",
      label: "Switch to Contract",
      icon: "\uD83D\uDCCB",
      hint: "find contract & impersonate",
      action: () => enterSearchMode("contract"),
    },
    {
      id: "copy-resource-context",
      label: () => {
        const r = parseResourceFromHash();
        if (!r) return "Copy Context";
        const name = r.type.charAt(0).toUpperCase() + r.type.slice(1);
        return `Copy ${name} Context`;
      },
      icon: "\uD83D\uDCCB",
      hint: "markdown for AI / CLI",
      action: () => copyResourceContext(),
      hidden: () => !parseResourceFromHash(),
    },
    {
      id: "copy-project-context",
      label: "Copy Project Context",
      icon: "\uD83D\uDCCB",
      hint: "markdown for AI / CLI",
      action: () => copyProjectContext(),
      hidden: () => !parseProjectIdFromHash(),
    },
    {
      id: "view-raw-json",
      label: "View Raw JSON",
      icon: "\uD83D\uDCC4",
      hint: "CouchDB document",
      action: () => openJsonViewer(),
      hidden: () => !parseResourceFromHash(),
    },
    {
      id: "switch-back",
      label: "Switch Back",
      icon: "\u21A9\uFE0F",
      hint: "restore original user",
      action: () => handleSwitchBack(),
      hidden: () => !getOriginalUser(),
    },
  ];

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  let shadowHost = null;
  let shadowRoot = null;
  let isOpen = false;
  let activeIndex = 0;
  let mode = "commands"; // "commands" | "switch-user" | "project" | "contract"
  let cssLoaded = false;

  // ---------------------------------------------------------------------------
  // Shadow DOM setup
  // ---------------------------------------------------------------------------
  function ensureShadowRoot() {
    if (shadowRoot) return shadowRoot;

    shadowHost = document.createElement("div");
    shadowHost.id = "ec-zen-tools";
    document.documentElement.appendChild(shadowHost);
    shadowRoot = shadowHost.attachShadow({ mode: "open" });

    // Load CSS inline into shadow DOM
    if (!cssLoaded) {
      const style = document.createElement("style");
      style.textContent = CSS_TEXT;
      shadowRoot.appendChild(style);
      cssLoaded = true;
    }

    return shadowRoot;
  }

  // ---------------------------------------------------------------------------
  // Toast notifications
  // ---------------------------------------------------------------------------
  function showToast(message, type = "success") {
    const root = ensureShadowRoot();

    // Remove existing toast
    const existing = root.querySelector(".ec-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = `ec-toast ec-toast-${type}`;
    toast.textContent = message;
    root.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("ec-toast-out");
      toast.addEventListener("animationend", () => toast.remove());
    }, 2000);
  }

  // ---------------------------------------------------------------------------
  // Copy access token
  // ---------------------------------------------------------------------------
  async function copyAccessToken() {
    try {
      const token = getLiveToken();
      if (!token) {
        showToast("No access token found", "error");
        return;
      }
      await navigator.clipboard.writeText(token);
      showToast("Copied access_token to clipboard");
    } catch (err) {
      showToast(`Failed to copy: ${err.message}`, "error");
    }
  }

  // ---------------------------------------------------------------------------
  // Copy resource / project context
  // ---------------------------------------------------------------------------
  async function copyResourceContext() {
    const resource = parseResourceFromHash();
    if (!resource) {
      showToast("Not on a supported resource page", "error");
      return;
    }

    closePalette();

    const token = getLiveToken();
    if (!token) {
      showToast("No access token found", "error");
      return;
    }

    const { type, projectId, docId } = resource;
    const headers = { Authorization: `Bearer ${token}`, Accept: "application/json" };
    const origin = window.location.origin;

    // Build API endpoint based on type
    const endpoints = {
      ticket: `/api/v2/data/tickets/${projectId}/${docId}`,
      audit: `/api/v2/data/projects/${projectId}/audits/${docId}`,
      template: `/api/v2/data/projects/${projectId}/audittemplates/${docId}`,
    };
    const resourceUrl = endpoints[type];
    if (!resourceUrl) {
      showToast(`Unsupported resource type: ${type}`, "error");
      return;
    }

    showToast("Fetching context\u2026");

    try {
      const [resourceRes, projectRes] = await Promise.all([
        fetch(`${origin}${resourceUrl}`, { headers }),
        fetch(`${origin}/api/v2/data/projects/${projectId}`, { headers }),
      ]);

      if (!resourceRes.ok) {
        showToast(`Failed to fetch ${type} (${resourceRes.status})`, "error");
        return;
      }

      const data = await resourceRes.json();
      const project = projectRes.ok ? await projectRes.json() : null;
      const projectName = project?.name || "Unknown";
      const typeName = type.charAt(0).toUpperCase() + type.slice(1);

      // Fetch related documents (template for audits, map for tickets)
      let templateData = null;
      let mapData = null;
      const templateId = data.template;
      if (type === "audit" && templateId) {
        try {
          const tRes = await fetch(`${origin}/api/v2/data/projects/${projectId}/audittemplates/${templateId}`, { headers });
          if (tRes.ok) templateData = await tRes.json();
        } catch {}
      }
      if (type === "ticket" && data.map) {
        try {
          const mRes = await fetch(`${origin}/api/v1/securedata/${projectId}/${data.map}`, { headers });
          if (mRes.ok) mapData = await mRes.json();
        } catch {}
      }

      let lines = [`## ${typeName} Context`];

      if (type === "ticket") {
        lines.push(
          `- **Title:** ${data.content?.title || "Untitled"}`,
          `- **Status:** ${data.state?.state || "Unknown"}`,
          `- **Project ID:** ${projectId}`,
          `- **Document ID:** ${docId}`,
          `- **Project:** ${projectName}`,
          `- **Map Name:** ${mapData?.content?.title || ""}`,
          `- **Map ID:** ${data.map || ""}`,
          `- **Author:** ${data.content?.author?.email || ""}`,
          `- **Responsible:** ${data.participants?.responsible?.email || ""}`,
          `- **Created:** ${data.dates?.creationDate || ""}`,
          `- **Last Modified:** ${data.dates?.lastModifiedDate || ""}`,
        );
        if (data.tags?.length) lines.push(`- **Tags:** ${data.tags.join(", ")}`);
      } else if (type === "audit") {
        lines.push(
          `- **Name:** ${data.name || "Untitled"}`,
          `- **Status:** ${data.status || "Unknown"}`,
          `- **Project ID:** ${projectId}`,
          `- **Document ID:** ${docId}`,
          `- **Project:** ${projectName}`,
          `- **Template Name:** ${templateData?.name || ""}`,
          `- **Template ID:** ${templateId || ""}`,
          `- **Author:** ${data.author?.email || ""}`,
          `- **Responsible:** ${data.participants?.responsible?.email || ""}`,
          `- **Created:** ${data.dates?.creationDate || ""}`,
          `- **Last Modified:** ${data.dates?.lastModifiedDate || ""}`,
        );
        if (data.tags?.length) lines.push(`- **Tags:** ${data.tags.join(", ")}`);
      } else if (type === "template") {
        lines.push(
          `- **Name:** ${data.name || "Untitled"}`,
          `- **Published:** ${data.isPublished ?? "Unknown"}`,
          `- **Project ID:** ${projectId}`,
          `- **Document ID:** ${docId}`,
          `- **Project:** ${projectName}`,
          `- **Author:** ${data.content?.author || ""}`,
          `- **Created:** ${data.dates?.creationDate || ""}`,
          `- **Last Modified:** ${data.dates?.lastModifiedDate || ""}`,
        );
      }

      lines.push(`- **Access Token:** ${token}`);

      await navigator.clipboard.writeText(lines.join("\n"));
      showToast(`Copied ${typeName} context to clipboard`);
    } catch (err) {
      showToast(`Failed to copy context: ${err.message}`, "error");
    }
  }

  async function copyProjectContext() {
    const projectId = parseProjectIdFromHash();
    if (!projectId) {
      showToast("Not on a project page", "error");
      return;
    }

    closePalette();

    const token = getLiveToken();
    if (!token) {
      showToast("No access token found", "error");
      return;
    }

    showToast("Fetching project context\u2026");

    try {
      const res = await fetch(
        `${window.location.origin}/api/v2/data/projects/${projectId}`,
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
      );

      if (!res.ok) {
        showToast(`Failed to fetch project (${res.status})`, "error");
        return;
      }

      const data = await res.json();

      const lines = [
        `## Project Context`,
        `- **Name:** ${data.name || "Untitled"}`,
        `- **Project ID:** ${projectId}`,
        `- **Accountable:** ${data.participants?.accountable?.email || ""}`,
        `- **Location:** ${data.location?.location || ""}`,
        `- **Created:** ${data.dates?.creationDate || ""}`,
        `- **Last Modified:** ${data.dates?.lastModifiedDate || ""}`,
        `- **Access Token:** ${token}`,
      ];

      await navigator.clipboard.writeText(lines.join("\n"));
      showToast("Copied Project context to clipboard");
    } catch (err) {
      showToast(`Failed to copy context: ${err.message}`, "error");
    }
  }

  // ---------------------------------------------------------------------------
  // Switch user sub-mode
  // ---------------------------------------------------------------------------
  let searchResults = [];
  let searchDebounceTimer = null;
  let searchAbortController = null;

  function timeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return days === 1 ? "yesterday" : `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return months === 1 ? "1 month ago" : `${months} months ago`;
    // Older than a year — show the actual date
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  function enterSwitchUserMode() {
    mode = "switch-user";
    searchResults = [];
    renderPalette();
  }

  function enterSearchMode(type) {
    mode = type;
    searchResults = [];
    renderPalette();
  }

  async function searchUsers(query) {
    if (searchAbortController) searchAbortController.abort();
    searchAbortController = new AbortController();

    const q = query.toLowerCase().trim();
    if (!q) {
      searchResults = [];
      return;
    }

    try {
      const res = await fetch(
        `${window.location.origin}/api/v1/search/data/user/_search`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: searchAbortController.signal,
          body: JSON.stringify({
            size: 20,
            _source: [
              "name",
              "userInfo.name.firstName",
              "userInfo.name.lastName",
              "userInfo.companyName",
              "userInfo.address",
              "roles",
              "userActivity",
              "privacy.agreed",
            ],
            query: {
              bool: {
                should: [
                  { wildcard: { name: `*${q}*` } },
                  { match: { "userInfo.name.firstName": q } },
                  { match: { "userInfo.name.lastName": q } },
                ],
                minimum_should_match: 1,
              },
            },
          }),
        }
      );
      const data = await res.json();
      searchResults = (data.hits?.hits || []).map((hit) => {
        const s = hit._source;
        const addr = s.userInfo?.address || {};
        const notNull = (v) => v != null && v !== "" && v !== "null";
        const addrParts = [addr.address, addr.zipCode, addr.city, addr.country].filter(notNull);

        // Find most recent activity across platforms
        const activity = s.userActivity || {};
        const activeDates = ["web", "android", "ios"]
          .map((p) => activity[p]?.activeDate)
          .filter(Boolean);
        function parseDMY(str) {
          const [d, m, y] = str.split("-");
          return new Date(`${y}-${m}-${d}`);
        }
        let lastActive = null;
        if (activeDates.length) {
          activeDates.sort((a, b) => parseDMY(b) - parseDMY(a));
          lastActive = timeAgo(parseDMY(activeDates[0]));
        }

        const registered = s.privacy?.agreed === true;

        return {
          email: s.name,
          firstName: notNull(s.userInfo?.name?.firstName) ? s.userInfo.name.firstName : "",
          lastName: notNull(s.userInfo?.name?.lastName) ? s.userInfo.name.lastName : "",
          company: notNull(s.userInfo?.companyName) ? s.userInfo.companyName : "",
          address: addrParts.join(", "),
          roles: s.roles || [],
          lastActive,
          registered,
        };
      });
    } catch (err) {
      if (err.name !== "AbortError") {
        searchResults = [];
      }
    }
  }

  async function searchProjects(query) {
    if (searchAbortController) searchAbortController.abort();
    searchAbortController = new AbortController();

    const q = query.trim();
    if (!q) { searchResults = []; return; }

    try {
      const res = await fetch(
        `${window.location.origin}/api/v1/search/data/project/_search`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: searchAbortController.signal,
          body: JSON.stringify({
            size: 20,
            _source: ["name", "participants.accountable.email", "location.location", "database"],
            query: {
              bool: {
                must: [{ match_phrase_prefix: { name: q } }],
                must_not: [{ exists: { field: "deleted" } }],
              },
            },
          }),
        }
      );
      const data = await res.json();
      searchResults = (data.hits?.hits || []).map((hit) => {
        const s = hit._source;
        const notNull = (v) => v != null && v !== "" && v !== "null";
        return {
          type: "project",
          name: s.name || "Unnamed project",
          email: s.participants?.accountable?.email || "",
          location: notNull(s.location?.location) ? s.location.location : "",
          projectId: s.database || "",
        };
      }).filter((r) => r.email);
    } catch (err) {
      if (err.name !== "AbortError") searchResults = [];
    }
  }

  async function searchContracts(query) {
    if (searchAbortController) searchAbortController.abort();
    searchAbortController = new AbortController();

    const q = query.trim();
    if (!q) { searchResults = []; return; }

    try {
      const res = await fetch(
        `${window.location.origin}/api/v1/search/data/contract/_search`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: searchAbortController.signal,
          body: JSON.stringify({
            size: 20,
            _source: ["name", "administrators", "contractActive", "address"],
            query: {
              bool: {
                should: [
                  { match_phrase_prefix: { name: q } },
                  { wildcard: { administrators: `*${q.toLowerCase()}*` } },
                ],
                minimum_should_match: 1,
                must_not: [
                  { exists: { field: "deleted" } },
                  { exists: { field: "archived" } },
                ],
              },
            },
          }),
        }
      );
      const data = await res.json();
      const notNull = (v) => v != null && v !== "" && v !== "null";
      searchResults = (data.hits?.hits || []).map((hit) => {
        const s = hit._source;
        const admins = (s.administrators || []).filter(notNull);
        const addr = s.address || {};
        const addrParts = [addr.streetName, addr.houseNo, addr.zipCode, addr.city, addr.country].filter(notNull);
        return {
          type: "contract",
          name: notNull(s.name) ? s.name : "Unnamed contract",
          email: admins[0] || "",
          admins,
          active: s.contractActive,
          address: addrParts.join(", "),
        };
      }).filter((r) => r.email);
    } catch (err) {
      if (err.name !== "AbortError") searchResults = [];
    }
  }

  // ---------------------------------------------------------------------------
  // Original user persistence (survives reload)
  // ---------------------------------------------------------------------------
  const STORAGE_KEY = "ec_zen_original_user";

  function saveOriginalUser(email, accessToken) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ email, accessToken }));
  }

  function getOriginalUser() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  function clearOriginalUser() {
    sessionStorage.removeItem(STORAGE_KEY);
  }

  // Clear stale original user data on load — if the frontend isn't in
  // switch mode, any saved original user is leftover from a previous session
  // Clean up stale original user data on load.
  // If the current user_email cookie matches the saved original, we're no longer
  // impersonating — clear the saved data. Runs after a short delay to let cookies settle.
  setTimeout(() => {
    const saved = getOriginalUser();
    if (!saved) return;
    const match = document.cookie.match(/(?:^|;\s*)user_email=([^;]*)/);
    const currentEmail = match ? decodeURIComponent(match[1]) : null;
    if (currentEmail && currentEmail === saved.email) {

      clearOriginalUser();
    }
  }, 1000);

  // ---------------------------------------------------------------------------
  // Switch user actions
  // ---------------------------------------------------------------------------
  // Read the live access token from the frontend's sessionStorage (most reliable)
  // Falls back to the cookie value if sessionStorage is unavailable
  function getLiveToken() {
    try {
      const appState = JSON.parse(sessionStorage.getItem("edappstate") || "{}");
      if (appState.user?.accessToken) return appState.user.accessToken;
    } catch {}
    return null;
  }

  function getLiveEmail() {
    try {
      const appState = JSON.parse(sessionStorage.getItem("edappstate") || "{}");
      if (appState.user?.id) return appState.user.id;
    } catch {}
    return null;
  }

  async function handleSwitchUser(email, redirectUrl) {
    closePalette();

    try {
      // Read current token — prefer sessionStorage over cookie
      const currentToken = getLiveToken();
      const currentEmail = getLiveEmail();

      if (!currentToken) {
        showToast("No access token found", "error");
        return;
      }

      // Save the original user before switching (only if not already impersonating)
      if (!getOriginalUser()) {
        saveOriginalUser(currentEmail || "unknown", currentToken);
      }

      showToast(`Switching to ${email}\u2026`);

      // Use the original admin token for the impersonate call
      const original = getOriginalUser();
      const authToken = original ? original.accessToken : currentToken;

      const res = await fetch(
        `${window.location.origin}/api/v1/users/impersonate?emailAddress=${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        showToast(`Impersonate failed (${res.status}): ${text}`, "error");
        return;
      }

      const data = await res.json();

      // Set cookies via document.cookie (same way the frontend does it)
      // The app reads these on reload via document.cookie.split(';')
      const cookieEntries = {
        access_token: data.access_token,
        refresh_token: data.refresh_token || "",
        user_scope: data.scope || "read_write",
        token_type: data.token_type || "bearer",
        user_email: email,
      };
      const secure = location.protocol === "https:" ? ";secure;SameSite=Lax" : "";
      for (const [name, value] of Object.entries(cookieEntries)) {
        document.cookie = `${name}=${value};path=/${secure}`;
      }

      showToast(`Switched to ${email} — reloading\u2026`);
      setTimeout(() => {
        // Force-remove the overlay before navigating (hash changes don't trigger full reload)
        const overlay = shadowRoot?.querySelector(".ec-overlay");
        if (overlay) overlay.remove();

        if (redirectUrl) {
          window.location.href = redirectUrl;
          // Hash-only navigation won't reload, so force it
          window.location.reload();
        } else {
          window.location.reload();
        }
      }, 500);
    } catch (err) {
      showToast(`Switch failed: ${err.message}`, "error");
    }
  }

  async function handleSwitchBack() {
    closePalette();

    const original = getOriginalUser();
    if (!original) {
      showToast("No original user to switch back to", "error");
      return;
    }

    try {
      showToast(`Switching back to ${original.email}\u2026`);

      // Restore original user cookies via document.cookie
      const cookieEntries = {
        access_token: original.accessToken,
        refresh_token: "",
        user_scope: "read_write",
        token_type: "bearer",
        user_email: original.email,
      };
      const secure = location.protocol === "https:" ? ";secure;SameSite=Lax" : "";
      for (const [name, value] of Object.entries(cookieEntries)) {
        document.cookie = `${name}=${value};path=/${secure}`;
      }

      clearOriginalUser();

      showToast(`Switched back to ${original.email} — reloading\u2026`);
      setTimeout(() => window.location.reload(), 500);
    } catch (err) {
      showToast(`Switch back failed: ${err.message}`, "error");
    }
  }

  // ---------------------------------------------------------------------------
  // JSON Viewer
  // ---------------------------------------------------------------------------
  async function openJsonViewer() {
    const resource = parseResourceFromHash();
    if (!resource) {
      showToast("Not on a supported resource page", "error");
      return;
    }

    closePalette();

    const token = getLiveToken();
    if (!token) {
      showToast("No access token found", "error");
      return;
    }

    showToast("Fetching document\u2026");

    try {
      const res = await fetch(
        `${window.location.origin}/api/v1/securedata/${resource.projectId}/${resource.docId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) {
        showToast(`Failed to fetch (${res.status})`, "error");
        return;
      }
      const json = await res.json();
      renderJsonViewer(json, resource);
    } catch (err) {
      showToast(`Fetch failed: ${err.message}`, "error");
    }
  }

  function renderJsonViewer(data, resource) {
    const root = ensureShadowRoot();

    // Remove existing viewer
    const existing = root.querySelector(".ec-json-overlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.className = "ec-json-overlay";

    // --- Toolbar ---
    const toolbar = document.createElement("div");
    toolbar.className = "ec-json-toolbar";

    const title = document.createElement("span");
    title.className = "ec-json-toolbar-title";
    title.textContent = `${resource.projectId} / ${resource.docId}`;
    toolbar.appendChild(title);

    const searchInput = document.createElement("input");
    searchInput.className = "ec-json-search";
    searchInput.type = "text";
    searchInput.placeholder = "Search keys/values\u2026";
    searchInput.spellcheck = false;
    toolbar.appendChild(searchInput);

    const expandBtn = document.createElement("button");
    expandBtn.className = "ec-json-btn";
    expandBtn.textContent = "Expand All";
    toolbar.appendChild(expandBtn);

    const collapseBtn = document.createElement("button");
    collapseBtn.className = "ec-json-btn";
    collapseBtn.textContent = "Collapse All";
    toolbar.appendChild(collapseBtn);

    const copyBtn = document.createElement("button");
    copyBtn.className = "ec-json-btn";
    copyBtn.textContent = "Copy JSON";
    toolbar.appendChild(copyBtn);

    const closeBtn = document.createElement("button");
    closeBtn.className = "ec-json-btn";
    closeBtn.textContent = "Close";
    toolbar.appendChild(closeBtn);

    overlay.appendChild(toolbar);

    // --- Tree container ---
    const treeContainer = document.createElement("div");
    treeContainer.className = "ec-json-tree";
    overlay.appendChild(treeContainer);

    // --- Build tree ---
    const allNodes = []; // track all toggle-able nodes for expand/collapse all

    function buildNode(key, value, isLast) {
      const wrapper = document.createElement("div");
      wrapper.className = "ec-jn";

      const row = document.createElement("div");
      row.className = "ec-jn-row";

      const isObject = value !== null && typeof value === "object" && !Array.isArray(value);
      const isArray = Array.isArray(value);

      if (isObject || isArray) {
        const entries = isObject ? Object.keys(value) : value;
        const count = isObject ? Object.keys(value).length : value.length;
        const openBrace = isObject ? "{" : "[";
        const closeBrace = isObject ? "}" : "]";
        const previewText = isObject ? `${count} key${count !== 1 ? "s" : ""}` : `${count} item${count !== 1 ? "s" : ""}`;

        const toggle = document.createElement("span");
        toggle.className = "ec-jn-toggle";
        toggle.textContent = "\u25BC";
        row.appendChild(toggle);

        if (key !== null) {
          const keySpan = document.createElement("span");
          keySpan.className = "ec-jn-key";
          keySpan.textContent = `"${key}"`;
          keySpan.dataset.jsonKey = key;
          row.appendChild(keySpan);
          const colon = document.createElement("span");
          colon.className = "ec-jn-colon";
          colon.textContent = ":";
          row.appendChild(colon);
        }

        const openSpan = document.createElement("span");
        openSpan.className = "ec-jn-brace";
        openSpan.textContent = openBrace;
        row.appendChild(openSpan);

        const preview = document.createElement("span");
        preview.className = "ec-jn-preview";
        preview.textContent = `${previewText}`;
        preview.style.display = "none";
        row.appendChild(preview);

        wrapper.appendChild(row);

        const children = document.createElement("div");
        children.className = "ec-jn-children";

        if (isObject) {
          const keys = Object.keys(value);
          keys.forEach((k, i) => {
            children.appendChild(buildNode(k, value[k], i === keys.length - 1));
          });
        } else {
          value.forEach((item, i) => {
            children.appendChild(buildNode(i, item, i === value.length - 1));
          });
        }

        wrapper.appendChild(children);

        const closeRow = document.createElement("div");
        closeRow.className = "ec-jn-row";
        // Spacer for alignment with toggle
        const spacer = document.createElement("span");
        spacer.className = "ec-jn-toggle";
        spacer.style.visibility = "hidden";
        closeRow.appendChild(spacer);
        const closeSpan = document.createElement("span");
        closeSpan.className = "ec-jn-brace";
        closeSpan.textContent = closeBrace + (isLast ? "" : ",");
        closeRow.appendChild(closeSpan);
        wrapper.appendChild(closeRow);

        // Toggle logic
        let collapsed = false;
        const nodeRef = { toggle, children, preview, closeRow, collapsed };
        allNodes.push(nodeRef);

        function setCollapsed(val) {
          collapsed = val;
          nodeRef.collapsed = val;
          toggle.textContent = collapsed ? "\u25B6" : "\u25BC";
          children.classList.toggle("ec-collapsed", collapsed);
          preview.style.display = collapsed ? "inline" : "none";
          closeRow.style.display = collapsed ? "none" : "";
          // When collapsed, show comma on the open row
          openSpan.textContent = collapsed ? openBrace + (isLast ? "" : ",") : openBrace;
        }

        toggle.addEventListener("click", () => setCollapsed(!collapsed));

      } else {
        // Primitive
        // Invisible spacer to align with toggles
        const spacer = document.createElement("span");
        spacer.className = "ec-jn-toggle";
        spacer.style.visibility = "hidden";
        row.appendChild(spacer);

        if (key !== null) {
          const keySpan = document.createElement("span");
          keySpan.className = "ec-jn-key";
          keySpan.textContent = typeof key === "number" ? key : `"${key}"`;
          keySpan.dataset.jsonKey = String(key);
          row.appendChild(keySpan);
          const colon = document.createElement("span");
          colon.className = "ec-jn-colon";
          colon.textContent = ":";
          row.appendChild(colon);
        }

        const valSpan = document.createElement("span");
        if (typeof value === "string") {
          valSpan.className = "ec-jn-str";
          valSpan.textContent = `"${value}"`;
        } else if (typeof value === "number") {
          valSpan.className = "ec-jn-num";
          valSpan.textContent = String(value);
        } else if (typeof value === "boolean") {
          valSpan.className = "ec-jn-bool";
          valSpan.textContent = String(value);
        } else {
          valSpan.className = "ec-jn-null";
          valSpan.textContent = "null";
        }
        valSpan.dataset.jsonValue = String(value);
        row.appendChild(valSpan);

        if (!isLast) {
          const comma = document.createElement("span");
          comma.className = "ec-jn-comma";
          comma.textContent = ",";
          row.appendChild(comma);
        }

        wrapper.appendChild(row);
      }

      return wrapper;
    }

    treeContainer.appendChild(buildNode(null, data, true));

    // --- Expand / Collapse All ---
    expandBtn.addEventListener("click", () => {
      allNodes.forEach((n) => {
        n.collapsed = false;
        n.toggle.textContent = "\u25BC";
        n.children.classList.remove("ec-collapsed");
        n.preview.style.display = "none";
        n.closeRow.style.display = "";
      });
    });

    collapseBtn.addEventListener("click", () => {
      allNodes.forEach((n) => {
        n.collapsed = true;
        n.toggle.textContent = "\u25B6";
        n.children.classList.add("ec-collapsed");
        n.preview.style.display = "inline";
        n.closeRow.style.display = "none";
      });
    });

    // --- Copy JSON ---
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        showToast("Copied JSON to clipboard");
      } catch (err) {
        showToast(`Copy failed: ${err.message}`, "error");
      }
    });

    // --- Search ---
    let searchTimer = null;
    searchInput.addEventListener("input", () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => performSearch(searchInput.value), 200);
    });

    function performSearch(query) {
      // Clear previous highlights
      treeContainer.querySelectorAll(".ec-jn-match").forEach((el) => {
        el.classList.remove("ec-jn-match");
      });

      const q = query.toLowerCase().trim();
      if (!q) return;

      // First collapse all, then expand only matching paths
      allNodes.forEach((n) => {
        n.collapsed = true;
        n.toggle.textContent = "\u25B6";
        n.children.classList.add("ec-collapsed");
        n.preview.style.display = "inline";
        n.closeRow.style.display = "none";
      });

      // Find and highlight matching keys and values
      const keyEls = treeContainer.querySelectorAll("[data-json-key]");
      const valEls = treeContainer.querySelectorAll("[data-json-value]");

      let firstMatch = null;

      keyEls.forEach((el) => {
        if (el.dataset.jsonKey.toLowerCase().includes(q)) {
          el.classList.add("ec-jn-match");
          expandParents(el);
          if (!firstMatch) firstMatch = el;
        }
      });

      valEls.forEach((el) => {
        if (el.dataset.jsonValue.toLowerCase().includes(q)) {
          el.classList.add("ec-jn-match");
          expandParents(el);
          if (!firstMatch) firstMatch = el;
        }
      });

      if (firstMatch) {
        firstMatch.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }

    function expandParents(el) {
      let node = el.parentElement;
      while (node && node !== treeContainer) {
        if (node.classList.contains("ec-jn-children") && node.classList.contains("ec-collapsed")) {
          // Find the corresponding allNodes entry
          const parentWrapper = node.parentElement;
          if (parentWrapper) {
            const nodeRef = allNodes.find((n) => n.children === node);
            if (nodeRef) {
              nodeRef.collapsed = false;
              nodeRef.toggle.textContent = "\u25BC";
              nodeRef.children.classList.remove("ec-collapsed");
              nodeRef.preview.style.display = "none";
              nodeRef.closeRow.style.display = "";
            }
          }
        }
        node = node.parentElement;
      }
    }

    // --- Close ---
    function closeViewer() {
      overlay.classList.add("ec-closing");
      overlay.addEventListener("animationend", () => overlay.remove(), { once: true });
    }

    closeBtn.addEventListener("click", closeViewer);

    // Keyboard
    function onKeyDown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeViewer();
        document.removeEventListener("keydown", onKeyDown, true);
      }
    }
    document.addEventListener("keydown", onKeyDown, true);

    // Remove listener when overlay is removed
    const observer = new MutationObserver(() => {
      if (!root.contains(overlay)) {
        document.removeEventListener("keydown", onKeyDown, true);
        observer.disconnect();
      }
    });
    observer.observe(root, { childList: true });

    root.appendChild(overlay);

    // Focus search input
    requestAnimationFrame(() => searchInput.focus());
  }

  // ---------------------------------------------------------------------------
  // Palette rendering
  // ---------------------------------------------------------------------------
  function resolveLabel(cmd) {
    return typeof cmd.label === "function" ? cmd.label() : cmd.label;
  }

  function getFilteredCommands(query) {
    const visible = COMMANDS.filter((cmd) => !cmd.hidden || !cmd.hidden());
    if (!query) return visible;
    const q = query.toLowerCase();
    return visible.filter(
      (cmd) =>
        resolveLabel(cmd).toLowerCase().includes(q) ||
        cmd.hint.toLowerCase().includes(q)
    );
  }

  function renderPalette() {
    const root = ensureShadowRoot();

    // Remove existing palette
    const existing = root.querySelector(".ec-overlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.className = "ec-overlay";
    overlay.addEventListener("mousedown", (e) => {
      if (e.target === overlay) closePalette();
    });

    const modal = document.createElement("div");
    modal.className = "ec-modal";

    // Input area
    const inputWrap = document.createElement("div");
    inputWrap.className = "ec-input-wrap";

    if (mode !== "commands") {
      const backBtn = document.createElement("button");
      backBtn.className = "ec-back-btn";
      backBtn.textContent = "\u2190 Back";
      backBtn.addEventListener("click", () => {
        mode = "commands";
        activeIndex = 0;
        renderPalette();
      });
      inputWrap.appendChild(backBtn);
    } else {
      const icon = document.createElement("span");
      icon.className = "ec-icon";
      icon.innerHTML =
        '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></svg>';
      inputWrap.appendChild(icon);
    }

    const input = document.createElement("input");
    input.className = "ec-search";
    input.type = "text";
    const placeholders = {
      commands: "Type a command\u2026",
      "switch-user": "Search by email or name\u2026",
      project: "Search project name\u2026",
      contract: "Search contract name or admin\u2026",
    };
    input.placeholder = placeholders[mode] || "Search\u2026";
    input.spellcheck = false;
    inputWrap.appendChild(input);
    modal.appendChild(inputWrap);

    // Command list (only in commands mode)
    const list = document.createElement("div");
    list.className = "ec-list";
    modal.appendChild(list);

    overlay.appendChild(modal);
    root.appendChild(overlay);

    // Focus input
    requestAnimationFrame(() => input.focus());

    // Render the list
    function updateList() {
      if (mode === "switch-user") {
        list.innerHTML = "";

        if (!input.value.trim()) {
          const hint = document.createElement("div");
          hint.className = "ec-empty";
          hint.textContent = "Start typing to search users\u2026";
          list.appendChild(hint);
          return;
        }

        if (searchResults.length === 0) {
          const empty = document.createElement("div");
          empty.className = "ec-empty";
          empty.textContent = "No users found";
          list.appendChild(empty);
          return;
        }

        if (activeIndex >= searchResults.length) activeIndex = searchResults.length - 1;
        if (activeIndex < 0) activeIndex = 0;

        searchResults.forEach((user, i) => {
          const item = document.createElement("div");
          item.className = "ec-card" + (i === activeIndex ? " ec-active" : "");
          const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");

          let detailsHtml = "";
          if (user.company) {
            detailsHtml += `<span class="ec-card-detail">\uD83C\uDFE2 ${user.company}</span>`;
          }
          if (user.address) {
            detailsHtml += `<span class="ec-card-detail">\uD83D\uDCCD ${user.address}</span>`;
          }
          if (user.lastActive) {
            detailsHtml += `<span class="ec-card-detail">\uD83D\uDD52 Last active: ${user.lastActive}</span>`;
          }

          const statusTag = user.registered
            ? `<span class="ec-tag ec-tag-ok">Registered</span>`
            : `<span class="ec-tag ec-tag-warn">Not registered</span>`;

          item.innerHTML = `
            <div class="ec-card-main">
              <span class="ec-card-email">${user.email}</span>
              ${fullName ? `<span class="ec-card-name">${fullName}</span>` : ""}
              ${statusTag}
            </div>
            ${detailsHtml ? `<div class="ec-card-details">${detailsHtml}</div>` : ""}
          `;
          item.addEventListener("click", () => handleSwitchUser(user.email));
          item.addEventListener("mouseenter", () => {
            activeIndex = i;
            updateActiveClass();
          });
          list.appendChild(item);
        });
        return;
      }

      if (mode === "project" || mode === "contract") {
        list.innerHTML = "";
        const label = mode === "project" ? "projects" : "contracts";

        if (!input.value.trim()) {
          const hint = document.createElement("div");
          hint.className = "ec-empty";
          hint.textContent = `Start typing to search ${label}\u2026`;
          list.appendChild(hint);
          return;
        }

        if (searchResults.length === 0) {
          const empty = document.createElement("div");
          empty.className = "ec-empty";
          empty.textContent = `No ${label} found`;
          list.appendChild(empty);
          return;
        }

        if (activeIndex >= searchResults.length) activeIndex = searchResults.length - 1;
        if (activeIndex < 0) activeIndex = 0;

        searchResults.forEach((result, i) => {
          const item = document.createElement("div");
          item.className = "ec-card" + (i === activeIndex ? " ec-active" : "");

          let detailsHtml = "";
          if (result.type === "project" && result.location) {
            detailsHtml += `<span class="ec-card-detail">\uD83D\uDCCD ${result.location}</span>`;
          }
          if (result.type === "contract" && result.address) {
            detailsHtml += `<span class="ec-card-detail">\uD83D\uDCCD ${result.address}</span>`;
          }
          if (result.type === "contract" && result.admins && result.admins.length > 1) {
            detailsHtml += `<span class="ec-card-detail">\uD83D\uDC65 ${result.admins.join(", ")}</span>`;
          }

          const icon = mode === "project" ? "\uD83D\uDCC1" : "\uD83D\uDCCB";
          const activeTag = result.type === "contract"
            ? (result.active
              ? `<span class="ec-tag ec-tag-ok">Active</span>`
              : `<span class="ec-tag ec-tag-warn">Inactive</span>`)
            : "";

          item.innerHTML = `
            <div class="ec-card-main">
              <span class="ec-card-email">${icon} ${result.name}</span>
              <span class="ec-card-name">\u2192 ${result.email}</span>
              ${activeTag}
            </div>
            ${detailsHtml ? `<div class="ec-card-details">${detailsHtml}</div>` : ""}
          `;
          const resultRedirect = result.type === "project"
            ? `${window.location.origin}/#/projects?view=grid&filter=all&searchByName=${encodeURIComponent(result.name)}`
            : null;
          item.addEventListener("click", () => handleSwitchUser(result.email, resultRedirect));
          item.addEventListener("mouseenter", () => {
            activeIndex = i;
            updateActiveClass();
          });
          list.appendChild(item);
        });
        return;
      }

      const filtered = getFilteredCommands(input.value);
      list.innerHTML = "";

      if (filtered.length === 0) {
        const empty = document.createElement("div");
        empty.className = "ec-empty";
        empty.textContent = "No matching commands";
        list.appendChild(empty);
        return;
      }

      if (activeIndex >= filtered.length) activeIndex = filtered.length - 1;
      if (activeIndex < 0) activeIndex = 0;

      filtered.forEach((cmd, i) => {
        const item = document.createElement("div");
        item.className = "ec-item" + (i === activeIndex ? " ec-active" : "");
        item.innerHTML = `
          <span class="ec-item-icon">${cmd.icon}</span>
          <span class="ec-item-label">${resolveLabel(cmd)}</span>
          <span class="ec-item-hint">${cmd.hint}</span>
        `;
        item.addEventListener("click", () => {
          closePalette();
          cmd.action();
        });
        item.addEventListener("mouseenter", () => {
          activeIndex = i;
          updateActiveClass();
        });
        list.appendChild(item);
      });
    }

    function updateActiveClass() {
      const items = list.querySelectorAll(".ec-item, .ec-card");
      items.forEach((el, i) => {
        el.classList.toggle("ec-active", i === activeIndex);
      });
    }

    function scrollActiveIntoView() {
      const active = list.querySelector(".ec-active");
      if (active) active.scrollIntoView({ block: "nearest" });
    }

    updateList();

    // Input events
    input.addEventListener("input", () => {
      activeIndex = 0;

      if (mode !== "commands") {
        clearTimeout(searchDebounceTimer);
        const searchFn = mode === "switch-user" ? searchUsers
          : mode === "project" ? searchProjects
          : searchContracts;
        searchDebounceTimer = setTimeout(async () => {
          await searchFn(input.value);
          updateList();
        }, 250);
        return;
      }

      updateList();
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (mode !== "commands") {
          mode = "commands";
          activeIndex = 0;
          renderPalette();
        } else {
          closePalette();
        }
        return;
      }

      if (mode !== "commands") {
        if (e.key === "ArrowDown" && searchResults.length) {
          e.preventDefault();
          activeIndex = (activeIndex + 1) % searchResults.length;
          updateActiveClass();
          scrollActiveIntoView();
        } else if (e.key === "ArrowUp" && searchResults.length) {
          e.preventDefault();
          activeIndex = (activeIndex - 1 + searchResults.length) % searchResults.length;
          updateActiveClass();
          scrollActiveIntoView();
        } else if (e.key === "Enter" && searchResults[activeIndex]) {
          e.preventDefault();
          const r = searchResults[activeIndex];
          const url = r.type === "project"
            ? `${window.location.origin}/#/projects?view=grid&filter=all&searchByName=${encodeURIComponent(r.name)}`
            : null;
          handleSwitchUser(r.email, url);
        }
        return;
      }

      const filtered = getFilteredCommands(input.value);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        activeIndex = (activeIndex + 1) % filtered.length;
        updateActiveClass();
        scrollActiveIntoView();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        activeIndex = (activeIndex - 1 + filtered.length) % filtered.length;
        updateActiveClass();
        scrollActiveIntoView();
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[activeIndex]) {
          closePalette();
          filtered[activeIndex].action();
        }
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Open / Close
  // ---------------------------------------------------------------------------
  function openPalette() {
    if (isOpen) return;
    isOpen = true;
    mode = "commands";
    activeIndex = 0;
    renderPalette();
  }

  function closePalette() {
    if (!isOpen) return;
    isOpen = false;

    const root = shadowRoot;
    if (!root) return;

    const overlay = root.querySelector(".ec-overlay");
    if (!overlay) return;

    overlay.classList.add("ec-closing");
    overlay.addEventListener("animationend", () => overlay.remove(), {
      once: true,
    });
  }

  function togglePalette() {
    if (isOpen) {
      closePalette();
    } else {
      openPalette();
    }
  }

  // ---------------------------------------------------------------------------
  // Event listeners
  // ---------------------------------------------------------------------------

  // Message from background script (keyboard shortcut via commands API)
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "toggle-palette") {
      togglePalette();
    }
  });

  // Fallback keyboard shortcut (in case browser captures Cmd+K)
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      e.stopPropagation();
      togglePalette();
    }
  });

  // Make CSS accessible from extension URL
  ensureShadowRoot();
})();
