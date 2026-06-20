---
title: "CCTV System Planning Guide: Storage, Bandwidth, PoE & More"
date: "2026-06-20"
description: "Complete guide to planning a CCTV security system. Learn how to calculate storage, PoE budget, bandwidth, UPS runtime, and camera FOV for any surveillance installation."
image: "/images/og-cctv-guide.jpg"
tags:
  - CCTV
  - security system
  - surveillance
  - IP cameras
  - NVR
---

Planning a CCTV security system involves more than just buying cameras and mounting them on walls. A professional-grade installation requires precise calculations across storage, power, network bandwidth, and backup systems. Get these wrong, and you'll face recording gaps, switch overloads, or cameras going offline when you need them most.

This guide covers the essential calculations every installer needs — with free tools to do the math instantly.

## 1. Storage Planning: How Much Hard Drive Space Do You Need?

Storage is the most common miscalculation in CCTV systems. Nothing is worse than discovering your NVR only retains 3 days of footage when you need to review something from a week ago.

The key variables are:
- **Number of cameras** — each camera adds to the total data stream
- **Resolution** — 4K (8MP) cameras produce 4x more data than 1080p (2MP)
- **Frames per second** — 30 FPS uses 2x the storage of 15 FPS
- **Compression codec** — H.265+ uses 50-70% less storage than H.264
- **Recording mode** — continuous 24/7 vs motion-triggered
- **Retention period** — how many days you need to keep footage

Use our [CCTV Storage Calculator]({{< relref "/tools/cctv-storage-calculator" >}}) to get exact numbers. Enter your camera specs, and it tells you the required HDD size in seconds.

**Pro tip:** For a standard 8-camera system at 1080p, H.265, 15 FPS, 24/7 recording, budget about 200-300 GB per day. A 4TB drive gives you roughly 2 weeks of continuous recording.

## 2. PoE Budget: Don't Overload Your Switch

Power over Ethernet (PoE) is the standard for modern IP cameras — a single cable carries both data and power. But every PoE switch has a maximum power budget, and exceeding it causes devices to intermittently reboot or fail to power on.

Poe classes and their power limits:
| PoE Class | Standard | Max Power | Typical Device |
|---|---|---|---|
| Class 1 | 802.3af | 4W | Basic IP camera |
| Class 2 | 802.3af | 7W | PTZ camera |
| Class 3 | 802.3af | 15.4W | Standard IP camera |
| Class 4 | 802.3at (PoE+) | 30W | PTZ with heater, high-power camera |

Calculate your total draw with our [PoE Calculator]({{< relref "/tools/poe-calculator" >}}). Always leave at least 20% headroom in your PoE budget for power spikes during pan/tilt operations.

**Real-world example:** 8 cameras drawing 12W each = 96W total. A 120W PoE switch has only 24W headroom — enough for 2 more cameras. Going to 16 cameras would require a 240W switch.

## 3. Network Bandwidth: Will Your Network Handle It?

IP cameras can saturate a network connection fast. Each camera streams data constantly, and your network backbone needs to handle the aggregate bandwidth.

How much bandwidth each camera needs (approximate):
- **2MP (1080p)** at 15 FPS H.265: ~4 Mbps
- **4MP** at 20 FPS H.265: ~8 Mbps
- **8MP (4K)** at 25 FPS H.265: ~16 Mbps

For 16 cameras at 4MP, that's 128 Mbps of sustained traffic. Most consumer routers struggle above 100 Mbps. This is why commercial installations use dedicated VLANs and managed switches.

Calculate your exact bandwidth requirements with our [Bandwidth Calculator]({{< relref "/tools/bandwidth-calculator" >}}).

## 4. Camera Placement: Field of View and Lens Selection

The most expensive camera is useless if it's looking in the wrong direction or has the wrong lens. Field of view (FOV) determines how much area a camera covers at a given distance.

Key FOV concepts:
- **Focal length** — shorter (2.8mm) = wider view, less detail at distance
- **Sensor size** — larger sensors (1/2.8", 1/1.8") capture more light and wider FOV
- **Resolution** — higher resolution lets you digitally zoom into a wider scene

