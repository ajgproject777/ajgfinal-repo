# DineGo — Architecture Overview

## 1. System Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT LAYER                                     |
|                                                                                   |
|   +------------------------------------+   +----------------------------------+   |
|   |   Customer Mobile Application      |   |   Web Partner & Admin Portal     |   |
|   |   - React Native (0.86) + Expo 57  |   |   - React 18 + Vite 6            |   |
|   |   - Expo Router (Typed Routes)     |   |   - TypeScript                   |   |
|   |   - Reusable Mobile API Client     |   |   - Reusable Web API Client      |   |
|   +-----------------+------------------+   +-----------------+----------------+   |
+---------------------|----------------------------------------|--------------------+
                      |                                        |
                      |  HTTPS / JSON                          |  HTTPS / JSON
                      |  Bearer JWT                            |  Bearer JWT
                      v                                        v
+-----------------------------------------------------------------------------------+
|                                 SERVICES LAYER                                    |
|                                                                                   |
|   +---------------------------------------------------------------------------+   |
|   |                              FastAPI Service                              |   |
|   |   - CORS Middleware (Configurable Allowed Origins)                        |   |
|   |   - Centralized Logging & Exception Handling                              |   |
|   |   - Versioned Routing (/api/v1) + Backward Compatible Aliases             |   |
|   |   - Routers: Auth, Users, (Future: Restaurants, Bookings, Parking)        |   |
|   |   - Pydantic v2 Schemas & Settings Validation                             |   |
|   |   - Diagnostic Database Connectivity Inspector                            |   |
|   +-------------------------------------+-------------------------------------+   |
+-----------------------------------------|-----------------------------------------+
                                          |
                                          | AsyncPG (Async Engine)
                                          | Connection Pool (size=10, overflow=20)
                                          v
