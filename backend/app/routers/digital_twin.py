from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import SensorReading, Inspection
from ..services.analysis_engine import analyzer_engine

router = APIRouter(prefix="/api/digital-twin", tags=["digital-twin"])

@router.get("/{inspection_id}")
def get_digital_twin_data(inspection_id: str, db: Session = Depends(get_db)):
    """
    Returns spatial section telemetry (P1..P5), worker traversal position,
    and current probable hazard zones for the 3D/2D Digital Twin model.
    """
    # Sample section data defaults
    sections = [
        {"id": "P1", "name": "Header Intake", "gas_reading": 12.4, "vibration_reading": 0.18, "status": "normal"},
        {"id": "P2", "name": "Coupling Segment A", "gas_reading": 18.2, "vibration_reading": 0.24, "status": "normal"},
        {"id": "P3", "name": "Relief Bypass Tee", "gas_reading": 48.6, "vibration_reading": 0.45, "status": "warning"},
        {"id": "P4", "name": "Stress Weld Joint #4", "gas_reading": 138.9, "vibration_reading": 1.28, "status": "critical"},
        {"id": "P5", "name": "Terminal Orifice", "gas_reading": 22.0, "vibration_reading": 0.29, "status": "normal"},
    ]

    analysis = analyzer_engine.analyze(sections)

    return {
        "inspection_id": inspection_id,
        "pipeline_model": "P1_TO_P5_INDUSTRIAL_RIG",
        "current_worker_section": "P4",
        "sections": sections,
        "probable_hazard_zone": analysis["probable_zone"],
        "confidence": analysis["confidence"],
        "disclaimer": "Digital Twin visualizes sensor telemetry. It does not independently certify gas containment integrity."
    }
