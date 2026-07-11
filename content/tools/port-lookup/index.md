---
title: "Port Number Lookup - Common TCP/UDP Ports Reference Free"
description: "Free online port number lookup. Search common TCP and UDP port numbers. Quick reference for well-known ports used by HTTP, HTTPS, SSH, FTP, DNS, DHCP, and more."
icon: "&#x1F4E1;"
tool_slug: "port-lookup"
slug: "port-lookup"
layout: "tools/single"
draft: false
---

## How to Use the Port Lookup

1. **Search by port number** — type a number (e.g., 80, 443, 22) and instantly see the associated service
2. **Or search by service name** — type "HTTP," "SSH," "DNS," "RTSP," or any service name to find its port
3. **Browse the table** — scroll through the complete list of well-known ports with descriptions
4. **Filter by category** — narrow results to web ports, mail ports, security ports, or CCTV-specific ports
5. **View details** — each entry shows the port number, protocol (TCP/UDP), service name, and description

Perfect for network administrators, firewall configurators, CCTV installers, and IT professionals.

## Features

- **Quick search** — filter by port number or service name with real-time results
- **Well-known ports** — complete list of ports 0-1023 with official IANA assignments
- **Registered ports** — common services above 1024 used by various applications
- **CCTV-specific** — includes common surveillance ports (RTSP 554, ONVIF 80/8080, HTTP for cameras)
- **Protocol indicators** — clearly shows whether each port uses TCP, UDP, or both
- **Color-coded categories** — well-known, registered, and dynamic ports visually distinguished
- **Offline-capable** — the full port database loads with the page, no server queries needed

## Use Cases

**Firewall configuration** — when setting up firewall rules, you need the correct port numbers for the services you want to allow. The port lookup confirms that HTTPS uses port 443 (TCP), DNS uses port 53 (UDP), and SSH uses port 22 (TCP) before you write the rules.

**CCTV remote access setup** — security camera installers frequently configure port forwarding for remote viewing of NVRs and IP cameras. The lookup helps identify RTSP (554), HTTP (80), and ONVIF-compatible port ranges used by different camera brands.

**Network troubleshooting** — when a service is not working, checking whether the correct port is open and listening helps narrow down the problem. The lookup confirms which port a service should be using.

**Port forwarding for applications** — gamers, web developers, and self-hosted service operators need to open specific ports on their routers. The lookup clarifies which ports applications like Minecraft (25565), Plex (32400), or game servers use by default.

## FAQ

### What is the difference between TCP and UDP ports?
TCP (Transmission Control Protocol) ensures reliable, ordered delivery of data — used for web pages, email, and file transfers. UDP (User Datagram Protocol) is faster but does not guarantee delivery — used for streaming, DNS queries, and VoIP where speed matters more than perfect accuracy.

### What are the most commonly used ports?
The most commonly used ports are 80 (HTTP web traffic), 443 (HTTPS secure web traffic), 22 (SSH remote access), 53 (DNS domain resolution), 25 (SMTP email sending), and 3389 (RDP remote desktop).

### What ports do security cameras use?
IP cameras commonly use port 80 or 8080 for the web interface, port 554 for RTSP video streaming, and port 8000 or variable ports for ONVIF discovery and communication. NVR systems often use specific ports for mobile app access — check your camera's documentation.

### What ports should I open for remote desktop?
For Windows Remote Desktop, open port 3389 (TCP). For VNC, open port 5900 (TCP). For SSH access to a Linux system, open port 22 (TCP). Always use strong authentication when exposing remote access ports to the internet.

### What are dynamic or private ports?
Ports 49152-65535 are dynamic/private ports. These are not assigned to any specific service and are used temporarily by client applications when making outbound connections. You typically do not need to open these in your firewall.

## Tips

- For security, change default port numbers when possible — moving SSH from port 22 to a higher port reduces automated attack attempts
- Always open the minimum number of ports needed — every open port is a potential attack surface
- Use a port scanner (like nmap) to verify that your firewall rules are working correctly after configuration
