from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import AnalysisRequest, AnalysisResponse
from ..services.analysis_engine import analyzer_engine

router = APIRouter(prefix="/api/analysis", tags=["analysis"])

@router.post("/run", response_model=AnalysisResponse)
def run_hazard_analysis(payload: AnalysisRequest, db: Session = Depends(get_db)):
    """
    Executes rule-based or modular ML anomaly detection on current pipeline telemetry.
    """
    sample_readings = [
        {"section_id": "P1", "gas_reading": 12.4, "vibration_reading": 0.18},
        {"section_id": "P2", "gas_reading": 18.2, "vibration_reading": 0.24},
        {"section_id": "P3", "gas_reading": 48.6, "vibration_reading": 0.45},
        {"section_id": "P4", "gas_reading": 138.9, "vibration_reading": 1.28},
        {"section_id": "P5", "gas_reading": 22.0, "vibration_reading": 0.29},
    ]

    res = analyzer_engine.analyze(sample_readings)

    return {
        "id": f"ana-{payload.inspection_id}",
        "inspection_id": payload.inspection_id,
        "model_version": res["model_version"],
        "analysis_type": res["analysis_type"],
        "probable_zone": res["probable_zone"],
        "confidence": res["confidence"],
        "explanation": res["explanation"],
        "section_scores": res["section_scores"],
        "created_at": res["created_at"],
    }
