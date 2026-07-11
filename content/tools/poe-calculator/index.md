---
title: "PoE Calculator - Power over Ethernet Budget Calculator Free"
description: "Free online PoE power budget calculator. Calculate total power draw for PoE devices, check switch capacity, and determine PoE class requirements for IP cameras and network devices."
icon: "&#x26A1;"
tool_slug: "poe-calculator"
slug: "poe-calculator"
layout: "tools/single"
draft: false
---

## How to Use the PoE Calculator

1. **Add PoE devices** — enter the quantity of each device type (IP cameras, access points, VoIP phones, etc.) and select their PoE class
2. **Enter switch PoE budget** — input the total power budget of your PoE switch (found in the switch datasheet)
3. **Specify cable length** — optional: enter the estimated cable length to account for power loss over distance
4. **View results** — total power draw, remaining budget, headroom percentage, and recommendations
5. **Adjust as needed** — swap devices or switch until the power budget fits your installation

## Features

- **PoE classes** — supports Class 1 (4W), Class 2 (7W), Class 3 (15.4W), Class 4 (30W PoE+), and Class 5 (60W PoE++)
- **Power budget analysis** — compares total device draw against the switch's available PoE budget
- **Overbudget warnings** — alerts when total power exceeds the switch capacity with a red indicator
- **Headroom percentage** — shows how much spare capacity remains after connecting all devices
- **Cable length impact** — estimates power loss over longer cable runs (Cat5e/Cat6)
- **Multiple device types** — mix cameras, access points, VoIP phones, and other PoE devices in one calculation

## Use Cases

**Security system installers** use the PoE calculator when designing IP camera systems. They add each camera's power class, factor in cable runs to distant locations, and verify the switch can power everything. This prevents the common mistake of overloading a PoE switch and having cameras drop offline at night.

**Network technicians** planning WiFi deployments calculate whether a single PoE switch can power all access points on a floor. They compare 802.3af (15.4W), 802.3at (30W), and 802.3bt (60W) devices to match the right switch to each deployment.

**System integrators** use the calculator to prepare client proposals. They document the power budget showing that the selected switch has adequate capacity with headroom, reducing the risk of callbacks for power-related issues.

**IT managers** expanding an existing network use the tool to determine if their current PoE switches have enough remaining budget to add new devices like door access controllers or additional cameras.

## FAQ

### What is a PoE budget?
A PoE budget is the total amount of power (in watts) that a PoE switch can deliver to connected devices. A 24-port PoE+ switch might have a 250W budget, meaning all 24 devices combined cannot draw more than 250W.

### What happens if I exceed the PoE budget?
When the total power draw exceeds the switch's PoE budget, the switch typically shuts down power to lower-priority ports to protect the remaining devices. This can cause unexpected device outages.

### What is the difference between PoE classes?
Class 1 (4W) devices use the least power — typically simple sensors or IoT devices. Class 2 (7W) covers basic VoIP phones. Class 3 (15.4W) is the standard for most IP cameras. Class 4 (30W PoE+) powers PTZ cameras and access points. Class 5 (60W PoE++) handles high-power devices like pan-tilt-zoom cameras with heaters.

### Does cable length affect PoE?
Yes. Longer cable runs experience voltage drop, reducing the power available at the device. The calculator estimates this effect for cables up to 100 meters (the maximum Ethernet cable length). For runs over 75 meters, consider higher-class PoE to compensate.

### How much headroom should I leave?
Industry best practice is to leave at least 15-20% headroom in your PoE budget. This accommodates future expansion and accounts for the fact that some devices may draw slightly more than their class rating during peak operation (e.g., IR LEDs on at night).

## Tips

- Always check the actual power draw of your devices (from datasheets) rather than relying solely on class ratings — some devices use less than their class maximum
- Use PoE+ (Class 4) switches even for Class 3 devices — the extra headroom prevents issues during peak power draw (nighttime IR activation for cameras)
- For outdoor camera installations with long cable runs, consider midspan PoE injectors near the cameras rather than running power from a distant switch
