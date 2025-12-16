from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load env variables first, before importing other modules that might use them
load_dotenv()

from .routers import chat
import os
from .database import engine, Base
from . import models # Import models so they are registered
from .telemetry import setup_telemetry

# Create Tables
try:
    # Ensure models are imported before this runs
    Base.metadata.create_all(bind=engine)
    print("--- SUCCESS: Database tables created successfully! ---")
except Exception as e:
    print("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    print("CRITICAL ERROR: Could not connect to the database or create tables.")
    print("Please check your password in be/.env file.")
    print("Error details:", str(e))
    print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n")

app = FastAPI(title="Madlen AI Backend")
# Removed duplicate lines

# Setup OpenTelemetry
setup_telemetry(app, engine)


# CORS setup for frontend communication
origins = [
    "*", # Allow all for dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Madlen AI API"}

app.include_router(chat.router)
# Trigger reload
