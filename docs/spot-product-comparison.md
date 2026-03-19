# Spot Product Comparison

Feature comparisons, operating environment specs, and hardware specifications.
Source: BD Support Articles 72009, 49930, 151694

---

## Explorer vs Enterprise (72009)

| Feature | Explorer | Enterprise |
|---|---|---|
| Self-charging on Spot Dock | No | Yes |
| Autowalk distance limit | 1 km | 2 km, 100 actions |
| Diagnostic logging opt-out | Cannot disable | Can disable |
| WiFi bands | 2.4 GHz (b/g/n) | 2.4 GHz + 5 GHz (b/g/n/ac) |
| Payload power control | Always on | Toggle via tablet or API |
| High-speed data offload | No | Yes (via Dock Ethernet) |
| Enhanced safety rating | No | PLd Cat 3 per ISO 13849-1 |

---

## Nominal Operating Environments (49930)

### Floor and Space

| Parameter | Requirement |
|---|---|
| Surface coefficient of friction | ≥ 0.4 |
| Max debris height | 25 cm |
| Minimum overhead clearance | 70 cm |
| Minimum doorway width | 60 cm |
| Turn space required | 122 cm × 122 cm |
| Maximum slope | ±30° |
| Maximum single step height | 35 cm |

### Stairs

| Parameter | Requirement |
|---|---|
| Minimum stair width | 64 cm |
| Maximum stair pitch | ±45° |
| Maximum step height | 22 cm |
| Barrier height (required) | ≥ 50 cm |
| Maximum gap at barrier | ≤ 30 cm |
| Landing dimensions | Sufficient for robot to fully stand (see BD site prep guide) |

### Lighting

| Parameter | Value |
|---|---|
| Camera dynamic range | 68 dB |
| Minimum illumination for cameras | 50 lux |

### Climate and Protection

| Parameter | Value |
|---|---|
| Ingress protection | IP54 |
| Operating temperature (older units) | −20°C to 45°C |
| Operating temperature (newer units, serial BD-41200001+) | −20°C to 55°C |

### Navigation Constraints

| Parameter | Value |
|---|---|
| Depth camera range | ~2 m |
| Obstacle detection threshold | 30 cm height |
| Minimum detectable obstacle width | 3 cm |

**Surfaces that interfere with navigation** (depth cameras may fail to detect):
- Highly reflective surfaces (mirrors, polished metal)
- Transparent surfaces (glass walls, clear plastic)
- Grated or open-mesh floors
- Repetitive patterns (uniform tile, striped floors)
- Near-infrared saturated environments

---

## Spot Arm Specifications (151694)

### Weight and Dimensions

| Parameter | Value |
|---|---|
| Arm weight | 8 kg |
| Total robot weight with arm and battery | 40.5 kg |
| Max reach height (full extension) | 1820 mm |
| Arm length | 984 mm |

### Payload Capacity

| Condition | Capacity |
|---|---|
| Maximum lift | 11 kg |
| Continuous lift at 500 mm from shoulder | 5 kg |

### Environmental Rating

| Parameter | Value |
|---|---|
| Ingress protection | IP54 |
| Operating temperature | −20°C to 45°C |

### Gripper

| Parameter | Value |
|---|---|
| Finger depth | 90 mm |
| Maximum aperture | 175 mm |
| Peak clamp force | 130 N |

### Joint Specifications

| Joint | Name | Range | Notes |
|---|---|---|---|
| 1 | SH0 (Shoulder roll) | — | Shoulder abduction/adduction |
| 2 | SH1 (Shoulder pitch) | — | Shoulder flexion/extension |
| 3 | EL0 (Elbow pitch) | — | Elbow flexion/extension |
| 4 | EL1 (Elbow roll) | — | Forearm rotation |
| 5 | WR0 (Wrist pitch) | — | Wrist flexion/extension |
| 6 | WR1 (Wrist roll) | — | Wrist rotation |
| 7 | F1X (Finger) | — | Gripper open/close |

7 total degrees of freedom. Refer to BD SDK documentation for exact joint torque and range-of-motion values.
