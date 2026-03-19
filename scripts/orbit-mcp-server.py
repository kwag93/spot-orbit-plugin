#!/usr/bin/env python3
"""
Orbit MCP Server — Connects Claude Code to a live Orbit instance.

Provides native tool access to Orbit REST API endpoints.
Configure via config.toml in the plugin root directory.
Run 'spot-orbit-plugin setup' to create config.toml.
"""

import json
import os
import ssl
import sys
import urllib.parse
import urllib.request
import urllib.error

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

def load_config(config_path=None):
    """Load Orbit config from config.toml (single source of truth)."""
    hostname = ""
    token = ""
    verify_ssl = False
    enable_write_tools = False

    script_dir = os.path.dirname(os.path.abspath(__file__)) if '__file__' in dir() else os.getcwd()
    plugin_root = os.path.dirname(script_dir)
    config_path = config_path or os.path.join(plugin_root, "config.toml")

    try:
        try:
            import tomllib  # Python 3.11+
        except ImportError:
            import tomli as tomllib  # Fallback
    except ImportError:
        sys.stderr.write("Error: tomllib/tomli not available. Install tomli: pip install tomli\n")
        return hostname, token, verify_ssl, enable_write_tools

    try:
        with open(config_path, "rb") as f:
            config = tomllib.load(f)
        orbit = config.get("orbit", {})
        hostname = orbit.get("hostname", "")
        token = orbit.get("api_token", "")
        verify_ssl = orbit.get("verify_ssl", False)
        enable_write_tools = orbit.get("enable_write_tools", False)
    except FileNotFoundError:
        pass
    except Exception as exc:
        sys.stderr.write(
            f"Warning: failed to parse Orbit config at {config_path}: {exc}\n"
        )

    return hostname, token, verify_ssl, enable_write_tools


HOSTNAME, TOKEN, VERIFY_SSL, ENABLE_WRITE_TOOLS = load_config()

# SSL context — built once at startup since VERIFY_SSL never changes.
SSL_CTX = ssl.create_default_context()
if not VERIFY_SSL:
    SSL_CTX.check_hostname = False
    SSL_CTX.verify_mode = ssl.CERT_NONE


# ---------------------------------------------------------------------------
# Orbit API helpers
# ---------------------------------------------------------------------------

def orbit_request(method, path, data=None, params=None, auth_required=True):
    """HTTP request to Orbit API. Returns parsed JSON or error dict."""
    if not HOSTNAME:
        return {"error": "Orbit hostname not configured. Run 'spot-orbit-plugin setup' to configure config.toml."}
    if auth_required and not TOKEN:
        return {"error": "Orbit API token not configured. Run 'spot-orbit-plugin setup' to configure config.toml."}

    url = f"https://{HOSTNAME}/api/v0/{path.lstrip('/')}"
    if params:
        url += f"?{urllib.parse.urlencode(params, doseq=True)}"

    headers = {"Accept": "application/json"}
    if auth_required and TOKEN:
        headers["Authorization"] = f"Bearer {TOKEN}"

    body = None
    if data is not None:
        body = json.dumps(data).encode()
        headers["Content-Type"] = "application/json"

    req = urllib.request.Request(url, data=body, method=method, headers=headers)

    try:
        with urllib.request.urlopen(req, context=SSL_CTX, timeout=15) as resp:
            raw = resp.read().decode()
            return json.loads(raw) if raw else {"status": "success", "code": resp.status}
    except urllib.error.HTTPError as e:
        body_text = e.read().decode() if e.fp else ""
        return {"error": f"HTTP {e.code}: {e.reason}", "detail": body_text}
    except urllib.error.URLError as e:
        return {"error": f"Connection failed: {e.reason}"}
    except Exception as e:
        return {"error": str(e)}


def orbit_get(path, params=None, auth_required=True):
    """GET request to Orbit API. Returns parsed JSON or error dict."""
    return orbit_request("GET", path, params=params, auth_required=auth_required)


def orbit_post(path, data=None):
    """POST request to Orbit API. Returns parsed JSON or error dict."""
    return orbit_request("POST", path, data=data or {}, auth_required=True)


