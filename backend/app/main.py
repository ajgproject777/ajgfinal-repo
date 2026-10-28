import logging
from fastapi import FastAPI, APIRouter, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.core.logging import setup_logging
from app.routers import auth, users
from app.schemas.auth import HealthResponse

# Initialize centralized logging
setup_logging(level="DEBUG" if settings.ENVIRONMENT == "development" else "INFO")
logger = logging.getLogger("dinego.main")

app = FastAPI(
    title="DineGo Backend API",
    description="Route-Based Restaurant Reservation Platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Centralized Exception Handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "status_code": exc.status_code},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    # Format validation errors cleanly without exposing internals
    sanitized_errors = [
        {"loc": err.get("loc"), "msg": err.get("msg"), "type": err.get("type")}
        for err in errors
    ]
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": sanitized_errors, "status_code": 422},
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled server exception on %s %s: %s", request.method, request.url.path, str(exc), exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error occurred.", "status_code": 500},
    )

# Configure CORS
origins = settings.cors_origins
if not origins:
    origins = [
        "http://localhost:8081",
        "http://localhost:8082",
        "http://127.0.0.1:8081",
        "http://localhost:5173",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)

# Versioned API v1 Router
api_v1_router = APIRouter(prefix="/api/v1")

@api_v1_router.get("/health", response_model=HealthResponse, tags=["Health"])
async def api_v1_health_check():
    """Versioned health check endpoint verifying service operational status."""
    return HealthResponse(
        status="ok",
        app="DineGo Backend API",
        version="1.0.0",
        environment=settings.ENVIRONMENT,
    )

# Mount Routers under /api/v1
api_v1_router.include_router(auth.router)
api_v1_router.include_router(users.router)

# Mount the /api/v1 router
app.include_router(api_v1_router)

# Backward-compatible root mounts (preserve existing mobile and test routes)
app.include_router(auth.router)
app.include_router(users.router)

@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Root health check endpoint to preserve existing integrations."""
    return HealthResponse(
        status="ok",
        app="DineGo Backend API",
        version="1.0.0",
        environment=settings.ENVIRONMENT,
    )

@app.get("/", tags=["Health"])
async def root():
    return {
        "message": "Welcome to DineGo API",
        "docs": "/docs",
        "health": "/health",
        "api_v1": "/api/v1/health",
    }
