---
name: cert-setup
description: Generate self-signed certificates for the Orbit server. Activates on "cert", "certificate", "ssl", "https setup", "tls", "ca generation".
argument-hint: "[ca <org-name>|server <org-name>|guide]"
---

# Certificate Setup Helper

Generate self-signed Root CA and server certificates for the Orbit server's HTTPS configuration.

<!-- LLM Context -->
<!-- Use_When: User needs HTTPS certificates for the Orbit server, Orbit's WebView proxy requires trusted TLS, or user asks about SSL/TLS setup -->
<!-- Do_Not_Use: Orbit API calls (use orbit-api), SPX packaging (use spx-build) -->
<!-- Requires: openssl command-line tools installed -->
<!-- References: docs/cert-setup-guide.md, docs/troubleshooting.md (HTTPS section) -->
<!-- Note: For development/testing only. Production should use public CA certificates -->

## Usage

```text
/cert-setup                         # Interactive mode
/cert-setup ca my-org               # Generate Root CA
/cert-setup server my-org           # Generate server certificate
/cert-setup guide                   # Show certificate setup guide
```

## Execution

### `ca <org-name>` — Generate Root CA

Create a Root CA for signing server certificates:

```bash
# Create directory structure
mkdir -p ${ORG}CA/{private,certs,csr}

# Generate CA private key (passphrase-protected)
openssl genrsa -aes256 -out ${ORG}CA/private/ca.key.pem 4096

# Generate CA certificate (10-year validity)
openssl req -new -x509 -days 3650 \
  -key ${ORG}CA/private/ca.key.pem \
  -sha256 \
  -out ${ORG}CA/certs/ca.cert.pem \
  -subj "/C=XX/ST=State/L=City/O=${ORG}/OU=DevOps/CN=${ORG} Root CA"
```

Prompt the user for:
- Organization name
- Passphrase (required for key protection)
- Country, State, City (optional, defaults provided)

### `server <org-name>` — Generate Server Certificate

Create a server certificate signed by the Root CA:

```bash
# Generate server key
openssl genrsa -out ${ORG}CA/private/${SERVER}.key.pem 2048

# Create SAN configuration
cat > /tmp/san.cnf << EOF
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req

[req_distinguished_name]

[v3_req]
subjectAltName = @alt_names

[alt_names]
DNS.1 = ${SERVER_FQDN}
IP.1 = ${SERVER_IP}
EOF

# Create CSR
openssl req -new \
  -key ${ORG}CA/private/${SERVER}.key.pem \
  -out ${ORG}CA/csr/${SERVER}.csr.pem \
  -subj "/C=XX/ST=State/L=City/O=${ORG}/CN=${SERVER_FQDN}"

# Sign with CA
openssl x509 -req \
  -in ${ORG}CA/csr/${SERVER}.csr.pem \
  -CA ${ORG}CA/certs/ca.cert.pem \
  -CAkey ${ORG}CA/private/ca.key.pem \
  -CAcreateserial \
  -out ${ORG}CA/certs/${SERVER}.crt.pem \
  -days 365 -sha256 \
  -extfile /tmp/san.cnf -extensions v3_req
```

Prompt the user for:
- Server FQDN or hostname
- IP addresses for SAN
- CA passphrase (to sign the certificate)

### `guide` — Certificate Setup Guide

Read and display `docs/cert-setup-guide.md`.

## Output Files

| File | Purpose |
|------|---------|
| `{org}CA/private/ca.key.pem` | CA private key (keep secure) |
| `{org}CA/certs/ca.cert.pem` | CA public certificate |
| `{org}CA/private/{server}.key.pem` | Server private key |
| `{org}CA/certs/{server}.crt.pem` | Server certificate |
| `{org}CA/csr/{server}.csr.pem` | CSR (can delete after signing) |

## Installing on Orbit

Upload the generated certificate via **Orbit Admin Settings → Certificates**.
Orbit uses this certificate for its web UI and for proxying extension WebViews (HTTPS ports 22001-22100).

> Extensions serve plain HTTP. They do NOT need their own certificates.

## Important

- For **development/testing only** — use a public CA for production
- This certificate is installed on the **Orbit server itself**, not in extension containers
- Orbit proxies extension HTTP (22101-22200) as HTTPS (22001-22100) using this certificate
- Extensions do NOT need to handle TLS directly — they serve plain HTTP
- See `docs/cert-setup-guide.md` for detailed walkthrough

## Documentation References

- `docs/cert-setup-guide.md` — Full certificate generation guide
- `docs/troubleshooting.md` — HTTPS and Custom Web Views section

Task: $ARGUMENTS