def orbit_delete(path):
    """DELETE request to Orbit API. Returns parsed JSON or error dict."""
    return orbit_request("DELETE", path, auth_required=True)


def orbit_patch(path, data=None):
    """PATCH request to Orbit API. Returns parsed JSON or error dict."""
    return orbit_request("PATCH", path, data=data or {}, auth_required=True)


def require_write_confirmation(arguments):
    """Block write actions unless they are enabled in config and explicitly confirmed."""
    if not ENABLE_WRITE_TOOLS:
        return {
            "error": (
                "Write tools are disabled. Set enable_write_tools = true in config.toml "
                "and restart Claude Code before using POST/PATCH/DELETE Orbit tools."
            )
        }
    if arguments.get("confirmed") is not True:
        return {
            "error": (
                "Write action blocked. Re-run only after the user explicitly confirmed "
                "this change, with confirmed=true."
            )
        }
    return None


# ---------------------------------------------------------------------------
# MCP Protocol (stdio JSON-RPC)
# ---------------------------------------------------------------------------

TOOLS = [
    {
        "name": "orbit_get_version",
        "description": "Get Orbit instance version. No authentication required.",
        "inputSchema": {"type": "object", "properties": {}, "required": []},
    },
    {
        "name": "orbit_get_robots",
        "description": "List all registered robots on the Orbit instance.",
        "inputSchema": {"type": "object", "properties": {}, "required": []},
    },
    {
        "name": "orbit_get_runs",
        "description": "Get recent mission runs. Optional limit parameter.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "limit": {"type": "integer", "description": "Max results (default 10)"},
            },
            "required": [],
        },
    },
    {
        "name": "orbit_get_run_events",
        "description": "Get run events (inspections, actions). Optional limit and run UUID filter.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "limit": {"type": "integer", "description": "Max results (default 20)"},
                "runUuid": {"type": "string", "description": "Filter by run UUID"},
            },
            "required": [],
        },
    },
    {
        "name": "orbit_get_anomalies",
        "description": "Get anomalies detected during missions.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "limit": {"type": "integer", "description": "Max results (default 20)"},
            },
            "required": [],
        },
    },
    {
        "name": "orbit_get_site_walks",
        "description": "Get all site walks (missions) configured on Orbit.",
        "inputSchema": {"type": "object", "properties": {}, "required": []},
    },
    {
        "name": "orbit_get_calendar",
        "description": "Get scheduled calendar events for mission automation.",
        "inputSchema": {"type": "object", "properties": {}, "required": []},
    },
    {
        "name": "orbit_get_webhooks",
        "description": "Get configured webhooks on the Orbit instance.",
        "inputSchema": {"type": "object", "properties": {}, "required": []},
    },
    {
        "name": "orbit_get_system_time",
        "description": "Get the Orbit instance system time and timezone.",
        "inputSchema": {"type": "object", "properties": {}, "required": []},
    },
    {
        "name": "orbit_api_call",
        "description": "Make a custom GET request to any Orbit API v0 endpoint.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "endpoint": {
                    "type": "string",
                    "description": "API endpoint path (e.g., 'robots', 'runs', 'run_events?limit=5')",
                },
            },
            "required": ["endpoint"],
        },
    },
    # --- WRITE TOOLS (require user confirmation) ---
    {
        "name": "orbit_create_webhook",
        "description": "[WRITE] Create a webhook on Orbit. Requires enable_write_tools = true and explicit user confirmation before calling.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "url": {"type": "string", "description": "Webhook callback URL"},
                "events": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Event types (e.g., ['ACTION_COMPLETED', 'RUN_STARTED'])",
                },
                "confirmed": {
                    "type": "boolean",
                    "description": "Must be true only after the user explicitly confirmed this write action.",
                },
            },
            "required": ["url", "events", "confirmed"],
        },
    },
    {
        "name": "orbit_delete_webhook",
        "description": "[WRITE] Delete a webhook by UUID. Requires enable_write_tools = true and explicit user confirmation before calling.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "uuid": {"type": "string", "description": "Webhook UUID to delete"},
                "confirmed": {
                    "type": "boolean",
                    "description": "Must be true only after the user explicitly confirmed this write action.",
                },
            },
            "required": ["uuid", "confirmed"],
        },
    },
    {
        "name": "orbit_update_anomaly",
        "description": "[WRITE] Update anomaly status (e.g., mark as resolved). Requires enable_write_tools = true and explicit user confirmation.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "uuid": {"type": "string", "description": "Anomaly UUID"},
                "status": {"type": "string", "description": "New status (e.g., 'approved', 'rejected')"},
                "confirmed": {
                    "type": "boolean",
                    "description": "Must be true only after the user explicitly confirmed this write action.",
                },
            },
            "required": ["uuid", "status", "confirmed"],
        },
    },
    {
        "name": "orbit_create_calendar_event",
        "description": "[WRITE] Create a scheduled calendar event for mission automation. Requires enable_write_tools = true and explicit user confirmation.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "schedule": {
                    "type": "object",
                    "description": "Schedule configuration object with siteWalkUuid, recurrence, etc.",
                },
                "confirmed": {
                    "type": "boolean",
                    "description": "Must be true only after the user explicitly confirmed this write action.",
                },
            },
            "required": ["schedule", "confirmed"],
        },
    },
    {
        "name": "orbit_delete_calendar_event",
        "description": "[WRITE] Delete a scheduled calendar event. Requires enable_write_tools = true and explicit user confirmation.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "eventId": {"type": "string", "description": "Calendar event ID to delete"},
                "confirmed": {
                    "type": "boolean",
                    "description": "Must be true only after the user explicitly confirmed this write action.",
                },
            },
            "required": ["eventId", "confirmed"],
        },
    },
    {
        "name": "orbit_add_robot",
        "description": "[WRITE] Register a new robot on Orbit. Requires enable_write_tools = true and explicit user confirmation.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "hostname": {"type": "string", "description": "Robot IP or hostname"},
                "username": {"type": "string", "description": "Robot username"},
                "password": {"type": "string", "description": "Robot password"},
                "nickname": {"type": "string", "description": "Display name for the robot"},
                "confirmed": {
                    "type": "boolean",
                    "description": "Must be true only after the user explicitly confirmed this write action.",
                },
            },
            "required": ["hostname", "username", "password", "confirmed"],
        },
    },
    {
        "name": "orbit_remove_robot",
        "description": "[WRITE] Remove a robot from Orbit. Requires enable_write_tools = true and explicit user confirmation.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "hostname": {"type": "string", "description": "Robot hostname to remove"},
                "confirmed": {
                    "type": "boolean",
                    "description": "Must be true only after the user explicitly confirmed this write action.",
                },
            },
            "required": ["hostname", "confirmed"],
        },
    },
]


