from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import datetime
from ..database import get_db
from ..models import SensorReading, Inspection, Alert, Device, AuditLog
from ..schemas import SensorReadingCreate, SensorReadingResponse

router = APIRouter(prefix="/api/readings", tags=["readings"])

@router.post("", response_model=SensorReadingResponse, status_code=status.HTTP_201_CREATED)
def ingest_sensor_reading(payload: SensorReadingCreate, db: Session = Depends(get_db)):
    """
    Ingest real-time multi-sensor telemetry packet from handheld ESP32-S3.
    Updates device status, logs readings, and triggers safety alerts if thresholds breached.
    """
    # Find or use active inspection
    active_insp = db.query(Inspection).filter(Inspection.status == "in_progress").first()
    insp_id = active_insp.id if active_insp else "INSP-LIVE-STREAM"

    reading = SensorReading(
        inspection_id=insp_id,
        timestamp=payload.timestamp or datetime.datetime.utcnow(),
        gas_reading=payload.gas_reading,
        gas_unit=payload.gas_unit,
        vibration_reading=payload.vibration_reading,
        temperature=payload.temperature,
        humidity=payload.humidity,
        section_id=payload.section_id,
        distance_cm=payload.distance_cm,
    )
    db.add(reading)

    # Update device heartbeat
    dev = db.query(Device).filter(Device.device_code == payload.device_id).first()
    if dev:
        dev.last_seen = datetime.datetime.utcnow()
        if payload.battery_percent is not None:
            dev.battery_percent = payload.battery_percent
        if payload.connectivity_status:
            dev.connection_status = payload.connectivity_status

    # Automated Anomaly Alert Generation (Threshold-based)
    if payload.gas_reading > 100.0:
        alert = Alert(
            id=f"alt-{int(datetime.datetime.utcnow().timestamp())}",
            inspection_id=insp_id,
            worker_name="Field Operator",
            alert_type="high_priority_hazard",
            severity="critical",
            section_id=payload.section_id,
            message=f"CRITICAL GAS HAZARD: {payload.gas_reading} ppm on {payload.section_id}. Coincident vibration: {payload.vibration_reading} mm/s RMS.",
            created_at=datetime.datetime.utcnow(),
            acknowledgement_status="pending",
        )
        db.add(alert)

    db.commit()
    db.refresh(reading)
    return reading