**Quick reference for common scenarios:**
| Application | Recommended Focal Length | FOV |
|---|---|---|
| Narrow corridor / entrance | 6mm - 12mm | 25° - 45° |
| Warehouse / open area | 2.8mm - 4mm | 80° - 110° |
| Parking lot perimeter | 4mm - 6mm | 50° - 70° |
| License plate capture | 12mm - 50mm | 5° - 25° |

Use our [Camera FOV Calculator]({{< relref "/tools/fov-calculator" >}}) to visualize coverage before you mount a single camera.

## 5. UPS Runtime: Keep Recording During Power Outages

Security is most critical when something goes wrong — including power failures. A UPS ensures your NVR and cameras keep recording during outages.

To size your UPS:
1. Calculate total load (NVR + cameras + switch)
2. Decide required runtime (30 min? 2 hours?)
3. Account for power factor (~0.6 for most UPS units)

**Example load calculation:**
- NVR: 50W
- 8 cameras at 5W each: 40W (cameras can run on PoE from a powered switch)
- PoE switch: 15W (overhead)
- **Total: ~105W**

A 650VA UPS (~390W capacity) running at 105W load gives approximately 45-60 minutes of runtime. Enough for short outages and graceful shutdown.

Plan your backup power with our [UPS Runtime Calculator]({{< relref "/tools/ups-calculator" >}}).

## 6. RAID for NVRs: Protect Your Footage

If you're installing for a business, RAID is non-negotiable. A single drive failure without RAID means all footage from that period is gone.

Common RAID configurations for NVRs:
| RAID Level | Min Drives | Usable Capacity | Fault Tolerance | Best For |
|---|---|---|---|---|
| RAID 0 | 2 | 100% | None | Speed, no redundancy |
| RAID 1 | 2 | 50% | 1 drive | Mirroring, critical footage |
| RAID 5 | 3 | 67-94% | 1 drive | Balance of capacity and safety |
| RAID 6 | 4 | 50-88% | 2 drives | High reliability |
| RAID 10 | 4 | 50% | 1 per pair | Performance + redundancy |

Calculate usable capacity for your setup with our [RAID Storage Calculator]({{< relref "/tools/raid-calculator" >}}).

## Putting It All Together: A Complete System Plan

Here's a worked example for a **16-camera office surveillance system**:

1. **Cameras:** 16x 4MP, H.265, 20 FPS, 24/7 recording
2. **Storage:** ~500 GB/day → 15TB usable needed for 30 days → RAID 5 with 3x 8TB drives = 14.5TB usable
3. **PoE:** 16 cameras at 8W = 128W → 200W PoE+ switch (72W headroom)
4. **Bandwidth:** 16 × 8 Mbps = 128 Mbps → dedicated gigabit VLAN
5. **UPS:** NVR (60W) + switch (20W) + cameras (128W) = 208W → 1000VA UPS gives ~45 min runtime
6. **FOV planning:** 4mm lenses for open areas, 6mm for entry points

All these calculations are available as free tools at [FreeToolz CCTV section](/cctv-security/). No signup, no data collection — just instant results in your browser.

## FAQ

**What's the most common mistake in CCTV system planning?**
Underestimating storage. Most installers plan for motion-only recording but don't account for scenes with constant motion (busy streets, lobbies). Always add 30% buffer to your storage estimate.

**Can I mix PoE and non-PoE cameras on the same switch?**
Yes — standard PoE switches only deliver power when the device requests it. Non-PoE devices simply ignore the power pins.

**How long should I keep CCTV footage?**
For homes, 7-14 days is typical. For businesses, 30 days is standard. Some regulated industries (banks, casinos) require 90-180 days. Check local laws — some jurisdictions mandate minimum retention periods.

**Should I use WiFi cameras instead of wired PoE?**
WiFi cameras are convenient but unreliable for critical security. They suffer from interference, bandwidth competition, and signal drops. Wired PoE is always recommended for permanent installations.

**What's better: more cameras at lower resolution or fewer at higher resolution?**
Coverage first, detail second. It's better to have complete coverage at 1080p than blind spots at 4K. Once coverage is solved, upgrade key areas (entry points, cash registers) to higher resolution.

---

*Use FreeToolz free [CCTV & Security Calculators](/cctv-security/) for all your surveillance system planning. All tools run in your browser — no data leaves your device.*