WRITE_TOOLS = {
    "orbit_create_webhook",
    "orbit_delete_webhook",
    "orbit_update_anomaly",
    "orbit_create_calendar_event",
    "orbit_delete_calendar_event",
    "orbit_add_robot",
    "orbit_remove_robot",
}


def handle_tool_call(name, arguments):
    """Execute a tool and return the result."""
    # Pre-dispatch write confirmation check
    if name in WRITE_TOOLS:
        error = require_write_confirmation(arguments)
        if error:
            return error

    if name == "orbit_get_version":
        return orbit_get("version", auth_required=False)
    elif name == "orbit_get_robots":
        return orbit_get("robots")
    elif name == "orbit_get_runs":
        params = {}
        if arguments.get("limit"):
            params["limit"] = str(arguments["limit"])
        return orbit_get("runs", params or None)
    elif name == "orbit_get_run_events":
        params = {}
        if arguments.get("limit"):
            params["limit"] = str(arguments["limit"])
        if arguments.get("runUuid"):
            params["runUuid"] = arguments["runUuid"]
        return orbit_get("run_events", params or None)
    elif name == "orbit_get_anomalies":
        params = {}
        if arguments.get("limit"):
            params["limit"] = str(arguments["limit"])
        return orbit_get("anomalies", params or None)
    elif name == "orbit_get_site_walks":
        return orbit_get("site_walks")
    elif name == "orbit_get_calendar":
        return orbit_get("calendar/schedule")
    elif name == "orbit_get_webhooks":
        return orbit_get("webhooks")
    elif name == "orbit_get_system_time":
        return orbit_get("settings/system-time")
    elif name == "orbit_api_call":
        endpoint = arguments.get("endpoint", "")
        return orbit_get(endpoint)
    # --- WRITE TOOLS ---
    elif name == "orbit_create_webhook":
        return orbit_post("webhooks", {
            "url": arguments["url"],
            "events": arguments["events"],
            "enabled": True,
        })
    elif name == "orbit_delete_webhook":
        return orbit_delete(f"webhooks/{arguments['uuid']}")
    elif name == "orbit_update_anomaly":
        return orbit_patch(f"anomalies/{arguments['uuid']}", {
            "status": arguments["status"],
        })
    elif name == "orbit_create_calendar_event":
        return orbit_post("calendar/schedule", arguments["schedule"])
    elif name == "orbit_delete_calendar_event":
        return orbit_delete(f"calendar/schedule/{arguments['eventId']}")
    elif name == "orbit_add_robot":
        return orbit_post("robots", {
            "hostname": arguments["hostname"],
            "username": arguments["username"],
            "password": arguments["password"],
            "nickname": arguments.get("nickname", ""),
        })
    elif name == "orbit_remove_robot":
        return orbit_delete(f"robots/{arguments['hostname']}")
    else:
        return {"error": f"Unknown tool: {name}"}


