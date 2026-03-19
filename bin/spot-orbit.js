#!/usr/bin/env node
/**
 * spot-orbit-plugin CLI
 * Install, uninstall, and manage the Spot Orbit plugin for Claude Code.
 *
 * Usage:
 *   npx spot-orbit-plugin install    # Install plugin symlinks
 *   npx spot-orbit-plugin setup      # Configure credentials & MCP
 *   npx spot-orbit-plugin uninstall  # Remove plugin
 *   npx spot-orbit-plugin status     # Check installation
 *   npx spot-orbit-plugin doctor     # Verify dependencies
 */

const fs = require("fs");
const path = require("path");
const os = require("os");
const readline = require("readline");
const https = require("https");
const { execFileSync } = require("child_process");

const PLUGIN_ROOT = path.resolve(__dirname, "..");
const CLAUDE_DIR = path.join(os.homedir(), ".claude");
const COMMANDS_DIR = path.join(CLAUDE_DIR, "commands");
const AGENTS_DIR = path.join(CLAUDE_DIR, "agents");
const SKILLS_DIR = path.join(CLAUDE_DIR, "skills");
const HOOKS_DIR = path.join(CLAUDE_DIR, "hooks");

const COMMANDS = ["status", "validate", "version"];
const AGENTS = ["orbit-explorer", "spx-architect", "spot-sdk-guide"];
const SKILLS = ["cert-setup", "orbit-api", "spot-explore", "spot-troubleshoot", "spx-build"];

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";
const NC = "\x1b[0m";

function log(color, icon, msg) {
  console.log(`${color}[${icon}]${NC} ${msg}`);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function createSymlink(src, dst) {
  // Use lstatSync to detect broken symlinks (existsSync follows symlinks and
  // returns false when the target is missing).
  let exists = false;
  let stat;
  try {
    stat = fs.lstatSync(dst);
    exists = true;
  } catch {
    // dst does not exist at all – nothing to clean up
  }
  if (exists) {
    if (stat.isSymbolicLink()) {
      fs.unlinkSync(dst);
    } else {
      const backup = `${dst}.backup.${Date.now()}`;
      fs.renameSync(dst, backup);
      log(YELLOW, "!", `Backed up existing file: ${backup}`);
    }
  }
  fs.symlinkSync(src, dst);
}

/**
 * Remove a symlink only if it points into PLUGIN_ROOT.
 * Returns true if removed, false otherwise.
 */
function removePluginSymlink(dst) {
  try {
    const stat = fs.lstatSync(dst);
    if (stat.isSymbolicLink()) {
      const target = fs.readlinkSync(dst);
      if (target.startsWith(PLUGIN_ROOT)) {
        fs.unlinkSync(dst);
        return true;
      }
    }
  } catch {
    // doesn't exist
  }
  return false;
}

/**
 * Check symlink status. Returns object with exists, isSymlink, target, isOurs fields.
 */
function symlinkStatus(dst) {
  try {
    const stat = fs.lstatSync(dst);
    const isSymlink = stat.isSymbolicLink();
    const target = isSymlink ? fs.readlinkSync(dst) : null;
    return {
      exists: true,
      isSymlink,
      target,
      isOurs: isSymlink && target && target.startsWith(PLUGIN_ROOT),
    };
  } catch {
    return { exists: false, isSymlink: false, target: null, isOurs: false };
  }
}

function safeExec(command, args) {
  try {
    return execFileSync(command, args, { encoding: "utf8" }).trim();
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Config parsing and API connection test
// ---------------------------------------------------------------------------

/**
 * Parse config.toml content using lightweight regex extraction.
 * Returns defaults for any missing fields.
 */
function parseConfigTomlContent(content = "") {
  const result = {
    hostname: "",
    apiToken: "",
    verifySsl: false,
    connectionVerified: false,
    enableWriteTools: false,
  };

  if (!content) {
    return result;
  }

  const hostMatch = content.match(/hostname\s*=\s*"([^"]*)"/);
  const tokenMatch = content.match(/api_token\s*=\s*"([^"]*)"/);
  const sslMatch = content.match(/verify_ssl\s*=\s*(true|false)/);
  const verifiedMatch = content.match(
    /connection_verified\s*=\s*(true|false)/
  );
  const writeToolsMatch = content.match(
    /enable_write_tools\s*=\s*(true|false)/
  );

  if (hostMatch) result.hostname = hostMatch[1];
  if (tokenMatch) result.apiToken = tokenMatch[1];
  if (sslMatch) result.verifySsl = sslMatch[1] === "true";
  if (verifiedMatch) result.connectionVerified = verifiedMatch[1] === "true";
  if (writeToolsMatch)
    result.enableWriteTools = writeToolsMatch[1] === "true";

  return result;
}

/**
 * Parse config.toml and return config values.
 * Returns empty/default values if config.toml is missing or incomplete.
 */
function readConfigToml() {
  const configPath = path.join(PLUGIN_ROOT, "config.toml");
  try {
    return parseConfigTomlContent(fs.readFileSync(configPath, "utf8"));
  } catch {
    // config.toml missing or could not be read/parsed
    return parseConfigTomlContent("");
  }
}

/**
 * Make a single HTTPS GET request to the Orbit API.
 * @param {string} hostname - Orbit hostname (may include :port)
 * @param {string} apiPath - API path (e.g. "/api/v0/version")
 * @param {Object} options
 * @param {string} [options.token] - Bearer token for authenticated requests
 * @param {boolean} [options.verifySsl=false] - Whether to verify SSL certificates
 * @param {number} [options.timeout=10000] - Request timeout in ms
 * @returns {Promise<{ok: boolean, status: number, data: any, error: string}>}
 */
function orbitRequest(hostname, apiPath, options = {}) {
  const { token = "", verifySsl = false, timeout = 10000 } = options;

  return new Promise((resolve) => {
    let host = hostname;
    let port = 443;
    if (hostname.includes(":")) {
      const parts = hostname.split(":");
      host = parts[0];
      port = parseInt(parts[1], 10) || 443;
    }

    const reqOptions = {
      hostname: host,
      port,
      path: apiPath,
      method: "GET",
      timeout,
      headers: { Accept: "application/json" },
      rejectUnauthorized: verifySsl,
    };

    if (token) {
      reqOptions.headers.Authorization = `Bearer ${token}`;
    }

    const req = https.request(reqOptions, (res) => {
      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        let data = null;
        try {
          data = JSON.parse(body);
        } catch {
          data = body;
        }
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          data,
          error: "",
        });
      });
    });

    req.on("timeout", () => {
      req.destroy();
      resolve({
        ok: false,
        status: 0,
        data: null,
        error: `Connection timed out after ${timeout}ms`,
      });
    });

    req.on("error", (err) => {
      let errorMsg = err.message;
      if (err.code === "ECONNREFUSED") {
        errorMsg = `Connection refused: ${host}:${port} — is Orbit running?`;
      } else if (err.code === "ENOTFOUND") {
        errorMsg = `Host not found: ${host} — check hostname`;
      } else if (err.code === "ECONNRESET") {
        errorMsg = `Connection reset by ${host} — check network/firewall`;
      } else if (
        err.code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE" ||
        err.code === "DEPTH_ZERO_SELF_SIGNED_CERT"
      ) {
        errorMsg = `SSL certificate error: ${err.code} — verify_ssl is enabled but Orbit may use a self-signed cert`;
      }
      resolve({
        ok: false,
        status: 0,
        data: null,
        error: errorMsg,
      });
    });

    req.end();
  });
}

