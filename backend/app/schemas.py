from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class SensorReadingCreate(BaseModel):
    device_id: str
    worker_id: Optional[str] = None
    timestamp: Optional[datetime] = None
    gas_reading: float = Field(..., ge=0.0, description="Calibrated gas concentration (ppm)")
    gas_unit: str = "ppm CH4 eq."
    vibration_reading: float = Field(..., ge=0.0, description="Contact vibration / acoustic RMS")
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    section_id: str
    distance_cm: Optional[float] = None
    battery_percent: Optional[int] = Field(None, ge=0, le=100)
    connectivity_status: Optional[str] = "online"
    alert_level: Optional[str] = "nominal"

class SensorReadingResponse(SensorReadingCreate):
    id: int
    inspection_id: str

    class Config:
        from_attributes = True

class InspectionStartRequest(BaseModel):
    worker_id: str
    device_id: str
    inspected_sections: List[str] = ["P1"]

class InspectionCompleteRequest(BaseModel):
    trainer_notes: Optional[str] = None

class InspectionResponse(BaseModel):
    id: str
    worker_id: str
    worker_name: Optional[str] = None
    device_id: str
    start_time: datetime
    end_time: Optional[datetime] = None
    status: str
    inspected_sections: List[str]
    trainer_notes: Optional[str] = None
    probable_hazard_zone: Optional[str] = None

    class Config:
        from_attributes = True

class AlertAcknowledgeRequest(BaseModel):
    supervisor_notes: Optional[str] = None

class AlertResponse(BaseModel):
    id: str
    inspection_id: Optional[str] = None
    worker_name: str
    alert_type: str
    severity: str
    section_id: str
    message: str
    created_at: datetime
    acknowledged_at: Optional[datetime] = None
    acknowledgement_status: str

    class Config:
        from_attributes = True

class AnalysisRequest(BaseModel):
    inspection_id: str
    force_rule_based: bool = True

class AnalysisResponse(BaseModel):
    id: str
    inspection_id: str
    model_version: str
    analysis_type: str
    probable_zone: str
    confidence: Optional[float] = None
    explanation: List[str]
    section_scores: Dict[str, float]
    created_at: datetime

class DashboardSummaryResponse(BaseModel):
    total_workers: int
    workers_inspecting: int
    completed_today: int
    active_alerts: int
    devices_online: int
    devices_offline: int
    inspections_requiring_review: int

class AssessmentCreate(BaseModel):
    inspection_id: str
    trainer_id: str
    trainer_name: str
    worker_name: str
    scores: Dict[str, int]
    feedback: str

class AssessmentResponse(AssessmentCreate):
    id: str
    assessment_status: str
    created_at: datetime

    class Config:
        from_attributes = True
