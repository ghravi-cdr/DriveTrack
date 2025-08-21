from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from .routers import auth, drivers, logs, profile
from .database import get_db

app = FastAPI(title="Driver Management API", version="1.0.0")
origins = [
    os.getenv("FRONTEND_ORIGIN", "http://localhost:5173"),
    os.getenv("FRONTEND_ORIGIN2", "http://127.0.0.1:5173"),
    os.getenv("FRONTEND_ORIGIN3", "http://localhost:5174"),
    os.getenv("FRONTEND_ORIGIN4", "http://127.0.0.1:5174"),
]
# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(drivers.router, prefix="/api/drivers", tags=["drivers"])
app.include_router(logs.router, prefix="/api/logs", tags=["logs"])
app.include_router(profile.router, prefix="/api/profile", tags=["profile"])

@app.get("/")
async def root():
    return {"status": "ok", "service": "driver-mgmt"}

@app.get("/health")
async def health():
    """Simple health check: verifies MongoDB connection by calling get_db and pinging."""
    try:
        db = await get_db()
        await db.command("ping")   # <-- fixed
        return {"status": "ok", "db": "connected"}
    except Exception as e:
        return {"status": "error", "db": "unavailable", "detail": str(e)}
