---
title: "How to Plan a Home Security System: Complete Guide for Homeowners"
date: "2026-07-11"
description: "Complete guide to planning a home security system — camera types, NVR selection, storage, PoE, UPS, and MOI compliance for Qatar installations."
tags:
  - home security
  - CCTV
  - surveillance
  - MOI compliance
  - Qatar
---

A home security system is one of those purchases where getting it right the first time matters. Install too few cameras and you'll have blind spots. Underestimate storage and you'll lose footage before you need it. Choose the wrong NVR and you'll be replacing hardware within a year.

This guide walks through everything you need to plan a home security system that actually works — from camera selection to storage math to compliance requirements.

## Camera Types: Bullet, Dome, or PTZ?

The camera type you choose depends on where it's going and what it needs to do. There's no one-size-fits-all answer.

### Bullet Cameras

Bullet cameras are the most recognizable type — cylindrical, visible, and designed to communicate "you're being watched." Their deterrent effect is their biggest advantage.

**Best for:** Perimeter monitoring, driveways, backyards, and entry points where visibility is an asset.
**Pros:** Long-range viewing, strong deterrent, easy to install, weather-resistant.
**Cons:** More vulnerable to tampering (can be knocked out of alignment), larger form factor.

### Dome Cameras

Dome cameras are more discreet and harder to tamper with — the dome housing makes it difficult to tell which direction the camera is pointing.

**Best for:** Indoor use, hallways, living areas, covered outdoor spaces.
**Pros:** Vandal-resistant, discreet direction, harder to disable, sleeker appearance.
**Cons:** More prone to IR reflection if installed near walls, can be more expensive.

### PTZ Cameras

Pan-Tilt-Zoom cameras can move remotely to cover a wide area with a single unit. They're overkill for most homes but essential for specific use cases.

**Best for:** Large properties, long driveways, parking areas.
**Pros:** Covers multiple angles with one camera, optical zoom capabilities.
**Cons:** Expensive, requires more power (often PoE+), creates a single point of failure.

**Recommendation for most homes:** A mix of bullet cameras for the perimeter and dome cameras for covered/indoor areas. Start with 4-6 cameras and expand as needed.

## NVR Selection: What to Look For

The Network Video Recorder (NVR) is the brain of your IP camera system. It records footage, manages storage, and provides remote access. Choosing the right one matters more than picking cameras.

Key specs to evaluate:

**Channel count:** Buy more channels than you need today. If you're installing 6 cameras now, get an 8-channel NVR. The cost difference is small, and adding cameras later is much easier.

**PoE support:** Most NVRs come with built-in PoE ports. Match the total PoE budget to your camera draw plus 20% headroom. A standard 8MP camera draws 10-15W, so 8 cameras at 12W each needs at least 96W budget.

**Resolution support:** Make sure the NVR supports your camera resolution. An NVR rated for 8MP per channel can handle 4K cameras. Don't bottleneck a good camera with a weak NVR.

**Hard drive bays:** Two bays minimum for most home systems. This lets you use RAID 1 (mirroring) if footage reliability is critical. At minimum, one bay with a surveillance-grade drive (WD Purple or Seagate SkyHawk — these are rated for continuous writes).

## Storage Calculation: How Much Do You Actually Need?

This is the most commonly underestimated part of a security system. Let's do the math.

For a 4-camera system at 4MP resolution, H.265 compression, 15 FPS, recording 24/7:

- Each camera: ~8 Mbps
- Total: 32 Mbps
- Daily storage: 32 Mbps ÷ 8 × 3600 × 24 = ~345 GB per day

At that rate, a 4TB drive holds about 11-12 days of footage. Drop to 2MP and H.265+, and that same drive stretches to 25-30 days.

Use the FreeToolz [CCTV Storage Calculator]({{< relref "/tools/cctv-storage-calculator" >}}) to get exact numbers for your configuration. Just enter your camera count, resolution, FPS, and desired retention period — it tells you the required storage instantly.

**Pro tip:** Most home users don't need 24/7 recording. Motion-triggered recording can reduce storage requirements by 70-90%. Set your system to record continuously at a low frame rate (5 FPS, which uses half the storage of 15 FPS) and bump to full FPS on motion events.

## PoE Requirements and Network Planning

Power over Ethernet (PoE) makes installation simpler — one cable carries both data and power. But the PoE budget adds up fast.

**Real-world calculation:**
- 4 × 4MP bullet cameras at 12W each = 48W
- 2 × PTZ cameras at 18W each = 36W
- Total: 84W
- With 20% headroom: ~100W minimum PoE budget

A PoE switch rated for 120W handles this comfortably. One rated for 60W does not.

Your network also needs to handle the bandwidth. Four 4MP cameras streaming at 8 Mbps each is 32 Mbps. Add a fifth and you're at 40 Mbps. Most home routers handle this fine, but if you're mixing cameras with gaming, streaming, and video calls on the same network, consider a separate VLAN for cameras.

## UPS Backup: Don't Lose Power, Don't Lose Coverage

A security system that goes offline when the power goes out is worse than useless — it creates a false sense of security. A UPS (Uninterruptible Power Supply) keeps your cameras and NVR running during outages.

Calculate your UPS needs with the FreeToolz [UPS Run Time Calculator]({{< relref "/tools/ups-calculator" >}}).

**Guidelines:**
- NVR + 4 cameras: ~60W draw → 850VA UPS gives 30-45 minutes runtime
- NVR + 8 cameras + switch: ~120W draw → 1500VA UPS gives 45-60 minutes runtime

For Qatar, where power outages are rare but summer loads can cause brief interruptions, even 15 minutes of UPS runtime bridges most gaps.

## MOI Compliance for Qatar

If you're installing a security system in Qatar, compliance with Ministry of Interior (MOI) regulations is mandatory — not optional. The MOI sets specific requirements for commercial and residential security installations.

Key requirements include:
- **Minimum camera resolution:** Most MOI-regulated installations require at least 2MP (1080p)
- **Retention period:** A minimum of 30 days of footage storage is typically required
- **Camera placement:** Entry points, parking areas, and common areas must be covered
- **NVR specifications:** Must meet approved hardware standards

The FreeToolz [MOI CCTV Calculator]({{< relref "/tools/cctv-storage-calculator" >}}) helps you determine compliance requirements based on your property type and location. Use it during the planning phase to avoid costly retrofits.

## Conclusion

Planning a home security system is about making informed choices before you buy. Camera types, NVR specs, storage calculations, PoE budgets, and compliance requirements all need to be considered together — not in isolation.

The right approach: start with your storage and retention requirements, work back to camera resolution and count, then size your NVR and PoE budget accordingly. And always, always plan for expansion. The extra 8-channel NVR now will save you from buying a second one next year.

Use the [CCTV tools collection]({{< relref "/cctv-security" >}}) on FreeToolz to run your numbers — every calculator is free, works in your browser, and respects your privacy.
