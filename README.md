# Multi-Tenant Restaurant Booking & Management System (MERN Stack)

A comprehensive, production-ready Full-Stack MERN application featuring a dual-interface architecture: a **Customer-Facing Portal** for discovery, real-time table availability checking, and instant bookings, alongside a **Restaurant Partner Dashboard** for owners to manage seating, menus, live reservations, and guest traffic analytics.

---

## 🚀 System Architecture & Layout

This project is orchestrated as an **npm Workspace Monorepo**, dividing the codebase into three isolated modules under a unified Git repository:

```text
├── backend/            # Node.js, Express, and Mongoose API Engine
├── frontend-client/    # React (Vite) Single Page App for Guests & Diners
└── frontend-partner/   # React (Vite) Dashboard UI for Restaurant Managers
