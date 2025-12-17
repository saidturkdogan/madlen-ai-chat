from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from .routers import chat
import os
from .core.database import engine, Base
from . import models
from .core.telemetry import setup_telemetry

try:
    Base.metadata.create_all(bind=engine)
    print("--- SUCCESS: Database tables created successfully! ---")
except Exception as e:
    print("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    print("CRITICAL ERROR: Could not connect to the database or create tables.")
    print("Please check your password in be/.env file.")
    print("Error details:", str(e))
    print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n")

app = FastAPI(title="Madlen AI Backend")

setup_telemetry(app, engine)

origins = ["*"]

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
