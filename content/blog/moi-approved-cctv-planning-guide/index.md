---
# RankMath SEO
rankmath_title: "MOI Approval CCTV Planning Guide 2026 | SSD Compliance Qatar"
rankmath_description: "Complete guide to planning an MOI-approved CCTV system in Qatar. Learn 120-day storage, RAID 5, UPS requirements, and use free calculators for accurate planning."
rankmath_permalink: /blog/moi-approved-cctv-planning-guide/
rankmath_focus_keyword: "MOI CCTV approval"
rankmath_related_keywords: [MOI approved CCTV, Qatar CCTV compliance, SSD security system, 120 day storage CCTV, MOI camera requirements]

title: "MOI Approved CCTV System Planning Guide 2026 — Compliance & Calculations"
date: "2026-06-20"
description: "Complete guide to planning an MOI-approved CCTV system in Qatar. Covers 120-day storage, RAID 5, UPS requirements, camera specs, and step-by-step SSD approval process with free planning tools."
image: "/images/og-cctv-guide.jpg"
tags:
  - MOI approval
  - CCTV
  - Qatar security
  - SSD compliance
  - surveillance
  - security system
---

Installing a CCTV system in Qatar isn't just about buying cameras and mounting them on walls. The Ministry of Interior (MOI) Security Systems Department (SSD) enforces strict technical standards that every business must meet — from camera resolution and storage retention to RAID configuration and power backup.

This guide walks through every technical requirement for MOI SSD compliance, shows you how to plan your system using free tools, and explains the step-by-step approval process.

## What Is MOI SSD Approval and Why Do You Need It?

MOI SSD approval is a certification issued by the Ministry of Interior's Security Systems Department. It confirms your surveillance system meets Qatar's national security standards. Without it, businesses cannot obtain or renew their municipality licenses.

Under Qatar Law No. 9 of 2011 and subsequent SSD regulations, these sectors are legally required to have MOI-approved CCTV systems:

- Commercial buildings and offices
- Retail stores, shopping malls, and gold shops
- Warehouses and industrial facilities
- Hotels and residential complexes
- Hospitals, clinics, and schools
- Banks and financial institutions

Non-compliance can result in heavy fines, license renewal rejection, or even business closure.

## MOI Technical Requirements at a Glance (2026)

| Requirement | MOI Standard |
|---|---|
| **Camera Resolution** | Minimum 2MP (IP cameras preferred) |
| **Storage Retention** | 120 days for most commercial sectors |
| **RAID Configuration** | RAID 5 or higher for data redundancy |
| **Coverage** | 100% of entrances, exits, and cash-handling areas |
| **UPS Backup** | Minimum 1-hour power backup for all critical equipment |
| **AMC** | Valid Annual Maintenance Contract with MOI-approved company |

## 1. Camera Specifications: Resolution, Type & Coverage

MOI requires a minimum of **2MP (1080p) resolution** for all surveillance cameras. While analog cameras are sometimes permitted, IP cameras are strongly preferred by SSD inspectors for superior clarity and digital zoom capabilities.

### Choosing the Right Camera Type

| Camera Type | Best For | Key Feature |
|---|---|---|
| **Dome** | Indoor retail, offices | Vandal-resistant, discreet |
| **Bullet** | Outdoor perimeters, parking | Long-range, visible deterrent |
| **Turret** | Indoor/outdoor versatile | Good balance of form factor |
| **PTZ** | Large open areas | Pan-tilt-zoom coverage |

### Field of View Planning

MOI mandates **zero blind spots** at all entry and exit points. This requires careful lens selection:

| Application | Recommended Focal Length | Horizontal FOV |
|---|---|---|
| Entrance doors | 4mm - 6mm | 50° - 70° |
| Cash counters | 2.8mm - 4mm | 80° - 110° |
| Parking lots | 2.8mm - 4mm | 80° - 110° |
| Corridors | 6mm - 12mm | 25° - 45° |
| Long perimeter | 12mm - 50mm | 5° - 25° |

Use our free **[Camera FOV Calculator](/tools/fov-calculator/)** to visualize lens coverage before installation and ensure no blind spots remain.

