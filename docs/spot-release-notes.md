# Spot Release Notes

Software release history for Spot and Orbit.
Source: BD Support Articles 171877 (v5.0), 89251 (v4.1), 214118 (v5.1)

---

## Spot 5.1 Release Notes (Article 214118)

### v5.1.4 (March 2026)

- Flexible software deployment from Orbit (pre-bundled and manual bundles)
- Proxy settings improvements for Site Hub and Spot
- ROI (region of interest) editing in thermal inspection views
- "Take Control" button renamed for clarity

### v5.1.3 (February 2026)

- **CRITICAL FIX**: Resolved factory reset boot failure bug present in v5.1.0–v5.1.2
- Robots running any v5.1.x version must update to v5.1.3+ before performing a factory reset

### v5.1.2 (February 2026)

- Fixed camera black-and-white display issue
- Resolved log size reporting errors
- Site View bug fixes

### v5.1.1 (January 2026)

- Face blur in captured images
- Dashboard display fixes
- Robot deletion fix
- Resolved excessive log generation issue

### v5.1.0 (December 2025)

**Robot**
- Demo dances available for all Spot configurations
- Automated door opening support
- Mission interrupts via fiducials 585 (pause) and 586 (resume)
- DTC (Diagnostic Trouble Code) codes for fault identification
- AIVI (AI Visual Inspection) support for body cameras and gripper camera
- Expert AIVI models for specialized inspection tasks
- L642 acoustic inspection sensor support
- Change detection alerts in inspection workflows

**Orbit**
- Orbit software download management (v5.0+ OTA deployment)
- Work order integration
- Gauge reading authoring tools
- Bulk edit for actions in missions
- Storage management dashboard
- Remote support access from Orbit
- Factory reset zero-out storage option exposed in UI
- Orbit VM OS update tooling
- Site View performance optimization

**Platform**
- Site Hub SSO improvements (carried forward from v4.1)
- Orbit VM OS update support

---

## Spot 5.0 Release Notes (Article 171877)

### v5.0.1 Patch 5 (December 2025)

- Fixed tablet black screen on connection
- Fixed incorrect Spot Arm and gripper movements
- Fixed Autowalk edge parameter issues
- Samsung Tab Active5 connectivity improvements

### v5.0.1 Patch 4 (November 2025)

- Admin Console/software update now power cycles attached payloads
- Improved open-riser stair navigation and multi-landing turns

### v5.0.1 Patch 3 (November 2025)

- Core I/O communication stability in high ambient temperature
- Fixed face blurring for body cameras and acoustic sensors
- Fixed Telit FN980 modem boot issue

### v5.0.1 Patch 2 (October 2025)

- Face Detection Confidence Threshold slider in Orbit
- Improved stair navigation on varying tread lengths
- Fixed Orbit Auto-Connect, email alerts, SSO clock skew issues

### v5.0.1 Patch 1 (September 2025)

- German language support for Orbit/Spot App/webserver
- Korean language support for robot webserver
- Fixed site map upload and Autowalk blocking issues

### v5.0.1 (August 2025)

- Robot connection via hostname in Spot App
- Acoustic inspection ROI editing in Orbit
- Faster map uploads to Orbit
- All BD traffic now via "bosdyn.com" endpoint (replaces "bostondynamics.com")
- Fixed Autowalk dock return stalling and supervision settings issues

### v5.0.0 (May 2025)

**Highlights:**
- **Tablet User Profiles**: Industrial Inspection, Public Safety, Advanced
- **Dual-mode WiFi**: Simultaneous Client + AP mode on same channel
- **Orbit for Enterprise**: Multi-instance dashboard (hub-and-spoke model, up to 20 robots/instance)
- **Orbit as VM**: VMWare, Hyper-V, Azure deployment support
- **Site View**: Robot's-eye panoramic navigation of your site from Orbit
- **OTA Software Updates**: Bundle robot + payload software, deploy to fleet from Orbit

