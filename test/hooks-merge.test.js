#!/usr/bin/env node
/**
 * Tests for hooks merge logic in spot-orbit.js
 * Run: node test/hooks-merge.test.js
 */

const fs = require("fs");
const path = require("path");
const os = require("os");
const {
  areHooksMerged,
  buildHooksEntries,
  mergeHooks,
} = require("../bin/spot-orbit.js");

let tmpDir;
let testCount = 0;
let passCount = 0;

function setup() {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "hooks-merge-test-"));
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

console.log("\n=== Hooks Merge Logic Tests ===\n");

console.log("Test 1: Merge into non-existent settings.json");
setup();
{
  const settingsPath = path.join(tmpDir, "settings.json");
  const result = mergeHooks(settingsPath);
  const settings = readSettings(settingsPath);

  assert(result === true, "mergeHooks returns true");
  assert(settings.hooks !== undefined, "hooks key created");
  assert(Array.isArray(settings.hooks.PreToolUse), "PreToolUse is an array");
  assert(settings.hooks.PreToolUse.length === 1, "One matcher entry added");
  assert(settings.hooks.PreToolUse[0].matcher === "Bash", "Matcher is 'Bash'");
  assert(
    settings.hooks.PreToolUse[0].hooks.length === 2,
    "Two hook commands in matcher"
  );
  assert(
    settings.hooks.PreToolUse[0].hooks[0].command.includes("validate-spx"),
    "First hook is validate-spx"
  );
  assert(
    settings.hooks.PreToolUse[0].hooks[1].command.includes("check-orbit-config"),
    "Second hook is check-orbit-config"
  );
}
teardown();

console.log("\nTest 2: Append to existing PreToolUse array with other hooks");
setup();
{
  const settingsPath = path.join(tmpDir, "settings.json");
  writeSettings(settingsPath, {
    hooks: {
      PreToolUse: [
        {
          matcher: "Bash",
          hooks: [
            { type: "command", command: "bash /other/plugin/check.sh", timeout: 5 },
          ],
        },
      ],
    },
  });

  const result = mergeHooks(settingsPath);
  const settings = readSettings(settingsPath);

  assert(result === true, "mergeHooks returns true");
  assert(settings.hooks.PreToolUse.length === 2, "Two matcher entries total");
  assert(
    settings.hooks.PreToolUse[0].hooks[0].command.includes("/other/plugin/"),
    "First (existing) matcher preserved"
  );
  assert(
    settings.hooks.PreToolUse[1].hooks[0].command.includes("spot-orbit"),
    "Second (new) matcher is spot-orbit"
  );
}
teardown();

console.log("\nTest 3: Idempotent merge (no duplicates on re-run)");
setup();
{
  const settingsPath = path.join(tmpDir, "settings.json");
  mergeHooks(settingsPath);
  const countFirst = readSettings(settingsPath).hooks.PreToolUse.length;

  mergeHooks(settingsPath);
  const countSecond = readSettings(settingsPath).hooks.PreToolUse.length;

  assert(countFirst === 1, "One entry after first merge");
  assert(countSecond === 1, "Still one entry after second merge (no duplicate)");
}
teardown();

console.log("\nTest 4: areHooksMerged detection");
setup();
{
  const settingsPath = path.join(tmpDir, "settings.json");

  assert(areHooksMerged(settingsPath) === false, "Not merged before merge");

  mergeHooks(settingsPath);
  assert(areHooksMerged(settingsPath) === true, "Detected as merged after merge");
}
teardown();

console.log("\nTest 5: Non-array PreToolUse value normalization");
setup();
{
  const settingsPath = path.join(tmpDir, "settings.json");
  writeSettings(settingsPath, {
    hooks: {
      PreToolUse: {
        matcher: "Bash",
        hooks: [{ type: "command", command: "bash /legacy/hook.sh" }],
      },
    },
  });

  const result = mergeHooks(settingsPath);
  const settings = readSettings(settingsPath);

  assert(result === true, "mergeHooks returns true");
  assert(
    Array.isArray(settings.hooks.PreToolUse),
    "PreToolUse normalized to array"
  );
  assert(
    settings.hooks.PreToolUse.length === 2,
    "Both legacy and spot-orbit entries present"
  );
  assert(
    settings.hooks.PreToolUse[0].hooks[0].command.includes("/legacy/hook.sh"),
    "Legacy hook preserved"
  );
}
teardown();

console.log("\nTest 6: Preserve other settings keys");
setup();
{
  const settingsPath = path.join(tmpDir, "settings.json");
  writeSettings(settingsPath, {
    mcpServers: { existing: { command: "python3", args: ["server.py"] } },
    permissions: { allow: ["Bash"] },
  });

  mergeHooks(settingsPath);
  const settings = readSettings(settingsPath);

  assert(
    settings.mcpServers.existing.command === "python3",
    "mcpServers preserved"
  );
  assert(settings.permissions.allow[0] === "Bash", "permissions preserved");
  assert(Array.isArray(settings.hooks.PreToolUse), "Hooks added correctly");
}
teardown();

console.log("\nTest 7: areHooksMerged with non-array PreToolUse");
setup();
{
  const settingsPath = path.join(tmpDir, "settings.json");
  writeSettings(settingsPath, { hooks: { PreToolUse: { matcher: "Bash" } } });
  assert(
    areHooksMerged(settingsPath) === false,
    "Returns false for non-array PreToolUse"
  );
}
teardown();

console.log("\nTest 8: areHooksMerged with missing file");
setup();
{
  const settingsPath = path.join(tmpDir, "missing.json");
  assert(areHooksMerged(settingsPath) === false, "Returns false for missing file");
}
teardown();

console.log("\nTest 9: Hook commands use resolved paths");
{
  const entries = buildHooksEntries();
  assert(entries !== null, "buildHooksEntries returned hooks data");
  assert(
    !entries.PreToolUse[0].hooks[0].command.includes("${CLAUDE_PLUGIN_ROOT}"),
    "No template variable in first hook command"
  );
  assert(
    entries.PreToolUse[0].hooks[0].command.includes("validate-spx.sh"),
    "First hook command uses script path"
  );
  assert(
    entries.PreToolUse[0].hooks[0].command.includes("spot-orbit-plugin"),
    "First hook path points into plugin root"
  );
}

console.log(`\n=== Results: ${passCount}/${testCount} passed ===\n`);
process.exit(passCount === testCount ? 0 : 1);
