# Self-Signed Certificate Setup Guide for Orbit

## Overview

Orbit's web interface and HTTPS proxy for extension WebViews use TLS certificates configured
on the Orbit server itself. When deploying Orbit on-premise (Site Hub or VM), you may need to
replace the default self-signed certificate with one that your organization's devices trust.

> **Note**: Extensions do NOT need to handle TLS themselves. Orbit proxies extension HTTP
> traffic through its own HTTPS certificate (ports 22001-22100 → 22101-22200).
> This guide is for configuring **Orbit's own TLS certificate**, not extension containers.

Browsers and WebView components enforce secure contexts for modern APIs (camera, microphone,
clipboard, service workers, etc.), so the Orbit server's certificate must be trusted by
client devices.

This guide walks through:

1. Creating a local Root CA that your machines and test devices can trust
2. Issuing a server certificate signed by that Root CA
3. Installing the certificate on the Orbit server

---

## Prerequisites

- `openssl` 1.1.1 or later (`openssl version` to verify)
- A working directory you control (e.g., `certs/`) — keep it out of version control

---

## 1. Root CA Creation

The Root CA is the trust anchor. You generate it once, install it in your OS/browser trust
store, and then use it to sign any number of server certificates.

```bash
# Generate the Root CA private key (4096-bit RSA, AES-256 encrypted)
openssl genrsa -aes256 -out ca.key.pem 4096

# Self-sign the Root CA certificate (valid for 10 years)
openssl req -new -x509 -days 3650 -key ca.key.pem -sha256 -out ca.cert.pem
```

During `req`, you will be prompted for:

- **Passphrase** — protects `ca.key.pem`; choose a strong one and store it securely
- **Country, State, Locality** — arbitrary; use values meaningful to your team
- **Organization Name** — e.g., `My Dev CA`
- **Common Name** — e.g., `My Local Root CA`

**Output files:**

| File | Sensitivity | Purpose |
|---|---|---|
| `ca.key.pem` | Private — never share | Signs server certificates |
| `ca.cert.pem` | Public — install in trust stores | Validates the chain |

---

## 2. Server Certificate Creation

The Orbit server needs a certificate matching its hostname/IP. The certificate must include a
Subject Alternative Name (SAN) matching every hostname and IP address that clients will use
to connect to Orbit; modern browsers ignore the Common Name field for this purpose.

### 2a. Create the SAN configuration file

Create `san.cnf` in your working directory:

```ini
[ req ]
default_bits       = 2048
distinguished_name = req_distinguished_name
req_extensions     = v3_req
prompt             = no

[ req_distinguished_name ]
CN = orbit-hostname.local

[ v3_req ]
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = orbit-hostname.local
IP.1  = 192.168.1.100
```

Add or remove `DNS.*` and `IP.*` entries to match your environment. For example:

```ini
DNS.1 = orbit-hostname.local
DNS.2 = localhost
IP.1  = 192.168.1.100
IP.2  = 127.0.0.1
```

### 2b. Generate the server key and CSR

```bash
# Generate the server private key (2048-bit RSA, no passphrase for automated startup)
openssl genrsa -out server.key.pem 2048

# Create the Certificate Signing Request
openssl req -new -key server.key.pem -out server.csr.pem -config san.cnf
```

### 2c. Sign the server certificate with the Root CA

```bash
openssl x509 -req \
  -in server.csr.pem \
  -CA ca.cert.pem \
  -CAkey ca.key.pem \
  -CAcreateserial \
  -out server.crt.pem \
  -days 365 \
  -sha256 \
  -extfile san.cnf \
  -extensions v3_req
```

You will be prompted for the CA key passphrase.

**Output files:**

| File | Sensitivity | Purpose |
|---|---|---|
| `server.key.pem` | Private | Loaded by the Orbit server |
| `server.crt.pem` | Public | Sent to clients during TLS handshake |
| `server.csr.pem` | Intermediate | Can be deleted after signing |

---

## 3. SAN Configuration Reference

The `[alt_names]` section supports the following entry types:

```ini
[alt_names]
# Hostnames
DNS.1 = orbit-hostname.local
DNS.2 = localhost

# IPv4 addresses
IP.1 = 192.168.1.100
IP.2 = 127.0.0.1

# IPv6 addresses
IP.3 = ::1
```

Use `DNS.*` for hostnames that resolve via DNS or `/etc/hosts`. Use `IP.*` for direct
IP access. Increment the numeric suffix for each additional entry.

---

## 4. Installing the Certificate on Orbit

### 4a. Upload via Orbit Admin Settings

Upload the generated certificate and key through the Orbit web UI:

1. Navigate to **Settings → Certificates** on the Orbit instance
2. Upload `server.crt.pem` as the SSL certificate
3. Upload `server.key.pem` as the SSL private key
4. Upload `ca.cert.pem` as the CA certificate (if required)
5. Restart the Orbit service to apply

### 4b. Site Hub certificate extraction (alternative)

Site Hub bundles its certificate in a PKCS#12 file. See `docs/bd-support-articles.md` (Certificate Management section) for extraction steps.

> **Note on extensions**: Extensions do NOT need their own TLS certificates.
> Orbit proxies extension HTTP (ports 22101-22200) as HTTPS (ports 22001-22100)
> using the same certificate configured on the Orbit server.

### 4c. (Legacy) Mount certificates in extension container

Only needed if the extension serves HTTPS **directly** without Orbit's proxy
(e.g., non-WebView integrations or standalone services):

```yaml
services:
  orbit-extension:
    volumes:
      - ./certs/server.crt.pem:/etc/certs/server.crt.pem:ro
      - ./certs/server.key.pem:/etc/certs/server.key.pem:ro
```

Keep `ca.key.pem` off the container — it is only needed to sign certificates, not to serve them.

### 4d. Install the Root CA in your trust store

For the Orbit WebView (and your development browser) to accept the certificate without
warnings, install `ca.cert.pem` as a trusted Root CA:

- **macOS**: `sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ca.cert.pem`
- **Linux (Debian/Ubuntu)**: Copy to `/usr/local/share/ca-certificates/` and run `sudo update-ca-certificates`
- **Windows**: `certutil -addstore Root ca.cert.pem`

On test devices, distribute `ca.cert.pem` and repeat the appropriate step.

---

## 5. Important Notes

- **Development and testing only.** Self-signed certificates are not trusted by the public
  internet. For any environment reachable by end users, obtain a certificate from a recognised
  public CA (e.g., via ACME/Let's Encrypt or a commercial provider).

- **Protect the CA key.** Anyone who obtains `ca.key.pem` and its passphrase can issue
  certificates trusted by every machine that has installed your Root CA. Store the file outside
  version control and restrict filesystem permissions (`chmod 600 ca.key.pem`).

- **Delete CSR files after signing.** `server.csr.pem` is a one-time intermediary. Once you
  have `server.crt.pem`, the CSR serves no further purpose and can be removed.

- **Certificate expiry.** The server certificate is valid for 365 days. Set a calendar reminder
  to renew it before expiry. Regenerate `server.key.pem`, `server.csr.pem`, and `server.crt.pem`
  following steps 2b and 2c; the Root CA and its trust store installations remain valid.

- **Passphrase management.** The CA key passphrase must be entered interactively whenever you
  sign a new certificate. Store it in a password manager rather than in a script or environment
  variable.

---

## Quick Reference: File Summary

| File | Keep? | Share? | Notes |
|---|---|---|---|
| `ca.key.pem` | Yes | No | Root CA private key — store securely |
| `ca.cert.pem` | Yes | Yes | Install in trust stores |
| `ca.srl` | Yes | No | CA serial number tracker — auto-created |
| `server.key.pem` | Yes | No | Upload to Orbit server |
| `server.crt.pem` | Yes | Yes | Upload to Orbit server |
| `server.csr.pem` | Delete | No | Only needed during signing |
| `san.cnf` | Yes | Optional | Reuse when renewing the server cert |
