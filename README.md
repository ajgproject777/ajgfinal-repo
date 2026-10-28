# DineGo — AI-Powered Smart Travel Dining Assistant

DineGo is an AI-powered smart travel dining assistant designed for intercity and highway travellers. The platform optimizes highway route-based dining by discovering restaurants along an active trip with minimal detour time, coordinating meal pre-orders synchronized with real-time transit ETA, and managing reserved parking.

---

## 1. System Architecture

The project consists of three core applications and a shared database layer:

1. **Customer Mobile App** (`/` and `src/`): Cross-platform React Native mobile application built on Expo SDK 57, TypeScript, and Expo Router.
2. **Web Partner & Admin Portal** (`web-dashboard/`): Modern React + Vite + TypeScript web application for restaurant owners and platform operators.
3. **Backend API Service** (`backend/`): High-performance asynchronous FastAPI service with versioned `/api/v1` routing, SQLAlchemy 2.0 ORM, and Pydantic validation.
4. **Database** (PostgreSQL): Enterprise relational database using AsyncPG driver with Alembic schema migrations.

---

## 2. Prerequisites

- **Node.js**: v18.0.0 or later (v20+ recommended)
- **Python**: v3.9 or later (tested on Python 3.9.6 macOS)
- **PostgreSQL**: v14 or later (Postgres.app or Homebrew on macOS)

---

## 3. Quick Start Guide

### Step 1: Environment Configuration
Copy the template files to create local environment configurations:
```bash
# Root template (contains mobile, web, and backend settings)
cp .env.example .env

# Backend local configuration
cp backend/.env.example backend/.env

# Web dashboard local configuration
cp web-dashboard/.env.example web-dashboard/.env
```

---

### Step 2: Start the FastAPI Backend

1. Navigate to the `backend/` directory and activate the virtual environment:
   ```bash
   cd backend
   source .venv/bin/activate
   ```
2. Run automated tests to verify backend integrity:
   ```bash
   pytest
   ```
3. Test database connectivity:
   ```bash
   python -m app.check_db
   ```
4. Start the backend development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
- Interactive API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
- Versioned Health Endpoint: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)
- Root Health Endpoint: [http://localhost:8000/health](http://localhost:8000/health)

---

### Step 3: Start the Customer Mobile App

From the project root directory:
```bash
# Start the Expo development server
npx expo start
```
- Press `i` to launch in the iOS Simulator.
- Press `a` to launch in the Android Emulator.
- Scan the on-screen QR code using **Expo Go** on a physical device connected to the same Wi-Fi network.

*Note on Demo Mode*: By default, `EXPO_PUBLIC_DEMO_MODE=true` in `.env`, allowing complete UI testing of login, registration, and discovery without requiring a live database connection.

---

### Step 4: Start the Web Dashboard

1. Navigate to `web-dashboard/`:
   ```bash
   cd web-dashboard
   npm run dev
   ```
2. Open your browser at [http://localhost:5173](http://localhost:5173). The dashboard includes a live status indicator confirming backend connectivity.

---

## 4. PostgreSQL Setup on macOS

PostgreSQL is strictly required (SQLite is disallowed in DineGo). Follow either setup method:

### Option A: Postgres.app (Recommended GUI)
1. Download **Postgres.app** from [https://postgresapp.com](https://postgresapp.com).
2. Move it to `/Applications` and open the app.
3. Click **"Initialize"** to start the PostgreSQL server on port 5432.
4. Create the DineGo application database:
   ```bash
   createdb dinego
   ```

### Option B: Homebrew (Command-Line)
1. Install and start PostgreSQL 16:
   ```bash
   brew install postgresql@16
   brew services start postgresql@16
   ```
2. Create the database:
   ```bash
   createdb dinego
   ```

3. Verify connectivity using the DineGo diagnostic command:
   ```bash
   cd backend && .venv/bin/python -m app.check_db
   ```

---

## 5. Verification Commands

Run the following checks from the project root:

```bash
# 1. Typecheck the mobile application
npx tsc --noEmit

# 2. Build the web dashboard
cd web-dashboard && npm run build && cd ..

# 3. Run backend unit & integration tests
cd backend && .venv/bin/pytest && cd ..

# 4. Check database connectivity
cd backend && .venv/bin/python -m app.check_db && cd ..
```

---

## 6. Project Documentation Directory

Detailed architectural and roadmap documentation is located in the `docs/` directory:
- [Project Overview](file:///Users/joseph/Desktop/dinego-mobile/docs/project-overview.md)
- [Architecture Overview](file:///Users/joseph/Desktop/dinego-mobile/docs/architecture-overview.md)
- [Development Roadmap](file:///Users/joseph/Desktop/dinego-mobile/docs/development-roadmap.md)