/**
 * Test connection to the Orbit API with health and auth checks.
 *
 * Performs two sequential checks:
 *   1. Health check — GET /api/v0/version (unauthenticated, verifies host reachability)
 *   2. Auth check  — GET /api/v0/robots  (authenticated, verifies token validity)
 *
 * Accepts explicit credentials (used by setup wizard) or reads from config.toml.
 *
 * @param {string} hostname - Orbit hostname or IP (with optional :port)
 * @param {string} apiToken - API bearer token
 * @param {boolean} [verifySsl=false] - Whether to verify SSL certificates
 * @returns {Promise<{success: boolean, health: Object, auth: Object|null, version: string, error: string}>}
 *   - success: true only if both health and auth checks pass
 *   - health:  { ok, status, data, error } from version endpoint
 *   - auth:    { ok, status, data, error } from robots endpoint (null if health failed)
 *   - version: Orbit version string (extracted from health response)
 *   - error:   Human-readable summary of what went wrong (empty on success)
 */
async function testOrbitConnection(hostname, apiToken, verifySsl = false) {
  const result = {
    success: false,
    health: null,
    auth: null,
    version: "",
    error: "",
  };

  // Validate minimum config
  if (!hostname) {
    result.error =
      "Orbit hostname not configured. Run 'spot-orbit-plugin setup'.";
    result.health = { ok: false, status: 0, data: null, error: result.error };
    return result;
  }

  if (!apiToken) {
    result.error =
      "API token not configured. Run 'spot-orbit-plugin setup'.";
    result.health = { ok: false, status: 0, data: null, error: result.error };
    return result;
  }

  // Step 1: Health check (unauthenticated — version endpoint)
  result.health = await orbitRequest(hostname, "/api/v0/version", {
    verifySsl,
  });

  if (!result.health.ok) {
    if (result.health.error) {
      result.error = `Health check failed: ${result.health.error}`;
    } else {
      result.error = `Health check returned HTTP ${result.health.status}`;
    }
    return result;
  }

  // Extract version from health response
  if (result.health.data && typeof result.health.data === "object") {
    result.version =
      result.health.data.version ||
      result.health.data.apiVersion ||
      JSON.stringify(result.health.data);
  } else {
    result.version = "(unknown)";
  }

  // Step 2: Auth check (authenticated — robots endpoint is lightweight)
  result.auth = await orbitRequest(hostname, "/api/v0/robots", {
    token: apiToken,
    verifySsl,
  });

  if (!result.auth.ok) {
    if (result.auth.status === 401 || result.auth.status === 403) {
      result.error = `Authentication failed (HTTP ${result.auth.status}) — check your API token`;
    } else if (result.auth.error) {
      result.error = `Auth check failed: ${result.auth.error}`;
    } else {
      result.error = `Auth check returned HTTP ${result.auth.status}`;
    }
    return result;
  }

  // Both checks passed
  result.success = true;
  return result;
}

/**
 * Test connection using credentials from config.toml (convenience wrapper).
 * @returns {Promise<{success: boolean, health: Object, auth: Object|null, version: string, error: string}>}
 */
async function testOrbitConnectionFromConfig() {
  const config = readConfigToml();
  return testOrbitConnection(
    config.hostname,
    config.apiToken,
    config.verifySsl
  );
}


/**
 * Create a shared readline interface for interactive prompts.
 * Must be closed by the caller when done.
 */
function createPromptInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

/**
 * Prompt the user with a yes/no question via readline.
 * Returns a Promise<boolean>. Defaults to `defaultYes` when user presses Enter.
 */
async function askYesNo(question, defaultYes = true) {
  const rl = createPromptInterface();
  try {
    return await askYesNoInput(rl, question, defaultYes);
  } finally {
    rl.close();
  }
}

// ---------------------------------------------------------------------------
// Input validation helpers
// ---------------------------------------------------------------------------

/**
 * Validate a hostname or IP address string.
 * Accepts: IPv4 (e.g. 192.168.80.3), hostnames (e.g. orbit.example.com),
 * and hostnames with optional port (e.g. orbit.example.com:8080).
 * Rejects: empty strings, strings with spaces, protocol prefixes.
 */
function validateHostname(value) {
  if (!value) {
    return { valid: false, message: "Hostname cannot be empty." };
  }
  // Strip protocol prefix if accidentally included
  if (/^https?:\/\//i.test(value)) {
    return {
      valid: false,
      message:
        "Do not include the protocol (https://). Enter just the hostname or IP.",
    };
  }
  if (/\s/.test(value)) {
    return { valid: false, message: "Hostname cannot contain spaces." };
  }
  // Must look like an IP or a valid hostname (with optional port)
  const hostnameRegex =
    /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)*[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(:\d{1,5})?$/;
  const ipv4Regex =
    /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d{1,5})?$/;
  if (!hostnameRegex.test(value) && !ipv4Regex.test(value)) {
    return {
      valid: false,
      message:
        "Invalid hostname format. Enter an IP address (e.g. 192.168.80.3) or hostname (e.g. orbit.example.com).",
    };
  }
  // Validate IPv4 octets if it looks like an IP
  if (ipv4Regex.test(value)) {
    const ipPart = value.split(":")[0];
    const octets = ipPart.split(".").map(Number);
    if (octets.some((o) => o < 0 || o > 255)) {
      return {
        valid: false,
        message: "Invalid IP address: each octet must be between 0 and 255.",
      };
    }
  }
  return { valid: true };
}

/**
 * Validate an API token string.
 * Accepts non-empty strings of reasonable length without spaces.
 */
function validateApiToken(value) {
  if (!value) {
    return { valid: false, message: "API token cannot be empty." };
  }
  if (/\s/.test(value)) {
    return { valid: false, message: "API token cannot contain spaces." };
  }
  if (value.length < 8) {
    return {
      valid: false,
      message: "API token seems too short (minimum 8 characters).",
    };
  }
  return { valid: true };
}

/**
 * Prompt the user for input with validation, retrying on invalid input.
 * @param {readline.Interface} rl - Shared readline interface
 * @param {string} prompt - The prompt text to display
 * @param {Object} options
 * @param {string} [options.defaultValue] - Default value when user presses Enter
 * @param {Function} [options.validate] - Validation function returning {valid, message}
 * @param {number} [options.maxAttempts=3] - Maximum retry attempts (0 = unlimited)
 * @returns {Promise<string>} The validated user input
 */
function askInput(rl, prompt, options = {}) {
  const { defaultValue = "", validate = null, maxAttempts = 3 } = options;
  let attempts = 0;

  return new Promise((resolve) => {
    const doAsk = () => {
      rl.question(prompt, (answer) => {
        const value = answer.trim() || defaultValue;
        attempts++;

        if (validate) {
          const result = validate(value);
          if (!result.valid) {
            log(RED, "✗", result.message);
            if (maxAttempts > 0 && attempts >= maxAttempts) {
              log(
                YELLOW,
                "!",
                `Maximum attempts (${maxAttempts}) reached. Using last input.`
              );
              resolve(value);
              return;
            }
            doAsk();
            return;
          }
        }

        resolve(value);
      });
    };
    doAsk();
  });
}