+-----------------------------------------------------------------------------------+
|                                  DATA LAYER                                       |
|                                                                                   |
|   +---------------------------------------------------------------------------+   |
|   |                          PostgreSQL 14+ Database                          |   |
|   |   - SQLAlchemy 2.0 Async Session Management                               |   |
|   |   - UUID Primary Keys & UTC Timestamps                                    |   |
|   |   - Models: User, RefreshToken, Restaurant, RestaurantVerification        |   |
|   |   - Alembic Async Database Migrations                                     |   |
|   +---------------------------------------------------------------------------+   |
+-----------------------------------------------------------------------------------+
```

---

## 2. Directory Layout & Workspace Organization

```
dinego-mobile/
├── .env.example              # Workspace unified environment template
├── .gitignore                # Workspace git ignore (secrets, build artifacts)
├── README.md                 # Primary project documentation & startup guide
├── App.tsx                   # Standalone root component fallback
├── app.json                  # Expo application configuration & plugins
├── package.json              # Mobile app dependencies & scripts
├── tsconfig.json             # Mobile TypeScript configuration (excludes web/backend)
│
├── assets/                   # App icons, splash screens, and image assets
├── src/                      # Mobile application source
│   ├── app/                  # Expo Router file-based screens and navigators
│   │   ├── _layout.tsx       # Root layout (SplashScreen, Fonts, AuthProvider)
│   │   ├── index.tsx         # Entry redirector (/home vs /login)
│   │   ├── (auth)/           # Authentication stack (login, register, forgot-password)
│   │   └── (tabs)/           # Core application tabs (home, map, bookings, profile)
│   ├── components/           # Reusable UI components (buttons, text fields, banners)
│   ├── screens/              # Screen presentation components
│   ├── services/             # API client & domain service facades
│   │   ├── apiClient.ts      # Reusable HTTP client with error & timeout handling
│   │   ├── authService.ts    # Authentication API bridge (demo mode toggleable)
│   │   └── restaurantService.ts # Restaurant query service facade
│   ├── store/                # Application state (auth context & session)
│   ├── theme/                # Design tokens, typography, colors, font loaders
│   ├── types/                # Shared TypeScript type definitions
│   └── config.ts             # App configuration reading EXPO_PUBLIC_* variables
│
├── backend/                  # FastAPI backend service
│   ├── .env.example          # Backend-specific environment template
│   ├── requirements.txt      # Python dependencies (pinned versions)
│   ├── pytest.ini            # Pytest execution settings
│   ├── alembic.ini           # Alembic database migration configuration
│   ├── alembic/              # Alembic migration scripts and env.py
│   ├── app/                  # Application source
│   │   ├── main.py           # FastAPI initialization, CORS, exception handlers, /api/v1
│   │   ├── dependencies.py   # Database session & current user dependencies
│   │   ├── check_db.py       # Standalone CLI database diagnostic command
│   │   ├── core/             # Configuration, logging, database engine, security
│   │   │   ├── config.py     # Pydantic Settings with SQLite rejection & secret check
│   │   │   ├── database.py   # SQLAlchemy async engine, session factory, masked URL
│   │   │   ├── logging.py    # Centralized logging configuration
│   │   │   └── security.py   # Bcrypt hashing & PyJWT token utilities
│   │   ├── models/           # SQLAlchemy 2.0 ORM models
│   │   ├── routers/          # Route handlers (auth, users)
│   │   └── schemas/          # Pydantic request & response schemas
│   └── tests/                # Pytest test suite (health, config, database)
│
├── web-dashboard/            # React + Vite web dashboard
│   ├── .env.example          # Web dashboard environment template
│   ├── index.html            # Web application HTML entry
│   ├── package.json          # Dependencies & scripts (dev, build, preview)
│   ├── vite.config.ts        # Vite configuration (port 5173, React plugin)
│   ├── tsconfig.json         # Web TypeScript compiler configuration
│   └── src/                  # Web dashboard source
│       ├── main.tsx          # DOM root mount
│       ├── App.tsx           # Layout wrapping
│       ├── index.css         # Dark luxury brand styling
│       ├── components/       # Header, StatusBadge
│       ├── layouts/          # DashboardLayout
│       ├── pages/            # WelcomePage
│       ├── services/         # apiClient.ts
│       ├── hooks/            # useHealth.ts
│       └── types/            # Shared interfaces
│
└── docs/                     # Project documentation
    ├── project-overview.md
    ├── architecture-overview.md
    └── development-roadmap.md
```

---

## 3. Database & Persistence Layer Design

### Strict PostgreSQL Enforcement
PostgreSQL is the only supported database. DineGo enforces this at the application configuration level:
- In `backend/app/core/config.py`, a Pydantic field validator examines `DATABASE_URL`.
- URLs beginning with `sqlite` raise an immediate `ValueError` at startup.
- URLs must begin with `postgresql+asyncpg://` or `postgresql://`.

### Connection Security & Masked Credentials
- `app.core.database.get_masked_db_url()` sanitizes passwords from connection strings before logging or diagnostic display (e.g. `postgresql+asyncpg://user:***@localhost:5432/dinego`).
- Database errors caught by central exception handlers return safe error descriptions without leaking tracebacks or credentials to clients.

### Alembic Migration Configuration
- `backend/alembic/env.py` reads `DATABASE_URL` dynamically from `app.core.config.settings`.
- It connects using `async_engine_from_config` and executes migrations through `run_sync`.
- Target metadata binds to `app.models.base.Base.metadata`.

---

## 4. Security & Configuration Best Practices

1. **No Secrets in Client Builds**: Neither the Expo mobile bundle nor the Vite web bundle contains database passwords, private keys, or server secrets. All public mobile/web environment variables are prefixed with `EXPO_PUBLIC_` or `VITE_`.
2. **CORS Control**: `backend/app/main.py` enforces configurable CORS origins via `settings.cors_origins` (parsed from `ALLOWED_ORIGINS`).
3. **Password Security**: Passwords are saved only as salted bcrypt hashes (`app.core.security.hash_password`).
4. **Git Protection**: `.gitignore` strictly excludes `.env`, `.env.local`, `.env.*.local`, `*.pem`, `*.key`, and private virtual environments.
