---
title: "Subnet Calculator - IP CIDR Network Calculator Free"
description: "Free online subnet calculator. Calculate network address, broadcast address, usable host range, subnet mask, and total hosts from any IP/CIDR notation. IPv4 supported."
icon: "&#x1F310;"
tool_slug: "subnet-calculator"
slug: "subnet-calculator"
layout: "tools/single"
draft: false
---

## How to Use the Subnet Calculator

1. **Enter an IP address** — type a valid IPv4 address (e.g., `192.168.1.0`)
2. **Enter CIDR prefix** — add the CIDR notation (e.g., `/24`) or use the netmask format (e.g., `255.255.255.0`)
3. **View results instantly** — the calculator displays network address, broadcast address, usable host range, total hosts, and wildcard mask
4. **Adjust to explore** — change the CIDR prefix to see how subnet size affects the number of usable addresses

Perfect for network engineers, system administrators, CCTV installers, and IT professionals planning IP networks for surveillance systems.

## Features

- **Instant calculation** — results update in real-time as you type without clicking any buttons
- **CIDR notation** — supports all IPv4 prefixes from /0 to /32
- **Complete details** — network address, broadcast address, first usable IP, last usable IP, and total host count
- **Subnet mask** — displays both dotted decimal (255.255.255.0) and CIDR (/24) format
- **Wildcard mask** — shows the inverted mask useful for ACLs and OSPF network statements
- **Binary representation** — optional view of the IP and mask in binary for learning purposes

## Use Cases

- **Network planning** — design IP addressing schemes for new office or campus networks
- **CCTV system design** — calculate the right subnet size for IP camera deployments (typically a /24 for up to 254 cameras)
- **VLAN configuration** — determine subnet boundaries when segmenting a network into multiple VLANs
- **Firewall rule creation** — find the wildcard mask for ACL entries to permit or deny traffic
- **IP address management** — verify you have enough addresses in a subnet before assigning devices

## FAQ

### What does the /24 in 192.168.1.0/24 mean?
The /24 is the CIDR prefix length, meaning the first 24 bits of the IP address are the network portion. This gives you 8 bits for hosts, or 254 usable addresses (256 total minus network and broadcast addresses). The subnet mask is 255.255.255.0.

### How many usable hosts are in a /29 subnet?
A /29 subnet has 3 bits for hosts, giving 8 total addresses. After subtracting the network address and broadcast address, you have 6 usable host addresses. This is commonly used for point-to-point links or small device groups.

### What is the difference between network address and broadcast address?
The network address is the first address in a subnet (all host bits zero) and identifies the network itself. The broadcast address is the last address (all host bits one) and is used to send traffic to all devices in the subnet simultaneously.

### Can I use the first or last IP address in a subnet?
No. The first address (network address) and last address (broadcast address) are reserved and cannot be assigned to devices. The usable range starts at network + 1 and ends at broadcast - 1.

### What subnet mask should I use for a small office network?
A /24 (255.255.255.0) subnet providing 254 usable addresses is standard for most small offices. For smaller departments, use /25 (126 addresses) or /26 (62 addresses). For a home network, /24 is typical.

## Tips

- Plan for growth — give your network a larger subnet than you currently need to avoid readdressing later
- Use /30 subnets for point-to-point links between routers (2 usable addresses)
- Remember that the first and last IP in every subnet are reserved — subtract 2 from the total when counting available addresses
- For CCTV networks, use a dedicated subnet separate from your main data network for security and bandwidth management