/**
 * Prompt for yes/no using an existing readline interface.
 * Returns a boolean and honors the provided default when Enter is pressed.
 */
async function askYesNoInput(rl, question, defaultYes = false) {
  const hint = defaultYes ? "[Y/n]" : "[y/N]";
  const answer = await askInput(rl, `${question} ${hint} `, {
    defaultValue: defaultYes ? "y" : "n",
    validate: (value) => {
      if (["y", "yes", "n", "no"].includes(value.toLowerCase())) {
        return { valid: true };
      }
      return { valid: false, message: "Enter y or n." };
    },
  });

  return answer.toLowerCase() === "y" || answer.toLowerCase() === "yes";
}

async function install() {
  console.log("\n=== Installing Spot Orbit Plugin ===\n");

  ensureDir(COMMANDS_DIR);
  ensureDir(AGENTS_DIR);
  ensureDir(SKILLS_DIR);
  ensureDir(HOOKS_DIR);

  // --- Commands ---
  console.log("Commands:");
  for (const cmd of COMMANDS) {
    const src = path.join(PLUGIN_ROOT, "commands", `${cmd}.md`);
    const dst = path.join(COMMANDS_DIR, `${cmd}.md`);
    if (!fs.existsSync(src)) {
      log(YELLOW, "!", `Source not found: commands/${cmd}.md`);
      continue;
    }
    createSymlink(src, dst);
    log(GREEN, "\u2713", `Command: /spot-orbit:${cmd}`);
  }

  // --- Agents ---
  console.log("\nAgents:");
  for (const agent of AGENTS) {
    const src = path.join(PLUGIN_ROOT, "agents", `${agent}.md`);
    const dst = path.join(AGENTS_DIR, `${agent}.md`);
    if (!fs.existsSync(src)) {
      log(YELLOW, "!", `Source not found: agents/${agent}.md`);
      continue;
    }
    createSymlink(src, dst);
    log(GREEN, "\u2713", `Agent: ${agent}`);
  }

  // --- Skills (directory symlinks) ---
  console.log("\nSkills:");
  for (const skill of SKILLS) {
    const src = path.join(PLUGIN_ROOT, "skills", skill);
    const dst = path.join(SKILLS_DIR, skill);
    if (!fs.existsSync(src)) {
      log(YELLOW, "!", `Source not found: skills/${skill}/`);
      continue;
    }
    createSymlink(src, dst);
    log(GREEN, "\u2713", `Skill: /${skill}`);
  }

  // --- Hooks ---
  console.log("\nHooks:");
  const hooksJsonSrc = path.join(PLUGIN_ROOT, "hooks", "hooks.json");
  const hooksJsonDst = path.join(HOOKS_DIR, "spot-orbit-hooks.json");
  if (fs.existsSync(hooksJsonSrc)) {
    createSymlink(hooksJsonSrc, hooksJsonDst);
    log(GREEN, "\u2713", "Hook config: spot-orbit-hooks.json");
  } else {
    log(YELLOW, "!", "Source not found: hooks/hooks.json");
  }

  // Symlink scripts directory so hook commands can reference scripts
  const scriptsSrc = path.join(PLUGIN_ROOT, "scripts");
  const scriptsDst = path.join(HOOKS_DIR, "spot-orbit-scripts");
  if (fs.existsSync(scriptsSrc)) {
    createSymlink(scriptsSrc, scriptsDst);
    log(GREEN, "\u2713", "Hook scripts: spot-orbit-scripts/");
  }

  // --- .mcp.json (project-level MCP registration) ---
  console.log("\nProject MCP config (.mcp.json):");
  if (projectMcpJsonNeedsUpdate()) {
    registerMcpInProjectJson();
    log(GREEN, "\u2713", "Updated .mcp.json (removed stale env/config)");
  } else if (isMcpRegisteredInProjectJson()) {
    log(GREEN, "\u2713", ".mcp.json already configured");
  } else {
    registerMcpInProjectJson();
    log(GREEN, "\u2713", "Registered orbit-api in .mcp.json");
  }

  console.log("\n=== Installation Complete ===\n");
  log(BLUE, "i", "Start a new Claude Code session to activate.\n");
  console.log("  Skills:");
  console.log("    /cert-setup             # Certificate generation");
  console.log("    /orbit-api              # Orbit REST API explorer");
  console.log("    /spot-explore           # Spot SDK docs/examples");
  console.log("    /spx-build              # SPX Extension builder\n");
  console.log("  Commands:");
  console.log("    /spot-orbit:status      # Connection status");
  console.log("    /spot-orbit:validate    # Validate SPX package");
  console.log("    /spot-orbit:version     # Check Orbit version\n");

  // Interactive prompt: offer to run setup wizard
  if (process.stdin.isTTY) {
    const runSetup = await askYesNo(
      "Would you like to configure Orbit credentials and MCP server now?"
    );
    if (runSetup) {
      await setup();
    } else {
      log(
        BLUE,
        "i",
        "Skipping setup. Run 'spot-orbit-plugin setup' later to configure.\n"
      );
    }
  } else {
    log(
      BLUE,
      "i",
      "Non-interactive mode detected. Run 'spot-orbit-plugin setup' to configure.\n"
    );
  }
}

// ---------------------------------------------------------------------------
// Settings.json helpers for MCP and hooks registration
// ---------------------------------------------------------------------------

/**
 * Read and parse a JSON file, returning null on failure.
 */
function readJsonFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

/**
 * Write a JSON file with pretty formatting.
 */
function writeJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

/**
 * Build the MCP server entry for orbit-api.
 * Use absolute paths for global settings.json and relative paths for project .mcp.json.
 */
function buildMcpServerEntry(options = {}) {
  const { absolute = true } = options;
  return {
    command: "python3",
    args: [
      absolute
        ? path.join(PLUGIN_ROOT, "scripts", "orbit-mcp-server.py")
        : "scripts/orbit-mcp-server.py",
    ],
  };
}

// ---------------------------------------------------------------------------
// .mcp.json helpers for project-level MCP registration
// ---------------------------------------------------------------------------

const PROJECT_MCP_JSON = path.join(PLUGIN_ROOT, ".mcp.json");

/**
 * Check if orbit-api MCP server is registered in .mcp.json.
 */
function isMcpRegisteredInProjectJson() {
  const data = readJsonFile(PROJECT_MCP_JSON);
  if (!data) return false;
  return !!(data.mcpServers && data.mcpServers["orbit-api"]);
}

/**
 * Register orbit-api MCP server in .mcp.json using a project-relative path.
 * Merges with existing entries without overwriting other servers.
 * Removes any env block to enforce config.toml as single credential source.
 */
function registerMcpInProjectJson() {
  let data = readJsonFile(PROJECT_MCP_JSON) || {};
  if (!data.mcpServers) {
    data.mcpServers = {};
  }
  // Build entry with project-relative path, no env block
  const entry = buildMcpServerEntry({ absolute: false });
  data.mcpServers["orbit-api"] = entry;
  writeJsonFile(PROJECT_MCP_JSON, data);
}

/**
 * Remove orbit-api MCP server from .mcp.json.
 * Returns true if removed, false otherwise.
 */
