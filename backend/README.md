# DineGo Backend (FastAPI + SQLAlchemy + PostgreSQL)

This is the shared backend for the DineGo traveller mobile application and future restaurant-owner web dashboard.

## Requirements
- Python 3.9+ (tested on Python 3.9.6 macOS)
- PostgreSQL 14+ (Recommended on macOS: [Postgres.app](https://postgresapp.com))

---

## Local Setup Instructions (macOS)

### 1. Install & Start PostgreSQL via Postgres.app
1. Download **Postgres.app** with PostgreSQL 16 from [https://postgresapp.com](https://postgresapp.com).
2. Move it to `/Applications` and open it.
3. Click **"Initialize"** to start the PostgreSQL server on port 5432.
4. Double-click the `postgres` database in Postgres.app to open the psql shell, or run in your terminal:
   ```bash
   createdb dinego
   ```

### 2. Set Up Python Virtual Environment
Navigate to this `backend/` directory:
```bash
cd /Users/joseph/Desktop/dinego-mobile/backend
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Configure Environment Variables
Copy the template and configure your database connection:
```bash
cp .env.example .env
```
Generate a secure random secret key:
```bash
openssl rand -hex 32
```
Update `SECRET_KEY` in `.env` with the generated value, and verify `DATABASE_URL` matches your local PostgreSQL username.

### 4. Run Database Migrations
Apply the initial schema migrations:
```bash
alembic upgrade head
```

### 5. Start the Development Server
```bash
uvicorn app.main:app --reload --port 8000
```
- API Base URL: `http://localhost:8000`
- Interactive Swagger Documentation: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`
