#!/usr/bin/env python3
"""
Tests for scripts/orbit-mcp-server.py
Run: python3 test/orbit-mcp-server.test.py
"""

from __future__ import annotations

import contextlib
import importlib.util
import io
from pathlib import Path
import tempfile


ROOT = Path(__file__).resolve().parents[1]
MODULE_PATH = ROOT / "scripts" / "orbit-mcp-server.py"


def load_module():
    spec = importlib.util.spec_from_file_location("orbit_mcp_server", MODULE_PATH)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


def main():
    module = load_module()

    # Test 1: version endpoint must be unauthenticated
    calls = []

    def fake_get(path, params=None, auth_required=True):
        calls.append((path, params, auth_required))
        return {"version": "4.1.1"}

    original_get = module.orbit_get
    module.orbit_get = fake_get
    result = module.handle_tool_call("orbit_get_version", {})
    assert result["version"] == "4.1.1"
    assert calls == [("version", None, False)]
    module.orbit_get = original_get

    # Test 2: write tools are blocked when disabled
    module.ENABLE_WRITE_TOOLS = False
    blocked = module.handle_tool_call(
        "orbit_create_webhook",
        {"url": "https://example.com/hook", "events": ["RUN_STARTED"], "confirmed": True},
    )
    assert "disabled" in blocked["error"]

    # Test 3: write tools require explicit confirmed=true
    module.ENABLE_WRITE_TOOLS = True
    unconfirmed = module.handle_tool_call(
        "orbit_create_webhook",
        {"url": "https://example.com/hook", "events": ["RUN_STARTED"]},
    )
    assert "confirmed=true" in unconfirmed["error"]

    # Test 4: confirmed writes pass through to the HTTP helper
    posted = []

    def fake_post(path, data=None):
        posted.append((path, data))
        return {"status": "ok"}

    original_post = module.orbit_post
    module.orbit_post = fake_post
    ok = module.handle_tool_call(
        "orbit_create_webhook",
        {"url": "https://example.com/hook", "events": ["RUN_STARTED"], "confirmed": True},
    )
    assert ok["status"] == "ok"
    assert posted == [
        (
            "webhooks",
            {
                "url": "https://example.com/hook",
                "events": ["RUN_STARTED"],
                "enabled": True,
            },
        )
    ]
    module.orbit_post = original_post

    # Test 5: malformed config falls back safely instead of crashing
    with tempfile.NamedTemporaryFile("w", delete=False) as tmp:
        tmp.write("[orbit]\nhostname = [\n")
        broken_path = tmp.name

    try:
        with contextlib.redirect_stderr(io.StringIO()):
            hostname, token, verify_ssl, enable_write_tools = module.load_config(
                broken_path
            )
        assert hostname == ""
        assert token == ""
        assert verify_ssl is False
        assert enable_write_tools is False
    finally:
        Path(broken_path).unlink(missing_ok=True)

    print("orbit-mcp-server tests passed")


if __name__ == "__main__":
    main()
