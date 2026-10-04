# Fair Drop 🎟️

> **Your chance shouldn't depend on your internet speed.**

Fair Drop is a fair ticket-allocation platform designed for high-demand, limited-inventory events.

Instead of rewarding users based on who can refresh fastest, Fair Drop uses a controlled queue, human verification, fixed ticket quantities, admission windows, and deterministic allocation rules to give every participant a fair chance.

---

## 🚀 Overview

When tickets are limited and demand is high, traditional ticket systems often create an unfair advantage for users with faster internet, better hardware, bots, or automated refresh systems.

Fair Drop changes that model.

Users:

1. Browse available events
2. Select the number of tickets they want
3. Complete human verification
4. Join the allocation queue
5. Wait for admission
6. Receive a temporary claim window when admitted
7. Claim their allocated tickets
8. View their tickets in **My Tickets**

The quantity requested by the user is fixed when they enter the queue.

There is no "claim more" mechanism after admission.

---

## 🎯 Core Idea

### "Join the pool. Everyone gets a fair chance."

Fair Drop separates **joining the demand pool** from **receiving tickets**.

A user's internet speed should not determine whether they get access to limited tickets.

The platform is designed around:

- Fair queue participation
- Fixed ticket requests
- Human verification
- Controlled admission
- Temporary claim windows
- Strict inventory accounting
- Per-user ticket limits
- User-specific ticket ownership
- Admin-controlled event creation

---

## ✨ Features

### 👤 User Experience

- User registration and login
- User-specific sessions
- Event discovery
- Event details
- Ticket quantity selection
- Queue participation
- CAPTCHA / human verification
- Admission state
- Ticket claim flow
- My Tickets
- User profile
- Re-authentication handling

### 🎟️ Fair Allocation

- Fixed requested ticket quantity
- Controlled queue
- Admission state
- Temporary claim window
- Locked ticket inventory
- Deterministic claim behavior
- Expired claim windows are terminal
- No claim retry
- No "claim more" functionality

### 🔐 Human Verification

Fair Drop includes multiple verification stages to reduce automated participation.

The verification flow includes:

- Text CAPTCHA
- Interactive presence verification
- Moving click-target interaction
- Multi-click verification
- Hold interaction

The goal is to ensure that queue participation represents real users rather than automated traffic.

### 🛡️ Ticket Limits

Each user can successfully claim a maximum of:

**4 tickets cumulatively**

The system validates the user's existing entitlement before allowing additional tickets.

Examples:

| Already Claimed | Request | Result |
|---:|---:|---|
| 0 | 4 | ✅ Allowed |
| 1 | 3 | ✅ Allowed |
| 2 | 2 | ✅ Allowed |
| 3 | 1 | ✅ Allowed |
| 4 | 1 | ❌ Rejected |
| 2 | 3 | ❌ Rejected |
| 2 | 4 | ❌ Rejected |

Rejected requests must not mutate:

- Ticket ownership
- Inventory
- Queue state
- Allocation state

---

## 📦 Inventory Model

Fair Drop maintains three important inventory states:

- **Remaining** — tickets still available
- **Locked** — tickets temporarily reserved for admitted users
- **Allocated** — tickets successfully claimed

The core invariant is:

```text
Remaining + Locked + Allocated = Total Inventory
