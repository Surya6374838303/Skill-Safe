from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import os
import json
import asyncio
from typing import List

from .database import engine, Base
from .routers import (
    readings,
    inspections,
    dashboard,
    workers,
    alerts,
    digital_twin,
    analysis,
    reports,
    assessment,
)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SkillSafe API — AI-Powered Gas Safety & Digital Twin Platform",
    description="Backend REST API and WebSocket streaming service for Smart India Hackathon 2026.",
    version="1.0.0",
)

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(readings.router)
app.include_router(inspections.router)
app.include_router(dashboard.router)
app.include_router(workers.router)
app.include_router(alerts.router)
app.include_router(digital_twin.router)
app.include_router(analysis.router)
app.include_router(reports.router)
app.include_router(assessment.router)

# WebSocket Connection Manager for Live Dashboard Telemetry
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except Exception:
                pass

manager = ConnectionManager()

@app.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo or broadcast incoming telemetry bursts
            await manager.broadcast({"type": "telemetry_update", "data": data})
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/")
def root():
    return {
        "service": "SkillSafe Backend API",
        "version": "1.0.0",
        "event": "Smart India Hackathon 2026",
        "status": "online",
        "docs_url": "/docs",
        "tagline": "See the Risk. Protect the Worker.",
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "skillsafe-api"}