## 2. Storage Planning for 120-Day Retention

The 120-day retention requirement is the most impactful MOI regulation for your system design. Let's work through a real example.

### Storage Calculation Example

For a **16-camera office system** with the following specs:

| Variable | Value |
|---|---|
| Cameras | 16x 4MP (1440p) |
| Codec | H.265 |
| FPS | 15 |
| Recording | 24/7 continuous |
| Retention | 120 days |

**Step 1:** Each 4MP camera at 15 FPS H.265 produces approximately **5 Mbps**.

**Step 2:** Total daily storage:
`(5 Mbps × 16 cameras × 86,400 seconds) ÷ 8 ÷ 1,024² ≈ 824 GB/day`

**Step 3:** For 120 days:
`824 GB × 120 = 98,880 GB ≈ 97 TB`

**Step 4:** With RAID 5 across a typical configuration, you need approximately **114 TB raw capacity** to get 97 TB usable.

That's a significant storage investment. Use our **[CCTV Storage Calculator](/tools/cctv-storage-calculator/)** to get exact numbers for your specific camera configuration — it handles the bitrate math automatically for any resolution, codec, and FPS combination.

### RAID Requirements for MOI Compliance

MOI standards require **RAID 5 or higher** to prevent data loss from single drive failures. This is non-negotiable for SSD compliance.

| RAID Level | Min Drives | Usable Capacity | Fault Tolerance | MOI Compliant? |
|---|---|---|---|---|
| RAID 0 | 2 | 100% | None | ❌ |
| RAID 1 | 2 | 50% | 1 drive | ✅ (small systems) |
| RAID 5 | 3 | 67% - 94% | 1 drive | ✅ |
| RAID 6 | 4 | 50% - 88% | 2 drives | ✅ |
| RAID 10 | 4 | 50% | 1 per pair | ✅ |

Plan your NVR storage configuration with our **[RAID Storage Calculator](/tools/raid-calculator/)** to determine exact drive counts and usable capacity for any RAID level.

## 3. Power Backup: UPS Requirements

MOI mandates a minimum of **1-hour UPS backup** for all critical CCTV equipment — NVR, cameras (via PoE switch), and network infrastructure.

### UPS Sizing Example

| Component | Power Draw |
|---|---|
| 16-channel NVR | 50W |
| 16-port PoE+ switch | 25W (overhead) |
| 16 cameras at 5W each | 80W |
| **Total load** | **155W** |

A 1000VA UPS (rated ~600W) at 155W load provides approximately 2+ hours of runtime — well exceeding the 1-hour MOI minimum.

For a smaller system:
- **8 cameras, 4-channel NVR:** ~80W total load
- **650VA UPS (~390W capacity):** Gives 45-60 minutes runtime

Calculate exact UPS requirements for your system with our **[UPS Runtime Calculator](/tools/ups-calculator/)**.

## 4. Network Bandwidth & Infrastructure

MOI doesn't mandate specific bandwidth requirements, but your network must reliably handle the aggregate camera streams without packet loss or latency that could affect recording integrity.

### Bandwidth Calculation

| Camera Resolution | Bitrate @ 15 FPS H.265 |
|---|---|
| 2MP (1080p) | ~3 Mbps |
| 4MP (1440p) | ~5 Mbps |
| 8MP (4K) | ~10 Mbps |

**Real-world example:** 16 cameras at 4MP → 80 Mbps sustained traffic. This easily saturates a 100 Mbps link, which is why MOI-compliant installations use dedicated gigabit network infrastructure.

Use our **[Bandwidth Calculator](/tools/bandwidth-calculator/)** to calculate total network throughput for any camera configuration.

### Network Best Practices for MOI Compliance

- **Dedicated VLAN** for CCTV traffic to isolate from office/data networks
- **Managed PoE+ switches** with SNMP monitoring for proactive maintenance
- **CAT6 cabling minimum** — supports gigabit speeds and PoE+ power delivery
- **Network surge protection** at both ends of every cable run

## 5. Total System Cost Estimation

Building an MOI-compliant CCTV system requires significant investment. Our **[Security System Cost Estimator](/tools/security-cost-estimator/)** includes a dedicated **MOI Compliance toggle** that automatically:

- Sets storage retention to minimum 120 days
- Enables RAID 5 or RAID 10 configuration
- Adds UPS backup for all critical equipment
- Uses MOI-approved camera models and specifications

### Sample MOI-Compliant Quote

| Item | Quantity | Estimated Cost |
|---|---|---|
| 4MP IP Turret Cameras | 16 | $2,400 - $3,200 |
| 16-Channel NVR (RAID 5 ready) | 1 | $800 - $1,200 |
| 20TB Surveillance HDDs (RAID 5, 3x) | 3 | $1,500 - $1,800 |
| 16-Port PoE+ Managed Switch | 1 | $400 - $600 |
| 1000VA UPS | 1 | $250 - $400 |
| CAT6 Cabling & Accessories | 1 lot | $300 - $500 |
| Installation & Configuration | 1 lot | $1,600 - $2,400 |
| **Total Estimated** | | **$7,250 - $10,100** |

Get an accurate itemized quote for your specific setup at **[FreeToolz Security Cost Estimator](/tools/security-cost-estimator/)**.

## 6. Step-by-Step MOI Approval Process

### Phase 1: Planning & Design (Pre-Installation)

1. **Appoint an MOI-approved contractor** — only licensed integrators can submit to the SSD portal
2. **Site survey** — identify blind spots, camera positions, cable routes
3. **Technical design** — AutoCAD shop drawings showing all camera locations and angles
4. **Bill of Quantities (BOQ)** — list of MOI-approved equipment with specifications
5. **SSD portal submission** — upload drawings and BOQ for **DSA (Drawing Submission Approval)**

### Phase 2: Installation

6. **Mount cameras** at approved positions and heights
7. **Run cabling** per design specifications (CAT6 minimum)
8. **Configure NVR** with RAID 5 or higher, 120-day retention, proper recording schedule
9. **Set up UPS** and verify runtime exceeds 1 hour
10. **Network configuration** — VLANs, bandwidth allocation, remote access controls

### Phase 3: Inspection & Certification

11. **DIA (Drawing Inspection Approval) request** raised through SSD portal
12. **MOI inspector site visit** to verify:
    - Camera resolution and night vision performance
    - Storage retention period meets 120-day minimum
    - RAID configuration is active and verified
    - UPS backup operational
    - Coverage includes all mandatory areas with no blind spots
    - Secure control room / equipment room setup
13. **CCTV Compliance Certificate issued** upon passing inspection

### Phase 4: Ongoing Compliance

14. **Annual Maintenance Contract (AMC)** with MOI-approved company — mandatory
15. **Regular equipment inspections** — quarterly minimum
16. **Firmware updates** to address security vulnerabilities
17. **Re-inspection** if system undergoes significant modification

## FAQ

**How long does the MOI approval process take?**
Typically 2-4 weeks depending on project size and MOI inspection schedule. Allow extra time for larger installations.

**Can I use any CCTV camera brand?**
No. Only MOI-approved models from recognized brands (Hikvision, Dahua, UNV, Tiandy, etc.) can be used. Your contractor must provide compliant hardware.

**What happens if my system fails the MOI inspection?**
The inspector provides a punch list of issues. Fix the deficiencies and re-apply for inspection. A reputable MOI-approved contractor will handle this at no extra labor cost.

**Is 90 days or 120 days the standard?**
As of 2026, 120 days is the standard for most commercial sectors in Qatar. Some specific sectors may have different requirements — your MOI-approved contractor can confirm.

**Do I need a separate UPS for the CCTV system?**
Yes. The MOI requirement is for a UPS dedicated to the surveillance system, not shared with other office equipment. This ensures cameras continue recording during power outages.

**Can I use WiFi cameras for MOI compliance?**
No. MOI requires wired IP cameras. WiFi surveillance is not reliable enough for compliance purposes and introduces security vulnerabilities.

---

*Plan your MOI-compliant CCTV system with FreeToolz — free online calculators for storage, bandwidth, PoE, UPS, RAID, FOV, and system cost estimation. All tools run in your browser; no data leaves your device.*

**[Browse all CCTV & Security Calculators →](/cctv-security/)**
