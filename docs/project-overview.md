# DineGo — Project Overview

## 1. Executive Summary

**DineGo** is an AI-powered smart travel dining assistant designed for long-distance highway and intercity travellers. Unlike conventional restaurant discovery applications (such as Yelp, Google Maps, or Zomato) that focus on radial distance from a static user location, DineGo specializes in **route-based discovery**:
- Identifying dining options along an active navigation route with minimal detour time.
- Pre-ordering meals to ensure food is ready precisely upon arrival based on real-time ETA.
- Reserving dining slots and dedicated highway parking spaces.
- Connecting travellers, highway restaurant owners, parking coordinators, and platform operators in a cohesive ecosystem.

---

## 2. Platform Architecture & Actors

| Actor | Primary Interface | Core Responsibilities |
| :--- | :--- | :--- |
| **Traveller / Customer** | Mobile App (React Native / Expo) | Route entry, AI dining recommendations, meal pre-ordering, parking reservation, real-time ETA updates. |
| **Restaurant Owner / Staff** | Web Portal (React / Vite) | Menu management, slot scheduling, order prep queue, arrival alerts. |
| **Parking Coordinator / Security** | Web Portal / Mobile Lite | Vehicle bay allocation, arrival scanning, bay release management. |
| **System Administrator** | Web Portal (React / Vite) | Restaurant verification, platform telemetry, dispute resolution, analytics. |

---

## 3. Technology Stack

- **Mobile Application**: React Native (0.86), Expo SDK 57, TypeScript, Expo Router (file-based navigation).
- **Web Dashboard**: React 18, Vite 6, TypeScript, modern dark luxury UI design.
- **Backend Service**: Python 3.9+, FastAPI, Pydantic v2 & Pydantic Settings.
- **Database**: PostgreSQL (mandatory production & local database), asyncpg driver.
- **ORM & Migrations**: SQLAlchemy 2.0 (async), Alembic.
- **Testing**: pytest & pytest-asyncio for backend; TypeScript compiler & Expo Doctor for mobile; Vite build & TypeScript for web.
- **Planned External Integrations**:
  - Google Maps Platform (Directions API, Routes API, Places API).
  - AI Recommendation Engine (meal preference filtering & detour optimization).
  - Payment Gateway (Razorpay / Stripe).
  - Push Notifications & SMS/WhatsApp alerts.

---

## 4. Current Implementation Status (Phase 1 Baseline)

### Fully Implemented & Verified in Phase 1
- **Customer Mobile**:
  - Expo Router app entry and stack navigation (`src/app/`).
  - Auth screens: Login, Registration, Forgot Password with input validation.
  - Tab navigation scaffolding: Home (Route Search), Route Map, Bookings, Profile.
  - Reusable HTTP API client (`src/services/apiClient.ts`).
  - Safe environment variable configuration (`EXPO_PUBLIC_API_BASE_URL`, `EXPO_PUBLIC_DEMO_MODE`).
  - Shared TypeScript type definitions (`src/types/index.ts`).
- **FastAPI Backend**:
  - Modular application initialization with versioned `/api/v1` and root routing.
  - Dual health endpoints: `GET /api/v1/health` and `GET /health`.
  - Interactive OpenAPI Swagger documentation at `/docs` and ReDoc at `/redoc`.
  - Centralized structured logging (`app.core.logging`).
  - Centralized exception handlers for HTTP, validation, and unhandled errors.
  - Strict PostgreSQL requirement (SQLite is strictly disallowed and rejected).
  - Diagnostic database connectivity check (`app.check_db` CLI and `check_database_connection` API).
  - SQLAlchemy 2.0 async engine and session factory (`app.core.database`).
  - 100% passing automated test suite with pytest.
- **Web Partner Dashboard**:
  - React + Vite + TypeScript web application in `web-dashboard/`.
  - Modern DineGo dark brand theme with responsive layout and status indicators.
  - Environment-based API configuration (`VITE_API_BASE_URL`).
  - Live backend health monitoring hook and reusable API client.
  - Verified production build (`npm run build`).

### Planned for Subsequent Phases (Explicitly Out of Scope for Phase 1)
- Live payment transactions.
- Google Maps polyline route extraction and corridor search.
- Machine learning / AI personalized meal ranking algorithms.
- Full restaurant menu editor and live order dispatch.
- Parking spot check-in barcode scanner.
