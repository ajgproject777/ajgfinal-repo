# DineGo — Development Roadmap

## Phase 1: Existing Project Preservation & Foundation Setup (Current Phase — Completed)
- [x] Complete code and architectural audit of active workspace.
- [x] Backend service initialization with versioned `/api/v1` and dual health endpoints.
- [x] OpenAPI schema generation at `/docs`.
- [x] Centralized logging and exception handling.
- [x] Strict PostgreSQL validation (explicitly disallowing SQLite fallback).
- [x] Diagnostic database connectivity utility (`app.check_db`) with credential masking.
- [x] Alembic configuration verification.
- [x] Preservation of existing Expo mobile screens (Login, Register, Forgot Password, Tab routing).
- [x] Mobile reusable HTTP API client with timeout and safe environment variable handling.
- [x] React + Vite web dashboard foundation with real-time health indicator.
- [x] 100% automated test coverage for backend health, configuration, and database diagnostics.
- [x] Comprehensive documentation in `docs/` and root `README.md`.

---

## Phase 2: Route Corridor Search & AI Recommendation Engine
*Prerequisites: Phase 1 approval, Google Maps API key, PostgreSQL service operational.*
- [ ] Connect mobile application to backend authentication endpoints (`/api/v1/auth/*`).
- [ ] Implement Google Maps Platform integration:
  - Mobile SDK map rendering on Route Map screen.
  - Backend Directions & Routes API integration to fetch route polyline coordinates.
- [ ] Build Highway Corridor Search algorithm:
  - Spatial bounding box along route polyline segments.
  - Calculate perpendicular detour distance ($d_{\text{detour}}$) and detour duration ($\Delta t$).
  - Filter restaurants exceeding traveller max-detour threshold (e.g. $\le 2.0$ km).
- [ ] Build AI Recommendation Service:
  - Filter by dietary preferences (e.g. Veg, Halal, Jain, Fast food).
  - Score restaurants based on rating, detour penalty, prep-time efficiency, and parking availability.

---

## Phase 3: Pre-Orders, Slot Reservations & Payment Gateway
*Prerequisites: Phase 2 route search, Payment gateway merchant account.*
- [ ] Dining slot inventory management (table capacity and time-window allocation).
- [ ] Pre-order dining cart & checkout workflow in mobile application.
- [ ] Payment gateway integration (Razorpay / Stripe) with webhook verification.
- [ ] Real-time ETA synchronization:
  - Adjust estimated prep start time according to traveller live transit updates.
  - Notify restaurant kitchen when traveller enters a 15-minute geofenced proximity.

---

## Phase 4: Restaurant Partner & Parking Coordinator Portals
*Prerequisites: Phase 3 order data models.*
- [ ] Restaurant Partner Web Dashboard:
  - Real-time incoming pre-order kitchen display system (KDS).
  - Menu item management, price adjustment, and 86'ing sold-out items.
  - Table slot scheduling configuration.
- [ ] Parking Coordinator Module:
  - Dedicated vehicle bay allocation per pre-order.
  - QR code scanning for arrival verification and bay assignment.
- [ ] Platform Administration & Verification:
  - Restaurant KYC and food-safety certification verification workflow.
  - Platform audit log and system telemetry.

---

## Phase 5: Production Deployment, Load Testing & Academic Presentation
*Prerequisites: Phases 1–4 completion.*
- [ ] Production deployment via EAS Build (mobile APK / iOS archive) and cloud server (Docker / AWS / DigitalOcean).
- [ ] Automated end-to-end load testing with Locust.
- [ ] Comprehensive B.Tech project report, thesis documentation, and defense demonstration slides.
