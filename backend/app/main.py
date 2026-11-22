from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

load_dotenv()

from app.routes import schemes, eligibility, assistant, health

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("SchemeFinder AI backend starting...")
    yield
    print("SchemeFinder AI backend shutting down.")

app = FastAPI(
    title="SchemeFinder AI API",
    description="API for discovering Indian government schemes based on citizen profile",
    version="1.0.0",
    lifespan=lifespan
)

cors_origins_raw = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000")
cors_origins = [o.strip() for o in cors_origins_raw.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(schemes.router, prefix="/api")
app.include_router(eligibility.router, prefix="/api")
app.include_router(assistant.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "SchemeFinder AI API is running. Visit /docs for API documentation."}