function unregisterMcpFromProjectJson() {
  const data = readJsonFile(PROJECT_MCP_JSON);
  if (!data || !data.mcpServers || !data.mcpServers["orbit-api"]) return false;
  delete data.mcpServers["orbit-api"];
  if (Object.keys(data.mcpServers).length === 0) {
    delete data.mcpServers;
  }
  // If file is now an empty object, remove it entirely
  if (Object.keys(data).length === 0) {
    try {
      fs.unlinkSync(PROJECT_MCP_JSON);
    } catch {
      // ignore
    }
  } else {
    writeJsonFile(PROJECT_MCP_JSON, data);
  }
  return true;
}

/**
 * Check if .mcp.json has stale config.
 * Returns true if an update is needed.
 */
function projectMcpJsonNeedsUpdate() {
  const data = readJsonFile(PROJECT_MCP_JSON);
  if (!data || !data.mcpServers || !data.mcpServers["orbit-api"]) return false;
  const entry = data.mcpServers["orbit-api"];
  if (entry.command !== "python3") return true;
  // Check for env block (should not exist — config.toml is single source of truth)
  if (entry.env) return true;
  const acceptedArgs = new Set([
    "scripts/orbit-mcp-server.py",
    path.join(PLUGIN_ROOT, "scripts", "orbit-mcp-server.py"),
  ]);
  if (!entry.args || !acceptedArgs.has(entry.args[0])) return true;
  return false;
}

/**
 * Build the hooks entries from hooks/hooks.json using absolute paths.
 * Returns the hooks object suitable for merging into settings.json.
 */
function buildHooksEntries() {
  const hooksJsonPath = path.join(PLUGIN_ROOT, "hooks", "hooks.json");
  if (!fs.existsSync(hooksJsonPath)) {
    return null;
  }
  try {
    const hooksData = JSON.parse(fs.readFileSync(hooksJsonPath, "utf8"));
    const hooks = hooksData.hooks || {};
    // Rewrite ${CLAUDE_PLUGIN_ROOT} references to absolute paths
    const result = {};
    for (const [event, matchers] of Object.entries(hooks)) {
      result[event] = matchers.map((matcher) => ({
        ...matcher,
        hooks: (matcher.hooks || []).map((hook) => ({
          ...hook,
          command: hook.command
            ? hook.command.replace(
                /\$\{CLAUDE_PLUGIN_ROOT\}/g,
                PLUGIN_ROOT
              )
            : hook.command,
        })),
      }));
    }
    return result;
  } catch {
    return null;
  }
}

/**
 * Check if orbit-api MCP server is already registered in a settings file.
 */
function isMcpRegistered(settingsPath) {
  const settings = readJsonFile(settingsPath);
  if (!settings) return false;
  return !!(settings.mcpServers && settings.mcpServers["orbit-api"]);
}

/**
 * Check if orbit hooks are already merged into a settings file.
 */
function areHooksMerged(settingsPath) {
  const settings = readJsonFile(settingsPath);
  if (!settings || !settings.hooks || !settings.hooks.PreToolUse) return false;
  const preToolUse = settings.hooks.PreToolUse;
  // Guard against PreToolUse being a non-array value (e.g. object or string)
  if (!Array.isArray(preToolUse)) return false;
  return preToolUse.some((matcher) =>
    (matcher.hooks || []).some((h) => isOrbitHook(h))
  );
}

/**
 * Register orbit-api MCP server in a settings.json file.
 * Merges without overwriting existing MCP servers.
 */
function registerMcpServer(settingsPath) {
  ensureDir(path.dirname(settingsPath));
  let settings = readJsonFile(settingsPath) || {};
  if (!settings.mcpServers) {
    settings.mcpServers = {};
  }
  settings.mcpServers["orbit-api"] = buildMcpServerEntry({ absolute: true });
  writeJsonFile(settingsPath, settings);
}

/**
 * Remove orbit-api MCP server from a settings.json file.
 * Returns true if removed, false otherwise.
 */
function unregisterMcpServer(settingsPath) {
  const settings = readJsonFile(settingsPath);
  if (!settings || !settings.mcpServers) return false;
  if (!settings.mcpServers["orbit-api"]) return false;
  delete settings.mcpServers["orbit-api"];
  if (Object.keys(settings.mcpServers).length === 0) {
    delete settings.mcpServers;
  }
  writeJsonFile(settingsPath, settings);
  return true;
}

/**
 * Merge orbit hooks into a settings.json file.
 * Appends to existing PreToolUse array without duplicating.
 */
function mergeHooks(settingsPath) {
  const pluginHooks = buildHooksEntries();
  if (!pluginHooks) return false;

  ensureDir(path.dirname(settingsPath));
  let settings = readJsonFile(settingsPath) || {};
  if (!settings.hooks) {
    settings.hooks = {};
  }

  for (const [event, matchers] of Object.entries(pluginHooks)) {
    if (!settings.hooks[event]) {
      // Event key doesn't exist yet — create empty array
      settings.hooks[event] = [];
    } else if (!Array.isArray(settings.hooks[event])) {
      // Event key exists but is not an array (e.g. single object or string) —
      // normalize to array to preserve existing data
      const existing = settings.hooks[event];
      settings.hooks[event] =
        existing && typeof existing === "object" ? [existing] : [];
    }
    for (const matcher of matchers) {
      const isDuplicate = settings.hooks[event].some((existing) =>
        (existing.hooks || []).some((h) => isOrbitHook(h))
      );
      if (!isDuplicate) {
        settings.hooks[event].push(matcher);
      }
    }
  }

  writeJsonFile(settingsPath, settings);
  return true;
}

/**
 * Test whether a single hook entry was installed by this plugin.
 * Matches on the plugin directory name ("spot-orbit") or the known
 * script basenames shipped in hooks/hooks.json.
 */
function isOrbitHook(hook) {
  if (!hook || !hook.command) return false;
  const cmd = hook.command;
  // Primary check: path contains the plugin directory name
  if (cmd.includes("spot-orbit")) return true;
  // Fallback: match the well-known script names shipped with the plugin
  const knownScripts = ["validate-spx.sh", "check-orbit-config.sh"];
  return knownScripts.some((s) => cmd.includes(s));
}

/**
 * Remove orbit hooks from a settings.json file.
 * Returns true if removed, false otherwise.
 */
function removeHooks(settingsPath) {
  const settings = readJsonFile(settingsPath);
  if (!settings || !settings.hooks) return false;
  let removed = false;
  for (const [event, matchers] of Object.entries(settings.hooks)) {
    if (!Array.isArray(matchers)) continue;
    const filtered = matchers.filter(
      (matcher) =>
        !(matcher.hooks || []).some((h) => isOrbitHook(h))
    );
    if (filtered.length !== matchers.length) {
      removed = true;
      settings.hooks[event] = filtered;
      if (filtered.length === 0) {
        delete settings.hooks[event];
      }
    }
  }
  if (removed) {
    if (Object.keys(settings.hooks).length === 0) {
      delete settings.hooks;
    }
    // If settings object is now empty, remove the file entirely
    if (Object.keys(settings).length === 0) {
      try {
        fs.unlinkSync(settingsPath);
      } catch {
        // Ignore – file may already be gone
      }
    } else {
      writeJsonFile(settingsPath, settings);
    }
  }
  return removed;
}

