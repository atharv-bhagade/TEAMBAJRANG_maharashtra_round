"""Fair Drop MVP backend.

Run from the backend/ folder:
    python -m uvicorn app.main:app --reload
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import fair_drop

app = FastAPI(title="Fair Drop API", version="0.1.0")

# Open CORS for local development (Flutter web / emulator).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(fair_drop.router)


@app.get("/")
def root():
    return {"name": "Fair Drop API", "status": "running", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}