def _send_message(response):
    """Write a JSON-RPC message to stdout with Content-Length framing."""
    msg = json.dumps(response)
    sys.stdout.write(f"Content-Length: {len(msg)}\r\n\r\n{msg}")
    sys.stdout.flush()


def send_response(response_id, result):
    """Send a JSON-RPC response."""
    _send_message({"jsonrpc": "2.0", "id": response_id, "result": result})


def send_error(response_id, code, message):
    """Send a JSON-RPC error response."""
    _send_message({
        "jsonrpc": "2.0",
        "id": response_id,
        "error": {"code": code, "message": message},
    })


def read_message():
    """Read a JSON-RPC message from stdin (Content-Length framing)."""
    headers = {}
    while True:
        line = sys.stdin.readline()
        if not line or line.strip() == "":
            break
        if ":" in line:
            key, value = line.split(":", 1)
            headers[key.strip()] = value.strip()

    content_length = int(headers.get("Content-Length", 0))
    if content_length == 0:
        return None

    body = sys.stdin.read(content_length)
    return json.loads(body)


def main():
    """MCP server main loop."""
    while True:
        try:
            message = read_message()
            if message is None:
                break

            method = message.get("method", "")
            msg_id = message.get("id")
            params = message.get("params", {})

            if method == "initialize":
                send_response(msg_id, {
                    "protocolVersion": "2024-11-05",
                    "capabilities": {"tools": {}},
                    "serverInfo": {
                        "name": "orbit-api",
                        "version": "1.0.0",
                    },
                })

            elif method == "notifications/initialized":
                pass  # No response needed

            elif method == "tools/list":
                send_response(msg_id, {"tools": TOOLS})

            elif method == "resources/list":
                send_response(msg_id, {"resources": []})

            elif method == "prompts/list":
                send_response(msg_id, {"prompts": []})

            elif method == "tools/call":
                tool_name = params.get("name", "")
                arguments = params.get("arguments", {})
                result = handle_tool_call(tool_name, arguments)
                send_response(msg_id, {
                    "content": [
                        {
                            "type": "text",
                            "text": json.dumps(result, indent=2, ensure_ascii=False),
                        }
                    ],
                })

            else:
                if msg_id is not None:
                    send_error(msg_id, -32601, f"Method not found: {method}")

        except Exception as e:
            sys.stderr.write(f"Error: {e}\n")
            if msg_id is not None:
                send_error(msg_id, -32603, str(e))


if __name__ == "__main__":
    main()
