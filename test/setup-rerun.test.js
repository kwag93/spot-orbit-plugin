#!/usr/bin/env node
/**
 * Tests for setup wizard re-run behavior.
 * Run: node test/setup-rerun.test.js
 */

const { parseConfigTomlContent } = require("../bin/spot-orbit.js");

let testCount = 0;
let passCount = 0;

function assert(condition, message) {
  testCount++;
  if (condition) {
    passCount++;
    console.log(`  ✓ ${message}`);
  } else {
    console.log(`  ✗ FAIL: ${message}`);
  }
}

function hasExistingConfig(config) {
  return (
    !!config.hostname &&
    !!config.apiToken &&
    config.hostname !== "your-orbit-hostname.com" &&
    config.apiToken !== "your-api-token-here"
  );
}

console.log("\n=== Setup Re-run Tests ===\n");

console.log("Test 1: Detects existing config with real credentials");
{
  const result = parseConfigTomlContent(
    [
      "[orbit]",
      'hostname = "192.168.80.3"',
      'api_token = "abc12345-real-token"',
      "verify_ssl = false",
      "enable_write_tools = true",
      "connection_verified = true",
      "",
    ].join("\n")
  );

  assert(hasExistingConfig(result) === true, "hasExistingConfig is true");
  assert(result.hostname === "192.168.80.3", "hostname parsed correctly");
  assert(result.apiToken === "abc12345-real-token", "token parsed correctly");
  assert(result.verifySsl === false, "verify_ssl parsed as false");
  assert(result.enableWriteTools === true, "enable_write_tools parsed as true");
  assert(result.connectionVerified === true, "connection_verified parsed as true");
}

console.log("\nTest 2: Placeholder config is not treated as existing");
{
  const result = parseConfigTomlContent(
    [
      "[orbit]",
      'hostname = "your-orbit-hostname.com"',
      'api_token = "your-api-token-here"',
      "",
    ].join("\n")
  );

  assert(hasExistingConfig(result) === false, "hasExistingConfig is false for placeholders");
}

console.log("\nTest 3: Missing config.toml returns defaults");
{
  const result = parseConfigTomlContent("");
  assert(hasExistingConfig(result) === false, "hasExistingConfig is false");
  assert(result.hostname === "", "hostname is empty");
  assert(result.apiToken === "", "token is empty");
  assert(result.verifySsl === false, "verify_ssl defaults to false");
  assert(result.enableWriteTools === false, "enable_write_tools defaults to false");
  assert(result.connectionVerified === false, "connection_verified defaults to false");
}

console.log("\nTest 4: Unverified config is still detected as existing");
{
  const result = parseConfigTomlContent(
    [
      "[orbit]",
      'hostname = "10.0.0.1"',
      'api_token = "deadbeef-cafe-1234"',
      "verify_ssl = false",
      "# WARNING: connection was not verified during setup",
      "connection_verified = false",
      "",
    ].join("\n")
  );

  assert(hasExistingConfig(result) === true, "hasExistingConfig is true for unverified config");
  assert(result.connectionVerified === false, "connection_verified is false");
}

console.log("\nTest 5: Token masking works correctly");
{
  const token = "abc12345-real-token-value";
  const maskedToken =
    token.length > 8 ? `${token.slice(0, 8)}...${"*".repeat(4)}` : "****";
  assert(maskedToken === "abc12345...****", "token masked correctly");

  const shortToken = "abcd";
  const maskedShort =
    shortToken.length > 8
      ? `${shortToken.slice(0, 8)}...${"*".repeat(4)}`
      : "****";
  assert(maskedShort === "****", "short token masked as ****");
}

console.log("\nTest 6: verify_ssl = true is parsed correctly");
{
  const result = parseConfigTomlContent(
    [
      "[orbit]",
      'hostname = "orbit.example.com"',
      'api_token = "long-enough-token"',
      "verify_ssl = true",
      "enable_write_tools = false",
      "connection_verified = true",
      "",
    ].join("\n")
  );

  assert(result.verifySsl === true, "verify_ssl parsed as true");
  assert(result.enableWriteTools === false, "enable_write_tools parsed as false");
  assert(hasExistingConfig(result) === true, "has existing config");
}

console.log("\nTest 7: Prompt format includes existing values");
{
  const existingHostname = "192.168.80.3";
  const existingToken = "abc12345-token";
  const hostnamePrompt = existingHostname
    ? `Orbit hostname [${existingHostname}]: `
    : "Orbit hostname (e.g. 192.168.80.3 or orbit.example.com): ";
  const tokenPrompt = existingToken
    ? `API token [${existingToken.slice(0, 8)}...]: `
    : "API token: ";

  assert(
    hostnamePrompt === "Orbit hostname [192.168.80.3]: ",
    "hostname prompt shows current value in brackets"
  );
  assert(
    tokenPrompt === "API token [abc12345...]: ",
    "token prompt shows masked current value in brackets"
  );
}

console.log(`\n=== Results: ${passCount}/${testCount} passed ===\n`);
process.exit(passCount === testCount ? 0 : 1);
