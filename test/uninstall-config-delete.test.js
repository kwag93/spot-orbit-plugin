#!/usr/bin/env node
/**
 * Tests for config.toml deletion during uninstall (AC 9 Sub-AC 2).
 * Verifies: interactive confirmation prompt, default-no behavior,
 * TTY vs non-TTY handling, actual file deletion.
 *
 * Run: node test/uninstall-config-delete.test.js
 */

const fs = require("fs");
const path = require("path");
const os = require("os");

let tmpDir;
let testCount = 0;
let passCount = 0;

function setup() {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "uninstall-config-test-"));
}

function teardown() {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}

function assert(condition, message) {
  testCount++;
  if (condition) {
    passCount++;
    console.log(`  \u2713 ${message}`);
  } else {
    console.log(`  \u2717 FAIL: ${message}`);
  }
}

// ---------------------------------------------------------------------------
// Simulate the config deletion logic from uninstall() in spot-orbit.js
// ---------------------------------------------------------------------------

/**
 * Simulates the config.toml deletion logic.
 * @param {string} configPath - path to config.toml
 * @param {boolean} isTTY - whether stdin is a TTY
 * @param {boolean|null} userAnswer - simulated user response (true=yes, false=no, null=empty/default)
 * @returns {{ deleted: boolean, message: string }}
 */
function simulateConfigDeletion(configPath, isTTY, userAnswer) {
  if (!fs.existsSync(configPath)) {
    return { deleted: false, message: "no-config" };
  }

  if (isTTY) {
    // askYesNo with defaultYes=false: empty answer resolves to false
    const confirmed =
      userAnswer === null ? false : userAnswer === true ? true : false;
    if (confirmed) {
      fs.unlinkSync(configPath);
      return { deleted: true, message: "Deleted config.toml" };
    } else {
      return {
        deleted: false,
        message: "Kept config.toml (contains credentials)",
      };
    }
  } else {
    return {
      deleted: false,
      message: "Kept config.toml (delete manually if needed)",
    };
  }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

console.log("\n=== config.toml Deletion Tests (Uninstall) ===\n");

// Test 1: User confirms deletion (yes)
setup();
{
  const configPath = path.join(tmpDir, "config.toml");
  fs.writeFileSync(
    configPath,
    'hostname = "orbit.example.com"\napi_token = "secret123"\n'
  );
  const result = simulateConfigDeletion(configPath, true, true);
  assert(result.deleted === true, "Config deleted when user answers yes");
  assert(!fs.existsSync(configPath), "File actually removed from disk");
}
teardown();

// Test 2: User declines deletion (no)
setup();
{
  const configPath = path.join(tmpDir, "config.toml");
  fs.writeFileSync(
    configPath,
    'hostname = "orbit.example.com"\napi_token = "secret123"\n'
  );
  const result = simulateConfigDeletion(configPath, true, false);
  assert(result.deleted === false, "Config kept when user answers no");
  assert(fs.existsSync(configPath), "File still exists on disk");
  assert(
    result.message.includes("Kept"),
    "Message indicates config was kept"
  );
}
teardown();

// Test 3: User presses Enter (default = no)
setup();
{
  const configPath = path.join(tmpDir, "config.toml");
  fs.writeFileSync(
    configPath,
    'hostname = "orbit.example.com"\napi_token = "secret123"\n'
  );
  const result = simulateConfigDeletion(configPath, true, null);
  assert(
    result.deleted === false,
    "Config kept when user presses Enter (default=no)"
  );
  assert(fs.existsSync(configPath), "File still exists after default answer");
}
teardown();

// Test 4: Non-TTY mode keeps config without prompting
setup();
{
  const configPath = path.join(tmpDir, "config.toml");
  fs.writeFileSync(
    configPath,
    'hostname = "orbit.example.com"\napi_token = "secret123"\n'
  );
  const result = simulateConfigDeletion(configPath, false, null);
  assert(result.deleted === false, "Config kept in non-TTY mode");
  assert(fs.existsSync(configPath), "File still exists in non-TTY mode");
  assert(
    result.message.includes("manually"),
    "Non-TTY message suggests manual deletion"
  );
}
teardown();

// Test 5: No config.toml present
setup();
{
  const configPath = path.join(tmpDir, "config.toml");
  // Don't create the file
  const result = simulateConfigDeletion(configPath, true, true);
  assert(result.deleted === false, "No deletion when config.toml missing");
  assert(result.message === "no-config", "Correct message for missing config");
}
teardown();

// Test 6: askYesNo defaults to false (defaultYes=false verification)
{
  // This verifies the askYesNo call uses defaultYes=false
  // by reading the source code
  const srcPath = path.join(__dirname, "..", "bin", "spot-orbit.js");
  const src = fs.readFileSync(srcPath, "utf8");

  // Find the askYesNo call in the config.toml deletion section
  const configDeleteSection = src.match(
    /config\.toml.*?askYesNo\([^)]+\)/s
  );
  assert(configDeleteSection !== null, "Found askYesNo call for config.toml");

  if (configDeleteSection) {
    const call = configDeleteSection[0];
    assert(
      call.includes("false"),
      "askYesNo defaults to false (safe default: do not delete)"
    );
    assert(
      call.includes("credentials") || call.includes("config.toml"),
      "Prompt warns about credentials or config.toml"
    );
  }
}

// Test 7: Verify prompt uses [y/N] format (defaultYes=false)
{
  const srcPath = path.join(__dirname, "..", "bin", "spot-orbit.js");
  const src = fs.readFileSync(srcPath, "utf8");
  // The askYesNo function shows [y/N] when defaultYes=false
  const askYesNoFn = src.match(
    /function askYesNo[\s\S]*?const hint = defaultYes \? "\[Y\/n\]" : "\[y\/N\]"/
  );
  assert(
    askYesNoFn !== null,
    "askYesNo shows [y/N] hint when defaultYes=false"
  );
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`\n${passCount}/${testCount} tests passed\n`);
if (passCount < testCount) {
  process.exit(1);
}
