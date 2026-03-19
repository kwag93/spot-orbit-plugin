# Orbit API Authentication Guide

## Overview

Orbit exposes two primary authentication mechanisms depending on how your application interacts with the API:

| Method | Transport | Typical Use Case |
|---|---|---|
| API Token | REST (HTTPS) | Automated scripts, integrations, server-side clients |
| Cookie-based | REST | Browser UI sessions, scraping, UI automation |

Choose **API Token** for any server-side or scripted automation. Use **Cookie-based** only when operating in a browser session context or UI automation.

---

## Method 1: API Token Authentication

API Token authentication is the recommended approach for REST API access. The `bosdyn-orbit` SDK handles header injection automatically once the token is provided.

### Basic Usage

```python
from bosdyn.orbit.client import Client

client = Client(hostname='your-orbit-hostname.com', verify=False)
client.authenticate_with_api_token(api_token)

# Use client methods
response = client.get_resource('/api/v0/robots')
```

The SDK attaches the token as a bearer header on every subsequent request. No manual header management is required.

### Generating a Token

1. Log in to the Orbit web UI with an administrator account.
2. Navigate to **Settings icon** → **Developer Features** → **API Access Tokens**.
3. Create a new token and copy the value immediately — it is only shown once.

Tokens are scoped to the account that created them and inherit that account's permissions. Rotate tokens periodically and revoke them when no longer needed.

### Supplying the Token

**Option A — Environment variable (recommended for CI/CD and containers):**

```bash
export BOSDYN_ORBIT_CLIENT_API_TOKEN="your-token-here"
```

The SDK reads this variable automatically if no token is passed explicitly.

**Option B — Configuration file (`config.toml`):**

```toml
[orbit]
api_token = "your-token-here"
```

Load the file in your application and pass the value to `authenticate_with_api_token()`.

**Option C — Direct argument:**

```python
client.authenticate_with_api_token("your-token-here")
```

Avoid hard-coding tokens in source files that are committed to version control.

---

## Method 2: Cookie-based Authentication

Cookie-based authentication is used for flows that mirror browser session behavior (e.g., scraping, UI automation). It involves a three-step handshake.

### Flow

**Step 1 — Fetch CSRF token**

```python
import requests

session = requests.Session()
session.verify = False

login_page = session.get('https://your-orbit-hostname.com/login')
csrf_token = login_page.cookies.get('csrftoken')
```

**Step 2 — POST credentials**

```python
payload = {
    'username': 'your-username',
    'password': 'your-password',
    'csrfmiddlewaretoken': csrf_token,
}

headers = {
    'Referer': 'https://your-orbit-hostname.com/login',
    'X-CSRFToken': csrf_token,
}

response = session.post(
    'https://your-orbit-hostname.com/api/v0/login',
    data=payload,
    headers=headers,
)
response.raise_for_status()
```

**Step 3 — Use the session**

The `session` object now holds the authenticated cookies. Pass it to any subsequent REST call:

```python
robots = session.get('https://your-orbit-hostname.com/api/v0/robots')
print(robots.json())
```

### CSRF Considerations

- The CSRF token must match between the cookie and the `X-CSRFToken` header on the POST.
- If Orbit returns `403 Forbidden` on the login POST, the CSRF token is either missing or stale — re-fetch `/login` and retry.
- CSRF tokens are tied to the session; do not reuse them across separate `Session` objects.

---

## Custom Client Wrapper Pattern

For production services, wrapping the SDK client adds error isolation and keeps API call sites clean.

```python
from bosdyn.orbit.client import Client
import logging
import traceback

logger = logging.getLogger(__name__)


class OrbitAPIClient:
    def __init__(self, hostname, access_token, verify=False):
        self.client = Client(hostname=hostname, verify=verify)
        self.client.authenticate_with_api_token(access_token)

    def get_resource_safe(self, path, params=None):
        try:
            return self.client.get_resource(path, params=params)
        except Exception as e:
            logger.error(f'[{path}] {traceback.format_exc()}')
            return None

    def get_robots(self):
        return self.get_resource_safe('/api/v0/robots')

    def get_robot_state(self, robot_id):
        return self.get_resource_safe(f'/api/v0/robot-state/{robot_id}')

    def get_site_walks(self):
        return self.get_resource_safe('/api/v0/site_walks')

    def get_system_time(self):
        return self.get_resource_safe('/api/v0/settings/system-time')
```

