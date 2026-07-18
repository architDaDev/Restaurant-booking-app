# 🍽️ Multi-Tenant Restaurant Booking & Management System

A full-stack **MERN** application with a dual-interface architecture: a **customer-facing portal** for discovering restaurants and booking tables in real time, and a **restaurant partner dashboard** for owners to manage their menu, profile, and incoming reservations — all backed by a single REST API and MongoDB database.

Built as an **npm Workspaces monorepo** containing one Express API and two independent React (Vite) single-page apps.

---

## Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Architecture Overview](#-architecture-overview)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Available Scripts](#-available-scripts)
- [Roadmap / Known Limitations](#-roadmap--known-limitations)
- [License](#-license)

---

## ✨ Features

**For diners (`frontend-client`)**
- Browse and search restaurants by city and cuisine type
- View a restaurant's digital menu, operating hours, and guest reviews
- Book a table for a specific date and time slot, with live capacity checking
- View personal reservation history with booking status
- Leave a review — restricted to restaurants you've actually booked

**For restaurant owners (`frontend-partner`)**
- One-time onboarding flow to register a restaurant profile
- Add and manage menu items by category (Appetizer, Main Course, Dessert, Beverage)
- View a live dashboard of all incoming bookings with guest details
- View aggregated ratings and read customer feedback

**Platform-wide**
- JWT authentication delivered via secure, HttpOnly cookies
- Role-based access control (`customer`, `restaurant_owner`, `admin`)
- Real-time seat-availability checks to prevent overbooking a time slot
- Auto-recalculated restaurant average rating on every new review

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router 7, Axios, Tailwind CSS v4 |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose 9 (ODM) |
| Auth | JSON Web Tokens (`jsonwebtoken`) + HttpOnly cookies (`cookie-parser`) |
| Security | `bcryptjs` password hashing, role-based middleware |
| Tooling | npm Workspaces, ESLint, Nodemon |
| CI/CD | GitHub Actions (install → audit → build both frontends on every push/PR to `main`) |

---

## 📁 Project Structure

```text
Restaurant-booking-app/
├── backend/
│   └── src/
│       ├── server.js              # Entry point — loads env, connects DB, starts server
│       ├── app.js                 # Express app setup & route mounting
│       ├── config/db.config.js    # MongoDB connection
│       ├── models/                # Mongoose schemas (User, Restaurant, Booking, Review)
│       ├── controllers/           # Business logic per resource
│       ├── routes/                # Route → controller mappings
│       └── middlewares/           # protect() and authorize() (RBAC)
│
├── frontend-client/                # Customer-facing app
│   └── src/
│       ├── pages/                 # Home, RestaurantDetails, MyBookings, Login, Register
│       ├── context/AuthContext.jsx
│       ├── hooks/UseAuth.js
│       └── components/            # Navbar, ProtectedRoute
│
├── frontend-partner/                # Restaurant owner dashboard
│   └── src/
│       ├── pages/                 # DashboardHome, ManageMenu, Profile, Login, Register
│       ├── context/AuthContext.jsx
│       ├── hooks/UseAuth.js
│       └── components/DashboardLayout.jsx
│
├── .github/workflows/ci-cd.yml     # GitHub Actions pipeline
└── package.json                    # Root workspace config
```

---

## 🧭 Architecture Overview

```
        MongoDB  ⇆  Mongoose ODM
                       │
              Express REST API (port 5080)
      /api/v1/auth   /api/v1/restaurants
      /api/v1/bookings   /api/v1/reviews
                       │
        ┌──────────────┴──────────────┐
        │                              │
frontend-client                 frontend-partner
(diners: search, book,          (owners: dashboard,
 review, view history)           menu editor, profile)
```

Both frontends are independent Vite apps that talk to the **same** backend and database, differentiated entirely by the logged-in user's `role`. Authentication uses a JWT signed by the backend and stored in an **HttpOnly cookie**, so the token is never exposed to client-side JavaScript. Every protected request is sent with `axios`'s `withCredentials: true` so the cookie is included automatically.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+ (CI runs on Node 24)
- A MongoDB instance — local (`mongod`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- npm v9+ (for Workspaces support)

### Installation

Clone the repo and install all workspace dependencies from the root — npm Workspaces will link `backend`, `frontend-client`, and `frontend-partner` in one go:

```bash
git clone https://github.com/architDaDev/Restaurant-booking-app.git
cd Restaurant-booking-app
npm install
```

### Environment Variables

The backend needs a `.env` file inside `backend/` (this is git-ignored and should **never** be committed). A template is provided at `backend/.env.example` — copy it and fill in your own values:

```bash
cp backend/.env.example backend/.env
```

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | API server port (defaults to `5080`) |
| `NODE_ENV` | Recommended | `development` or `production` — toggles the `secure` flag on the auth cookie |
| `MONGO_URI` | **Yes** | MongoDB connection string |
| `JWT_SECRET` | **Yes** | Secret used to sign/verify JWTs |

> **Security note:** Don't put real credentials in `.env.example`, in this README, or anywhere else in the repo. For local development, generate your own `JWT_SECRET` (e.g. `openssl rand -base64 32`) and use your own MongoDB URI. When deploying, set these as environment variables/secrets directly in your hosting provider's dashboard (Render, Railway, Vercel, etc.) rather than in any file that gets committed — and use a different `JWT_SECRET` and database for production than for local development.

### Running the App

Each part of the monorepo runs on its own dev server. Open three terminals from the project root:

```bash
# Terminal 1 — API server (http://localhost:5080)
npm run dev:backend

# Terminal 2 — Customer app (Vite default: http://localhost:5173)
npm run dev:client

# Terminal 3 — Partner dashboard (Vite will pick the next free port, e.g. http://localhost:5174)
npm run dev:partner
```

Once running:
1. Register a **restaurant_owner** account in the partner app and set up a restaurant profile.
2. Add a few menu items.
3. Register a **customer** account in the client app, search for the restaurant, and book a table.

---

## 📡 API Reference

Base URL: `http://localhost:5080/api/v1`

### Auth (`/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/register` | Public | Create an account. Body: `{ name, email, password, role, phoneNumber }` |
| `POST` | `/login` | Public | Authenticate. Body: `{ email, password }` |
| `GET` | `/logout` | Public | Clears the auth cookie |

### Restaurants (`/restaurants`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Public | List/search restaurants. Query: `?city=&cuisine=` |
| `GET` | `/:id` | Public | Get a single restaurant (includes menu) |
| `POST` | `/` | `restaurant_owner` | Create a restaurant profile (one per owner) |
| `POST` | `/:id/menu` | `restaurant_owner` | Add a menu item |

### Bookings (`/bookings`) — all require authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/` | `customer` | Create a reservation. Body: `{ restaurantId, bookingDate, timeSlot, guestCount }` |
| `GET` | `/my-reservations` | `customer` | Get the logged-in customer's bookings |
| `GET` | `/dashboard` | `restaurant_owner` | Get all bookings for the owner's restaurant |

### Reviews (`/reviews`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/restaurant/:restaurantId` | Public | Get all reviews for a restaurant |
| `POST` | `/` | `customer` | Leave a review (requires a prior booking). Body: `{ restaurantId, rating, comment }` |

---

## 🗄 Database Schema

**User** — `name`, `email` (unique), `password` (hashed, hidden by default), `role` (`customer` / `restaurant_owner` / `admin`), `phoneNumber`

**Restaurant** — `ownerId` (→ User), `name`, `cuisineType[]`, `address`, `menu[]` (embedded dish sub-documents), `capacity`, `operatingHours`, `averageRating`

**Booking** — `customerId` (→ User), `restaurantId` (→ Restaurant), `bookingDate`, `timeSlot`, `guestCount`, `status` (`pending` / `confirmed` / `cancelled` / `completed`), `specialRequests`

**Review** — `customerId` (→ User), `restaurantId` (→ Restaurant), `rating` (1–5), `comment` — a post-save hook automatically recalculates the parent restaurant's `averageRating`.

---

## 📜 Available Scripts

Run from the project root:

| Script | Description |
|---|---|
| `npm run dev:backend` | Start the API with Nodemon (auto-restarts on changes) |
| `npm run dev:client` | Start the customer app's Vite dev server |
| `npm run dev:partner` | Start the partner dashboard's Vite dev server |

Inside `frontend-client/` or `frontend-partner/` individually: `npm run build`, `npm run preview`, `npm run lint` are also available.

---

## 🧩 Roadmap / Known Limitations

- No `/auth/me` endpoint yet — session restoration on page load currently relies on a cached user object in `localStorage` rather than re-validating the cookie against the server.
- Booking capacity checks are not wrapped in a database transaction, so there's a theoretical race condition under simultaneous bookings for the same slot.
- No pagination on restaurant listing or booking history endpoints.
- No image upload support for restaurants or menu items.
- One restaurant per owner account — no support yet for multi-location owners.
- No automated test suite.

Contributions and suggestions are welcome — feel free to open an issue or PR.

---

## 📄 License

No license file is currently included in this repository. Add one (e.g., MIT) if you intend for others to reuse this code.