**New features:**
- Relay-controlled door opening during Autowalk
- AI Visual Inspections extension (pretrained vision-language model)
- Create inspections in Site View without driving to the asset
- Record actions along existing routes (streamlined tablet → Orbit workflow)
- Polygonal regions of interest for inspections
- Automatic alert thresholds for thermal inspections
- Robot Time Zone setting in Orbit (DST-aware)
- Weather-aware scheduling now core feature (no robot-level license needed)
- Enhanced data privacy: face blur, granular log sharing, image deletion

---

## Spot 4.1 Release Notes (Article 89251)

### v4.1.1 (December 2024)

- Weather-aware mission scheduling (requires openweathermap.org API access)
- Inspection Dashboard for reviewing inspection results
- Loop closure suggestions during Autowalk recording
- Edge filters for map management

### v4.1.0 (September 2024)

**Inspection and Sensing**
- Fluke SV600 acoustic inspection sensor integration
- Leica BLK ARC scanning integration
- Hazard detection using RGB cameras + Core I/O
- AIVI body camera support (initial release)
- Archive inspection data capability

**Autowalk and Navigation**
- Multi-dock Autowalk (missions spanning multiple Spot Docks)
- Auto-action ordering during mission playback
- Archive edges (hide unused edges without deleting)
- Long Range Planner (experimental): navigate obstacles up to ±6 m off path
- Network readiness check tool

**Robot Behavior**
- Human-robot interaction gestures: foot tap, leg raise
- Session timeout configuration
- Test mode for validating missions without executing actions

**Platform and Administration**
- Backup and restore for Orbit configuration
- Licenses no longer cut motor power (motor power freely available without license)
- Site Hub SSO (single sign-on)
- Cloud Orbit global availability
- Orbit global deployment option

---

## Spot 4.0 Release Notes (Article 49984)

### v4.0.3 (July 2024)

- Reliability improvements for Orbit, Site Hub, and Spot Arm

### v4.0.2 (June 2024)

- Joint-level control API for reinforcement learning (additional license required)
- Demo Mode no longer requires payload deletion (just mark unattached/unauthorized)
- Spot Cam light toggle in Spot App
- Fixed WiFi Radio Power setting missing for post-Sept-2023 Spots
- Security improvements (see Customer Security Advisory)

### v4.0.1 (April 2024)

- [Orbit] BD Support remote access option (cloud only)
- Per-instance SMTP password encryption (Site Hub security improvement)
- Fixed Spot Arm "fixed in body" function
- Fixed programmatic shutdown for post-Sept-2023 Spots
- Fixed staircase traversal during mission playback

### v4.0.0 (February 2024)

**Highlights:**
- **Site maps**: Real-time monitoring, mission editing, blueprint upload, merge recordings, draw edges
- **Cloud-based Orbit**: SSO (Google/Microsoft SAML), in-app updates, no hardware needed
- **Send Spot to location**: Navigate autonomously to any Dock or recorded location

**Autowalk:**
- Auto-backup during recording
- Pause/resume recording
- Continue recording from Orbit-loaded map
- Stairs Clearance Check action (EAP 2 required)
- Updated Autowalk uploader with conflict management

**Orbit:**
- Improved mission scheduler (start times, repeat cadence, operation hours)
- Inspection history page
- Webhooks for 3rd-party integration
- Auto-connect (dynamic WiFi/Ethernet switching)
- Manipulation mode for Spot Arm via Orbit
- API access tokens (alternative to username/password)
- Orbit metrics collection (opt-out in Global Settings)

**Spot App:**
- Tablet controls lock
- Spot Cam PTZ manual focus
- Body position holding with joysticks

**API:**
- Live signals: continuously updated sensor readings in tablet and Orbit

**Improvements:**
- PTZ alignment performance improved (requires Core I/O)
- Arm Pointing defaults to manual focus for speed/reliability
- Moving object collision prediction with lights/sounds (EAP 2)
- Descend ≤4 stairs facing backwards if space available