### Design Notes

- `get_resource_safe` catches all exceptions and returns `None` on failure, keeping callers free of try/except boilerplate.
- `traceback.format_exc()` captures the full stack trace in the log, which is critical for diagnosing network or deserialization errors in production.
- Call sites check for `None` before consuming the result:

```python
client = OrbitAPIClient(
    hostname=os.environ['ORBIT_HOST'],
    access_token=os.environ['BOSDYN_ORBIT_CLIENT_API_TOKEN'],
)

robots = client.get_robots()
if robots is None:
    # handle error
    raise RuntimeError('Failed to fetch robots from Orbit')
```

---

## SSL Verification

### When to Disable

```python
client = Client(hostname='your-orbit-hostname.com', verify=False)
```

`verify=False` skips TLS certificate validation. Use this only when:

- The Orbit instance uses a self-signed certificate (common in lab or on-premises deployments).
- You are operating on an isolated, trusted network where MITM attacks are not a concern.
- You are in early development and have not yet provisioned a valid certificate.

Disabling verification suppresses `InsecureRequestWarning` from `urllib3`. You can silence the warning explicitly if desired:

```python
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
```

### Production Setup

In production environments:

1. Obtain a certificate from a trusted CA (Let's Encrypt, your organization's PKI, etc.) for the Orbit hostname.
2. Set `verify=True` (the default) or pass the path to your CA bundle:

```python
client = Client(hostname='your-orbit-hostname.com', verify='/path/to/ca-bundle.crt')
```

3. Never commit `verify=False` in production configuration files or container images.

---

## API Token vs Cookie: Decision Matrix

| Requirement | API Token | Cookie-based |
|---|:---:|:---:|
| REST API calls | Yes | Yes |
| Browser session flows | No | Yes |
| Service-to-service automation | Yes | Not recommended |
| Browser/UI session reuse | No | Yes |
| No interactive login available | Yes | No |
| Minimal dependency footprint | Yes | No (requires session management) |
| Token rotation without code changes | Yes (env var) | N/A |

**Rule of thumb:** use API Token for automation. Use Cookie-based only for browser session flows or UI scraping.

---

## Troubleshooting

### HTTP 401 Unauthorized

- The token is missing, malformed, or has been revoked.
- Verify the token value is correct and has not expired.
- Confirm the environment variable `BOSDYN_ORBIT_CLIENT_API_TOKEN` is set in the process that runs your application (check with `echo $BOSDYN_ORBIT_CLIENT_API_TOKEN`).
- Re-generate a token in Admin Settings if needed.

### HTTP 406 Not Acceptable / HMAC Error

- This typically indicates a request signing mismatch. Some Orbit endpoints expect specific `Accept` or `Content-Type` headers.
- Ensure you are using the `bosdyn-orbit` SDK methods (`get_resource`, `post_resource`) rather than constructing raw requests, as the SDK sets correct headers.
- If constructing raw requests, include `Accept: application/json` and `Content-Type: application/json`.

### Token Expired or Invalidated

- Orbit API tokens do not have a fixed expiry by default, but they are invalidated when:
  - The generating account's password changes.
  - An administrator revokes the token explicitly.
  - The Orbit instance is re-provisioned.
- On `401` responses in long-running services, implement an alert or automatic re-authentication flow.

### Cookie Session Expired

- Browser sessions time out after a period of inactivity.
- For long-running processes that use cookie auth, re-authenticate and refresh the session when a `401` or redirect to `/login` is detected.

### SSL Handshake Errors

- If `verify=True` raises `SSLError`, the server certificate is not trusted by your system's CA store.
- Either install the appropriate CA certificate system-wide or pass it via `verify='/path/to/ca.crt'`.
- Do not switch to `verify=False` in production as a workaround.

### Connection Refused / Timeout

- Confirm the hostname is reachable: `curl -k https://your-orbit-hostname.com/api/v0/robots`.
- Verify firewall rules allow HTTPS (port 443) from your client host.

---

## Reference

- [Orbit Administration and Settings — Boston Dynamics Developer Documentation](https://dev.bostondynamics.com/docs/orbit/orbit_administration_and_settings)
- `bosdyn-orbit` Python SDK: `bosdyn.orbit.client.Client`
