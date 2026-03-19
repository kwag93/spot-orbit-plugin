# Spot Firewall Reference

Network firewall rules for Spot, Orbit, and operator connections.
Source: BD Support Article 71167

---

## Overview

This document lists required firewall rules by source node. Open only the ports listed for each node pair.

**Note on MAC address filtering**: If MAC filtering is enabled, whitelist both the WiFi MAC and the Ethernet MAC for each Spot robot.

---

## Spot → Outbound

| Destination | Port/Protocol | Purpose |
|---|---|---|
| Orbit | 443/TCP | HTTPS + WireGuard backup |
| Orbit | 51820/UDP | WireGuard VPN tunnel |
| bosdyn.com | 443/TCP | Telemetry (EU: eu.bosdyn.com) |
| DNS server | 53/UDP | DNS resolution |

**Proxy note**: If Spot connects through a proxy, configure the proxy address in Admin Console → Network Setup.

---

## Orbit Cloud → Outbound

| Destination | Port/Protocol | Purpose |
|---|---|---|
| Webhook endpoint | 443/TCP | Webhook delivery |

---

## Orbit Site Hub / VM → Outbound

| Destination | Port/Protocol | Purpose |
|---|---|---|
| SMTP server | 25/TCP (or configured) | Email notifications |
| orbit-svcs.bosdyn.com | 443/TCP | Enrollment, software downloads, AIVI, remote support |
| bosdyn.com | 443/TCP | Metrics reporting |
| SSO provider | 443/TCP | Single sign-on authentication |
| api.openweathermap.org | 443/TCP | Weather-aware scheduling |
| Webhook endpoint | 443/TCP | Webhook delivery |

**Proxy note**: Proxy settings for the Site Hub are configurable in Orbit → Settings → Network.

---

## Orbit for Enterprise → Outbound

| Destination | Port/Protocol | Purpose |
|---|---|---|
| Orbit site instances | 443/TCP | Fetch data from site deployments |

---

## Operator PC → Outbound

### To Orbit

| Destination | Port/Protocol | Purpose |
|---|---|---|
| Orbit | 443/TCP | HTTPS + WebRTC backup |
| SSO provider | 443/TCP | Authentication |
| Orbit | 31000–33000/UDP | WebRTC video streaming |

### To Spot (Direct)

| Destination | Port/Protocol | Purpose |
|---|---|---|
| Spot | 443/TCP | Admin Console |
| Spot Core I/O | 21443/TCP | Core I/O web interface |
| Spot | 21000–22000/TCP+UDP | Custom payload applications |

**Reserved port**: 21001/TCP is reserved for Orbit AI visual inspections. Do not use for custom apps.

---

## Spot Tablet → Outbound

| Destination | Port/Protocol | Purpose |
|---|---|---|
| Spot | 443/TCP | gRPC control |
| Spot | 31000–31100/UDP | WebRTC video streaming |
| Spot | 31102/TCP | WebRTC signaling |
| Spot Core I/O | 21443/TCP | Core I/O web interface |
| Spot | 22001–22099/TCP+UDP | Custom payload applications |

---

## Summary Table

| Source | Destination | Ports |
|---|---|---|
| Spot | Orbit | 443/TCP, 51820/UDP |
| Spot | bosdyn.com | 443/TCP |
| Spot | DNS | 53/UDP |
| Orbit Cloud | Webhook | 443/TCP |
| Orbit Site Hub | orbit-svcs.bosdyn.com | 443/TCP |
| Orbit Site Hub | bosdyn.com, SSO, weather, webhook, SMTP | 443/TCP |
| Orbit Enterprise | Orbit sites | 443/TCP |
| Operator PC | Orbit | 443/TCP, 31000–33000/UDP |
| Operator PC | Spot | 443/TCP, 21443/TCP, 21000–22000/TCP+UDP |
| Spot Tablet | Spot | 443/TCP, 21443/TCP, 31000–31100/UDP, 31102/TCP, 22001–22099/TCP+UDP |
