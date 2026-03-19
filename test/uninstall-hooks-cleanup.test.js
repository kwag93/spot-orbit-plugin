#!/usr/bin/env node
/**
 * Tests for merged hooks cleanup during uninstall.
 * Run: node test/uninstall-hooks-cleanup.test.js
 */

const fs = require("fs");
const path = require("path");
const os = require("os");
const { areHooksMerged, isOrbitHook, removeHooks } = require("../bin/spot-orbit.js");

let tmpDir;
let testCount = 0;
let passCount = 0;

function setup() {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "hooks-cleanup-test-"));
}

function teardown() {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}

function assert(condition, message) {
  testCount++;
  if (condition) {
    passCount++;
    console.log(`  ✓ ${message}`);
  } else {
    console.log(`  ✗ ${message}`);
  }
}

function writeSettings(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function readSettings(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

const PLUGIN_ROOT = path.resolve(__dirname, "..");

console.log("\n=== Uninstall Hooks Cleanup Tests ===\n");

console.log("Test 1: Remove orbit hooks while preserving other hooks");
setup();
{
  const settingsPath = path.join(tmpDir, "settings.json");
  writeSettings(settingsPath, {
    hooks: {
      PreToolUse: [
        {
          matcher: "Bash",
          hooks: [
            { type: "command", command: "bash /other/plugin/lint.sh", timeout: 5 },
          ],
        },
        {
          matcher: "Bash",
          hooks: [
            {
              type: "command",
              command: `bash ${PLUGIN_ROOT}/scripts/validate-spx.sh`,
              timeout: 15,
            },
            {
              type: "command",
              command: `bash ${PLUGIN_ROOT}/scripts/check-orbit-config.sh`,
              timeout: 10,
            },
          ],
        },
      ],
    },
  });

  const result = removeHooks(settingsPath);
  const settings = readSettings(settingsPath);

  assert(result === true, "removeHooks returns true");
  assert(settings.hooks.PreToolUse.length === 1, "One matcher entry remains");
  assert(
    settings.hooks.PreToolUse[0].hooks[0].command.includes("/other/plugin/"),
    "Non-orbit hook preserved"
  );
  assert(!areHooksMerged(settingsPath), "Orbit hooks no longer detected");
}
teardown();

console.log("\nTest 2: Clean up empty hooks object when only orbit hooks existed");
setup();
{
  const settingsPath = path.join(tmpDir, "settings.json");
  writeSettings(settingsPath, {
    mcpServers: { "some-server": { command: "python3" } },
    hooks: {
      PreToolUse: [
        {
          matcher: "Bash",
          hooks: [
            {
              type: "command",
              command: `bash ${PLUGIN_ROOT}/scripts/validate-spx.sh`,
              timeout: 15,
            },
          ],
        },
      ],
    },
  });

  const result = removeHooks(settingsPath);
  const settings = readSettings(settingsPath);

  assert(result === true, "removeHooks returns true");
  assert(settings.hooks === undefined, "Empty hooks key removed");
  assert(settings.mcpServers !== undefined, "Other settings keys preserved");
}
teardown();

console.log("\nTest 3: Settings file removed when empty after hook removal");
setup();
{
  const settingsPath = path.join(tmpDir, "settings.json");
  writeSettings(settingsPath, {
    hooks: {
      PreToolUse: [
        {
          matcher: "Bash",
          hooks: [
            {
              type: "command",
              command: `bash ${PLUGIN_ROOT}/scripts/validate-spx.sh`,
              timeout: 15,
            },
          ],
        },
      ],
    },
  });

  const result = removeHooks(settingsPath);

  assert(result === true, "removeHooks returns true");
  assert(!fs.existsSync(settingsPath), "Empty settings file removed");
}
teardown();

console.log("\nTest 4: No-op when no orbit hooks present");
setup();
{
  const settingsPath = path.join(tmpDir, "settings.json");
  writeSettings(settingsPath, {
    hooks: {
      PreToolUse: [
        {
          matcher: "Bash",
          hooks: [{ type: "command", command: "bash /other/check.sh", timeout: 5 }],
        },
      ],
    },
  });

  const result = removeHooks(settingsPath);
  const settings = readSettings(settingsPath);

  assert(result === false, "removeHooks returns false (nothing to remove)");
  assert(settings.hooks.PreToolUse.length === 1, "Existing hooks untouched");
}
teardown();

console.log("\nTest 5: No-op when settings file doesn't exist");
setup();
{
  const settingsPath = path.join(tmpDir, "nonexistent.json");
  assert(
    removeHooks(settingsPath) === false,
    "removeHooks returns false for missing file"
  );
}
teardown();

console.log("\nTest 6: No-op when settings has no hooks key");
setup();
{
  const settingsPath = path.join(tmpDir, "settings.json");
  writeSettings(settingsPath, { permissions: { allow: ["Bash"] } });
  assert(removeHooks(settingsPath) === false, "removeHooks returns false when no hooks key");
}
teardown();

console.log("\nTest 7: isOrbitHook matches known script names without spot-orbit in path");
setup();
{
  const settingsPath = path.join(tmpDir, "settings.json");
  writeSettings(settingsPath, {
    hooks: {
      PreToolUse: [
        {
          matcher: "Bash",
          hooks: [
            { type: "command", command: "bash /tmp/check-orbit-config.sh", timeout: 5 },
          ],
        },
      ],
    },
  });

  assert(removeHooks(settingsPath) === true, "Removes hooks matched by script basename");
  assert(!fs.existsSync(settingsPath), "Settings file cleaned up");
}
teardown();

console.log("\nTest 8: isOrbitHook does not match unrelated hooks");
{
  assert(isOrbitHook({ command: "bash /other/script.sh" }) === false, "Does not match unrelated script");
  assert(isOrbitHook({ command: "python app.py" }) === false, "Does not match python command");
  assert(isOrbitHook(null) === false, "Handles null hook");
  assert(isOrbitHook({}) === false, "Handles hook without command");
  assert(isOrbitHook({ command: "/Users/test/spot-orbit-plugin/scripts/x.sh" }) === true, "Matches spot-orbit in path");
  assert(isOrbitHook({ command: "bash /tmp/check-orbit-config.sh" }) === true, "Matches check-orbit-config.sh by name");
}

console.log("\nTest 9: Handles multiple hook event types");
setup();
{
  const settingsPath = path.join(tmpDir, "settings.json");
  writeSettings(settingsPath, {
    hooks: {
      PreToolUse: [
        {
          matcher: "Bash",
          hooks: [{ type: "command", command: `bash ${PLUGIN_ROOT}/scripts/validate-spx.sh` }],
        },
      ],
      PostToolUse: [
        {
          matcher: "Bash",
          hooks: [{ type: "command", command: "bash /other/report.sh" }],
        },
      ],
    },
  });

  const result = removeHooks(settingsPath);
  const settings = readSettings(settingsPath);

  assert(result === true, "removeHooks returns true");
  assert(settings.hooks.PreToolUse === undefined, "PreToolUse removed");
  assert(settings.hooks.PostToolUse !== undefined, "PostToolUse (non-orbit) preserved");
}
teardown();

console.log("\nTest 10: Non-array event values are skipped safely");
setup();
{
  const settingsPath = path.join(tmpDir, "settings.json");
  writeSettings(settingsPath, {
    hooks: {
      PreToolUse: { matcher: "Bash" },
      PostToolUse: [
        {
          matcher: "Bash",
          hooks: [{ type: "command", command: `bash ${PLUGIN_ROOT}/scripts/validate-spx.sh` }],
        },
      ],
    },
  });

  const result = removeHooks(settingsPath);
  const settings = readSettings(settingsPath);

  assert(result === true, "removeHooks returns true (removed PostToolUse orbit hook)");
  assert(!Array.isArray(settings.hooks?.PreToolUse), "Non-array PreToolUse left as-is");
}
teardown();

console.log(`\n=== Results: ${passCount}/${testCount} passed ===\n`);
process.exit(passCount === testCount ? 0 : 1);