async function setup() {
  console.log("\n=== Spot Orbit Plugin Setup Wizard ===\n");

  const steps = { credentials: false, mcp: false, hooks: false };
  const GLOBAL_SETTINGS = path.join(CLAUDE_DIR, "settings.json");
  const PROJECT_SETTINGS = path.join(PLUGIN_ROOT, ".claude", "settings.json");

  // --- Step 0: Check prerequisites ---
  const commandsInstalled = COMMANDS.some((cmd) =>
    fs.existsSync(path.join(COMMANDS_DIR, `${cmd}.md`))
  );
  const agentsInstalled = AGENTS.some((agent) =>
    fs.existsSync(path.join(AGENTS_DIR, `${agent}.md`))
  );
  if (!commandsInstalled && !agentsInstalled) {
    log(
      YELLOW,
      "!",
      "Plugin symlinks not found. Run 'spot-orbit-plugin install' to create them."
    );
    log(YELLOW, "!", "Proceeding with setup anyway...\n");
  } else {
    log(GREEN, "\u2713", "Plugin symlinks detected.\n");
  }

  // --- Step 1: Credential configuration via config.toml (single source of truth) ---
  console.log(`${BLUE}Step 1/3:${NC} Orbit Credentials\n`);

  const configPath = path.join(PLUGIN_ROOT, "config.toml");
  const existingConfig = readConfigToml();
  const existingHostname = existingConfig.hostname;
  const existingToken = existingConfig.apiToken;
  const existingVerifySsl = existingConfig.verifySsl;
  const existingConnectionVerified = existingConfig.connectionVerified;
  const existingEnableWriteTools = existingConfig.enableWriteTools;
  // Only consider it a real existing config if hostname and token are non-placeholder values
  const hasExistingConfig =
    existingHostname &&
    existingToken &&
    existingHostname !== "your-orbit-hostname.com" &&
    existingToken !== "your-api-token-here";

  const rl = createPromptInterface();

  // If config already exists with real values, show current state and confirm overwrite
  let skipCredentials = false;
  if (hasExistingConfig) {
    log(BLUE, "i", "Existing config.toml found with credentials:");
    const maskedToken =
      existingToken.length > 8
        ? `${existingToken.slice(0, 8)}...${"*".repeat(4)}`
        : "****";
    const verifiedLabel = existingConnectionVerified
      ? "verified"
      : "unverified";
    const verifiedColor = existingConnectionVerified ? GREEN : YELLOW;
    console.log(`       Hostname:  ${existingHostname}`);
    console.log(`       Token:     ${maskedToken}`);
    console.log(`       SSL:       verify_ssl = ${existingVerifySsl}`);
    console.log(
      `       Writes:    enable_write_tools = ${existingEnableWriteTools}`
    );
    console.log(`       Status:    ${verifiedColor}${verifiedLabel}${NC}`);
    console.log("");

    const overwriteAnswer = await askYesNoInput(
      rl,
      "Update credentials and setup options?",
      false
    );

    if (!overwriteAnswer) {
      log(GREEN, "\u2713", "Keeping existing credentials.");
      skipCredentials = true;
    } else {
      log(BLUE, "i", "Enter new values (press Enter to keep current):\n");
    }
  }

  let hostname, apiToken;
  let verifySsl = existingVerifySsl;
  let enableWriteTools = existingEnableWriteTools;
  if (skipCredentials) {
    hostname = existingHostname;
    apiToken = existingToken;
  } else {
    const hostnamePrompt = existingHostname
      ? `Orbit hostname [${existingHostname}]: `
      : "Orbit hostname (e.g. 192.168.80.3 or orbit.example.com): ";
    hostname = await askInput(rl, hostnamePrompt, {
      defaultValue: existingHostname,
      validate: validateHostname,
    });

    const tokenPrompt = existingToken
      ? `API token [${existingToken.slice(0, 8)}...]: `
      : "API token: ";
    apiToken = await askInput(rl, tokenPrompt, {
      defaultValue: existingToken,
      validate: validateApiToken,
    });

    verifySsl = await askYesNoInput(
      rl,
      "Verify SSL certificates? (recommended for production, usually off for self-signed dev Orbit instances)",
      existingVerifySsl
    );

    enableWriteTools = await askYesNoInput(
      rl,
      "Enable Orbit write tools (POST/PATCH/DELETE)?",
      existingEnableWriteTools
    );
  }

  if (!hostname || !apiToken) {
    log(RED, "\u2717", "Hostname and API token are required.");
    log(
      BLUE,
      "i",
      "Run 'spot-orbit-plugin setup' again when you have credentials.\n"
    );
    rl.close();
    return;
  }

  // Sanitize values to prevent TOML injection (strip quotes and backslashes)
  const safeHostname = hostname.replace(/["\\]/g, "");
  const safeToken = apiToken.replace(/["\\]/g, "");
  const verifySslToml = verifySsl ? "true" : "false";
  const enableWriteToolsToml = enableWriteTools ? "true" : "false";

  // --- Connection test ---
  console.log("");
  if (skipCredentials) {
    log(BLUE, "i", "Credentials unchanged — skipping connection test.");
  } else {
    log(BLUE, "i", `Testing connection to ${safeHostname}...`);
  }
  const connResult = skipCredentials
    ? {
        success: existingConnectionVerified,
        version: existingConnectionVerified ? "(cached)" : "",
        error: existingConnectionVerified ? "" : "previously unverified",
        health: null,
        auth: null,
      }
    : await testOrbitConnection(
        safeHostname,
        safeToken,
        verifySsl
      );

  let connectionVerified = false;
  if (connResult.success) {
    connectionVerified = true;
    if (!skipCredentials) {
      log(GREEN, "\u2713", "Orbit reachable — health check passed");
      if (connResult.version) {
        log(GREEN, "\u2713", `Orbit version: ${connResult.version}`);
      }
      log(GREEN, "\u2713", "API token authenticated successfully");
    }
  } else {
    if (!skipCredentials) {
      log(YELLOW, "!", `Connection test failed: ${connResult.error}`);
      if (
        connResult.health &&
        connResult.health.ok &&
        connResult.auth &&
        !connResult.auth.ok
      ) {
        log(
          YELLOW,
          "!",
          "Orbit is reachable but authentication failed — check your API token."
        );
      }
      log(
        YELLOW,
        "!",
        "Credentials will be saved but marked as unverified."
      );
      log(
        BLUE,
        "i",
        "You can verify later with: /spot-orbit:version"
      );
    }
  }

  // Write config.toml (verify_ssl defaults to false, preserves existing value)
  // Skip write if credentials were not changed and connection status is the same
  if (skipCredentials && existingConnectionVerified === connectionVerified) {
    log(GREEN, "\u2713", "config.toml unchanged");
  } else {
    const tomlLines = [
      "[orbit]",
      `hostname = "${safeHostname}"`,
      `api_token = "${safeToken}"`,
      `verify_ssl = ${verifySslToml}`,
      `enable_write_tools = ${enableWriteToolsToml}`,
    ];
    if (!connectionVerified) {
      tomlLines.push(
        "# WARNING: connection was not verified during setup"
      );
      tomlLines.push("connection_verified = false");
    } else {
      tomlLines.push("connection_verified = true");
    }
    tomlLines.push("");
    const tomlContent = tomlLines.join("\n");
    fs.writeFileSync(configPath, tomlContent, "utf8");
    if (connectionVerified) {
      log(GREEN, "\u2713", "Credentials saved to config.toml (verified)");
    } else {
      log(YELLOW, "!", "Credentials saved to config.toml (unverified)");
    }
  }

  // Ensure config.toml is in .gitignore
  const gitignorePath = path.join(PLUGIN_ROOT, ".gitignore");
  if (fs.existsSync(gitignorePath)) {
    const gitignore = fs.readFileSync(gitignorePath, "utf8");
    if (!gitignore.includes("config.toml")) {
      fs.appendFileSync(gitignorePath, "\nconfig.toml\n", "utf8");
      log(GREEN, "\u2713", "Added config.toml to .gitignore");
    } else {
      log(GREEN, "\u2713", "config.toml already in .gitignore");
    }
  } else {
    fs.writeFileSync(gitignorePath, "config.toml\n", "utf8");
    log(GREEN, "\u2713", "Created .gitignore with config.toml");
  }
  steps.credentials = true;

  // --- Step 2: MCP Server Registration ---
  console.log(`\n${BLUE}Step 2/3:${NC} MCP Server Registration\n`);

  const mcpEntry = buildMcpServerEntry();
  log(BLUE, "i", `MCP server: python3 ${mcpEntry.args[0]}`);

  const globalMcpExists = isMcpRegistered(GLOBAL_SETTINGS);
  const projectMcpJsonExists = isMcpRegistered(PROJECT_MCP_JSON);

  if (globalMcpExists) {
    log(GREEN, "\u2713", "orbit-api already registered in global settings.json");
    steps.mcp = true;
    steps.mcpScope = "global";
  } else if (projectMcpJsonExists) {
    log(GREEN, "\u2713", "orbit-api already registered in project .mcp.json");
    steps.mcp = true;
    steps.mcpScope = "project";
  }

  if (!steps.mcp) {
    // Ask user where to register MCP server
    console.log("\n  Where should the MCP server be registered?");
    console.log(
      "  1) Global  (~/.claude/settings.json) \u2014 available in all projects"
    );
    console.log(
      "  2) Project (.mcp.json)               \u2014 this project only"
    );
    console.log("  3) Skip    \u2014 register manually later\n");

    const scopeAnswer = await askInput(rl, "MCP scope [1/2/3] (default: 1): ", {
      defaultValue: "1",
      validate: (v) => {
        if (["1", "2", "3"].includes(v)) return { valid: true };
        return { valid: false, message: "Enter 1, 2, or 3." };
      },
    });

    if (scopeAnswer === "1") {
      try {
        registerMcpServer(GLOBAL_SETTINGS);
        log(GREEN, "\u2713", "orbit-api registered in global settings.json");
        steps.mcp = true;
        steps.mcpScope = "global";
      } catch (err) {
        log(RED, "\u2717", `Failed to register MCP server: ${err.message}`);
      }
    } else if (scopeAnswer === "2") {
      try {
        registerMcpInProjectJson();
        log(GREEN, "\u2713", "orbit-api registered in project .mcp.json");
        steps.mcp = true;
        steps.mcpScope = "project";
      } catch (err) {
        log(RED, "\u2717", `Failed to register MCP server: ${err.message}`);
      }
    } else {
      log(YELLOW, "!", "Skipped MCP registration.");
      log(
        BLUE,
        "i",
        "Add orbit-api to mcpServers in settings.json or .mcp.json manually, or re-run setup."
      );
    }
  }

  // Always ensure .mcp.json has correct project config (no env block)
  if (projectMcpJsonNeedsUpdate()) {
    registerMcpInProjectJson();
    log(GREEN, "\u2713", "Updated .mcp.json (removed stale config)");
  } else if (!isMcpRegisteredInProjectJson() && steps.mcp) {
    // If MCP was registered elsewhere, also ensure .mcp.json is set up for project use
    registerMcpInProjectJson();
    log(GREEN, "\u2713", "Also registered orbit-api in .mcp.json for project-level access");
  }

  // --- Step 3: Hooks Merge ---
  console.log(`\n${BLUE}Step 3/3:${NC} PreToolUse Hooks\n`);

  const hooksJsonPath = path.join(PLUGIN_ROOT, "hooks", "hooks.json");
  if (!fs.existsSync(hooksJsonPath)) {
    log(YELLOW, "!", "hooks/hooks.json not found. Skipping hooks setup.");
  } else {
    const globalHooksExist = areHooksMerged(GLOBAL_SETTINGS);
    const projectHooksExist = areHooksMerged(PROJECT_SETTINGS);

    if (globalHooksExist || projectHooksExist) {
      const where = globalHooksExist ? "global" : "project";
      log(
        GREEN,
        "\u2713",
        `Orbit hooks already merged in ${where} settings.json`
      );
      steps.hooks = true;
    } else {
      log(
        BLUE,
        "i",
        "Hooks provide SPX validation and Orbit config checks on Bash commands."
      );

      const mergeAnswer = await askInput(
        rl,
        "Merge hooks into settings.json? [y/N]: ",
        {
          defaultValue: "n",
          validate: (v) => {
            if (["y", "yes", "n", "no"].includes(v.toLowerCase()))
              return { valid: true };
            return { valid: false, message: "Enter y or n." };
          },
        }
      );

      if (
        mergeAnswer.toLowerCase() === "y" ||
        mergeAnswer.toLowerCase() === "yes"
      ) {
        // Hooks always go in settings.json (not .mcp.json which only supports mcpServers)
        // Use project settings.json if MCP was registered at project scope, otherwise global
        const hookTarget =
          steps.mcpScope === "project"
            ? PROJECT_SETTINGS
            : GLOBAL_SETTINGS;
        try {
          const merged = mergeHooks(hookTarget);
          if (merged) {
            const where =
              hookTarget === GLOBAL_SETTINGS ? "global" : "project";
            log(GREEN, "\u2713", `Hooks merged into ${where} settings.json`);
            steps.hooks = true;
          } else {
            log(YELLOW, "!", "No hooks to merge (hooks.json may be empty).");
          }
        } catch (err) {
          log(RED, "\u2717", `Failed to merge hooks: ${err.message}`);
        }
      } else {
        log(YELLOW, "!", "Skipped hooks merge.");
        log(
          BLUE,
          "i",
          "You can merge hooks later by re-running 'spot-orbit-plugin setup'."
        );
      }
    }
  }

  rl.close();

  // --- Summary ---
  console.log("\n=== Setup Summary ===\n");

  if (steps.credentials && connectionVerified) {
    log(GREEN, "\u2713", `Credentials: config.toml (${safeHostname}) — verified`);
  } else if (steps.credentials) {
    log(YELLOW, "!", `Credentials: config.toml (${safeHostname}) — not verified`);
  } else {
    log(RED, "\u2717", "Credentials: not configured");
  }

  if (steps.mcp) {
    log(GREEN, "\u2713", "MCP Server: orbit-api registered");
  } else {
    log(
      YELLOW,
      "!",
      "MCP Server: not registered (run setup again or add manually)"
    );
  }

  if (steps.hooks) {
    log(GREEN, "\u2713", "Hooks: merged into settings.json");
  } else {
    log(YELLOW, "!", "Hooks: not merged (optional \u2014 re-run setup to add)");
  }

  log(
    enableWriteTools ? YELLOW : GREEN,
    enableWriteTools ? "!" : "\u2713",
    `Write tools: ${enableWriteTools ? "enabled" : "disabled"}`
  );

  const allDone = steps.credentials && steps.mcp;
  if (allDone) {
    console.log(`\n${GREEN}=== Setup Complete ===${NC}\n`);
    log(BLUE, "i", "Restart Claude Code to activate the MCP server.");
    log(BLUE, "i", "Test your connection: /spot-orbit:version\n");
  } else {
    console.log(`\n${YELLOW}=== Setup Partially Complete ===${NC}\n`);
    log(
      BLUE,
      "i",
      "Run 'spot-orbit-plugin setup' again to complete missing steps.\n"
    );
  }
}

async function uninstall() {
  console.log("\n=== Removing Spot Orbit Plugin ===\n");

  const GLOBAL_SETTINGS = path.join(CLAUDE_DIR, "settings.json");
  const PROJECT_SETTINGS = path.join(PLUGIN_ROOT, ".claude", "settings.json");

  // --- Commands ---
  console.log("Commands:");
  for (const cmd of COMMANDS) {
    const dst = path.join(COMMANDS_DIR, `${cmd}.md`);
    if (removePluginSymlink(dst)) {
      log(GREEN, "\u2713", `Removed: /spot-orbit:${cmd}`);
    }
  }

  // --- Agents ---
  console.log("\nAgents:");
  for (const agent of AGENTS) {
    const dst = path.join(AGENTS_DIR, `${agent}.md`);
    if (removePluginSymlink(dst)) {
      log(GREEN, "\u2713", `Removed: ${agent}`);
    }
  }

  // --- Skills ---
  console.log("\nSkills:");
  for (const skill of SKILLS) {
    const dst = path.join(SKILLS_DIR, skill);
    if (removePluginSymlink(dst)) {
      log(GREEN, "\u2713", `Removed: /${skill}`);
    }
  }

  // --- Hooks (symlinks) ---
  console.log("\nHooks:");
  const hooksJsonDst = path.join(HOOKS_DIR, "spot-orbit-hooks.json");
  if (removePluginSymlink(hooksJsonDst)) {
    log(GREEN, "\u2713", "Removed: spot-orbit-hooks.json");
  }
  const scriptsDst = path.join(HOOKS_DIR, "spot-orbit-scripts");
  if (removePluginSymlink(scriptsDst)) {
    log(GREEN, "\u2713", "Removed: spot-orbit-scripts/");
  }

  // --- MCP Server (settings.json and .mcp.json) ---
  console.log("\nMCP Server:");
  if (unregisterMcpServer(GLOBAL_SETTINGS)) {
    log(GREEN, "\u2713", "Removed orbit-api from global settings.json");
  }
  if (unregisterMcpServer(PROJECT_SETTINGS)) {
    log(GREEN, "\u2713", "Removed orbit-api from project settings.json");
  }
  if (unregisterMcpFromProjectJson()) {
    log(GREEN, "\u2713", "Removed orbit-api from project .mcp.json");
  }

  // --- Merged hooks (settings.json) ---
  console.log("\nMerged hooks:");
  const hasGlobalHooks = areHooksMerged(GLOBAL_SETTINGS);
  const hasProjectHooks = areHooksMerged(PROJECT_SETTINGS);
  if (hasGlobalHooks || hasProjectHooks) {
    let shouldRemoveHooks = true;
    if (process.stdin.isTTY) {
      shouldRemoveHooks = await askYesNo(
        "Remove orbit hooks from settings.json?",
        true
      );
    }
    if (shouldRemoveHooks) {
      if (hasGlobalHooks && removeHooks(GLOBAL_SETTINGS)) {
        log(GREEN, "\u2713", "Removed orbit hooks from global settings.json");
      }
      if (hasProjectHooks && removeHooks(PROJECT_SETTINGS)) {
        log(GREEN, "\u2713", "Removed orbit hooks from project settings.json");
      }
    } else {
      log(YELLOW, "!", "Kept orbit hooks in settings.json");
    }
  } else {
    log(YELLOW, "-", "No merged orbit hooks found in settings.json");
  }

  // --- config.toml ---
  console.log("\nConfig:");
  const configPath = path.join(PLUGIN_ROOT, "config.toml");
  if (fs.existsSync(configPath)) {
    if (process.stdin.isTTY) {
      const deleteConfig = await askYesNo(
        "Delete config.toml (contains your credentials)?",
        false
      );
      if (deleteConfig) {
        fs.unlinkSync(configPath);
        log(GREEN, "\u2713", "Deleted config.toml");
      } else {
        log(YELLOW, "!", "Kept config.toml (contains credentials)");
      }
    } else {
      log(YELLOW, "!", "Kept config.toml (delete manually if needed)");
    }
  }

  console.log("");
  log(GREEN, "\u2713", "Uninstall complete\n");
}

function status() {
  console.log("\n=== Spot Orbit Plugin Status ===\n");

  let installed = 0;
  let total = 0;

  // --- Commands ---
  console.log("Commands:");
  for (const cmd of COMMANDS) {
    total++;
    const dst = path.join(COMMANDS_DIR, `${cmd}.md`);
    const info = symlinkStatus(dst);
    if (info.isOurs) {
      log(GREEN, "\u2713", `/spot-orbit:${cmd} \u2192 ${info.target}`);
      installed++;
    } else if (info.exists) {
      log(
        YELLOW,
        "!",
        `/spot-orbit:${cmd} exists but is not a plugin symlink`
      );
    } else {
      log(RED, "\u2717", `/spot-orbit:${cmd} not installed`);
    }
  }

  // --- Agents ---
  console.log("\nAgents:");
  for (const agent of AGENTS) {
    total++;
    const dst = path.join(AGENTS_DIR, `${agent}.md`);
    const info = symlinkStatus(dst);
    if (info.isOurs) {
      log(GREEN, "\u2713", `${agent} \u2192 ${info.target}`);
      installed++;
    } else if (info.exists) {
      log(YELLOW, "!", `${agent} exists but is not a plugin symlink`);
    } else {
      log(RED, "\u2717", `${agent} not installed`);
    }
  }

  // --- Skills ---
  console.log("\nSkills:");
  for (const skill of SKILLS) {
    total++;
    const dst = path.join(SKILLS_DIR, skill);
    const info = symlinkStatus(dst);
    if (info.isOurs) {
      log(GREEN, "\u2713", `/${skill} \u2192 ${info.target}`);
      installed++;
    } else if (info.exists) {
      log(YELLOW, "!", `/${skill} exists but is not a plugin symlink`);
    } else {
      log(RED, "\u2717", `/${skill} not installed`);
    }
  }

  // --- Hooks ---
  console.log("\nHooks:");
  const hooksJsonDst = path.join(HOOKS_DIR, "spot-orbit-hooks.json");
  const hooksInfo = symlinkStatus(hooksJsonDst);
  total++;
  if (hooksInfo.isOurs) {
    log(GREEN, "\u2713", `spot-orbit-hooks.json \u2192 ${hooksInfo.target}`);
    installed++;
  } else if (hooksInfo.exists) {
    log(
      YELLOW,
      "!",
      "spot-orbit-hooks.json exists but is not a plugin symlink"
    );
  } else {
    log(RED, "\u2717", "spot-orbit-hooks.json not installed");
  }

  const scriptsDst = path.join(HOOKS_DIR, "spot-orbit-scripts");
  const scriptsInfo = symlinkStatus(scriptsDst);
  total++;
  if (scriptsInfo.isOurs) {
    log(GREEN, "\u2713", `spot-orbit-scripts/ \u2192 ${scriptsInfo.target}`);
    installed++;
  } else {
    log(RED, "\u2717", "spot-orbit-scripts/ not installed");
  }

  // --- Config status ---
  console.log("\nConfig:");
  const configPath = path.join(PLUGIN_ROOT, "config.toml");
  const config = readConfigToml();
  if (config.hostname || config.apiToken) {
    const verifiedLabel = config.connectionVerified
      ? "connection verified"
      : "connection NOT verified";
    const verifiedColor = config.connectionVerified ? GREEN : YELLOW;
    log(
      verifiedColor,
      config.connectionVerified ? "\u2713" : "!",
      `config.toml found (${verifiedLabel})`
    );
    log(
      config.verifySsl ? GREEN : YELLOW,
      config.verifySsl ? "\u2713" : "!",
      `verify_ssl = ${config.verifySsl}`
    );
    log(
      config.enableWriteTools ? YELLOW : GREEN,
      config.enableWriteTools ? "!" : "\u2713",
      `enable_write_tools = ${config.enableWriteTools}`
    );
  } else {
    log(
      YELLOW,
      "!",
      "config.toml not found (run 'spot-orbit-plugin setup' or './install.sh setup')"
    );
  }

  // --- MCP registration status ---
  console.log("\nMCP Server:");
  const GLOBAL_SETTINGS = path.join(CLAUDE_DIR, "settings.json");
  const PROJECT_SETTINGS = path.join(PLUGIN_ROOT, ".claude", "settings.json");
  const globalMcp = isMcpRegistered(GLOBAL_SETTINGS);
  const projectSettingsMcp = isMcpRegistered(PROJECT_SETTINGS);
  const projectMcpJson = isMcpRegisteredInProjectJson();
  const projectMcpJsonStale = projectMcpJson && projectMcpJsonNeedsUpdate();
  if (globalMcp) {
    log(GREEN, "\u2713", "orbit-api registered in global settings.json");
  } else if (projectSettingsMcp) {
    log(GREEN, "\u2713", "orbit-api registered in project settings.json");
  } else if (projectMcpJson && !projectMcpJsonStale) {
    log(GREEN, "\u2713", "orbit-api registered in project .mcp.json");
  } else if (projectMcpJsonStale) {
    log(
      YELLOW,
      "!",
      "orbit-api found in project .mcp.json, but the config is stale"
    );
  } else {
    log(
      YELLOW,
      "!",
      "orbit-api not registered in settings.json or .mcp.json (run 'spot-orbit-plugin setup' or './install.sh setup')"
    );
  }

  // --- .mcp.json status ---
  console.log("\nProject MCP (.mcp.json):");
  if (projectMcpJson) {
    if (projectMcpJsonStale) {
      log(
        YELLOW,
        "!",
        ".mcp.json has stale config (run 'spot-orbit-plugin setup' or './install.sh setup' to fix)"
      );
    } else {
      log(GREEN, "\u2713", ".mcp.json configured");
    }
  } else {
    log(
      YELLOW,
      "!",
      ".mcp.json not configured (run 'spot-orbit-plugin setup' or './install.sh setup')"
    );
  }

  // --- Hooks status ---
  console.log("\nSettings hooks:");
  const globalHooks = areHooksMerged(GLOBAL_SETTINGS);
  const projectHooks = areHooksMerged(PROJECT_SETTINGS);
  if (globalHooks) {
    log(GREEN, "\u2713", "Orbit hooks merged in global settings.json");
  } else if (projectHooks) {
    log(GREEN, "\u2713", "Orbit hooks merged in project settings.json");
  } else {
    log(
      YELLOW,
      "!",
      "Orbit hooks not merged (optional, run 'spot-orbit-plugin setup' or './install.sh setup')"
    );
  }

  console.log(`\n${installed}/${total} components installed\n`);
}

function doctor() {
  console.log("\n=== Spot Orbit Plugin Doctor ===\n");

  const pyVer = safeExec("python3", ["--version"]);
  if (pyVer) {
    log(GREEN, "\u2713", `Python: ${pyVer}`);
  } else {
    log(RED, "\u2717", "Python3 not found");
  }

  const tomli = safeExec("python3", [
    "-c",
    "try:\n import tomllib; print('tomllib')\nexcept ImportError:\n import tomli; print('tomli')",
  ]);
  if (tomli) {
    log(GREEN, "\u2713", `TOML parser: ${tomli}`);
  } else {
    log(YELLOW, "!", "tomli not installed (run: pip install tomli)");
  }

  const dockerVer = safeExec("docker", ["--version"]);
  if (dockerVer) {
    log(GREEN, "\u2713", `Docker: ${dockerVer}`);
  } else {
    log(YELLOW, "!", "Docker not found (needed for SPX builds)");
  }

  const sslVer = safeExec("openssl", ["version"]);
  if (sslVer) {
    log(GREEN, "\u2713", `OpenSSL: ${sslVer}`);
  } else {
    log(YELLOW, "!", "OpenSSL not found (needed for cert-setup)");
  }

  const configPath = path.join(PLUGIN_ROOT, "config.toml");
  if (fs.existsSync(configPath)) {
    log(GREEN, "\u2713", "config.toml found");
  } else {
    log(
      YELLOW,
      "!",
      "config.toml not found (run 'spot-orbit-plugin setup' or './install.sh setup')"
    );
  }

  if (fs.existsSync(CLAUDE_DIR)) {
    log(GREEN, "\u2713", `Claude Code directory: ${CLAUDE_DIR}`);
  } else {
    log(RED, "\u2717", "Claude Code directory not found");
  }

  console.log("");
}

// --- CLI Router ---
async function main() {
  const cmd = process.argv[2] || "install";

  switch (cmd) {
    case "install":
      await install();
      break;
    case "setup":
      await setup();
      break;
    case "uninstall":
    case "remove":
      await uninstall();
      break;
    case "status":
    case "check":
      status();
      break;
    case "doctor":
      doctor();
      break;
    case "help":
    case "--help":
    case "-h":
      console.log(
        "spot-orbit-plugin - Claude Code plugin for Boston Dynamics Orbit API\n"
      );
      console.log("Usage: spot-orbit-plugin <command>\n");
      console.log("Commands:");
      console.log("  install     Install plugin symlinks (default)");
      console.log("  setup       Configure Orbit credentials and MCP server");
      console.log("  uninstall   Remove all plugin symlinks");
      console.log("  status      Check installation status");
      console.log("  doctor      Verify dependencies");
      console.log("  help        Show this help");
      break;
    default:
      console.error(`Unknown command: ${cmd}`);
      console.error("Run 'spot-orbit-plugin help' for usage");
      process.exit(1);
  }
}

module.exports = {
  areHooksMerged,
  buildHooksEntries,
  buildMcpServerEntry,
  createSymlink,
  isOrbitHook,
  mergeHooks,
  parseConfigTomlContent,
  projectMcpJsonNeedsUpdate,
  readConfigToml,
  readJsonFile,
  registerMcpInProjectJson,
  registerMcpServer,
  removeHooks,
  removePluginSymlink,
  symlinkStatus,
  unregisterMcpFromProjectJson,
  unregisterMcpServer,
  validateApiToken,
  validateHostname,
  writeJsonFile,
};

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
