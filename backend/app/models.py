import datetime
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
    Text,
    JSON,
)
from sqlalchemy.orm import relationship
from .database import Base

class Worker(Base):
    __tablename__ = "workers"

    id = Column(String, primary_key=True, index=True)
    worker_code = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    department = Column(String, nullable=False)
    role = Column(String, nullable=False)
    active_status = Column(Boolean, default=True)
    assigned_device_id = Column(String, nullable=True)
    assigned_watch_id = Column(String, nullable=True)
    current_status = Column(String, default="available")
    last_inspection_time = Column(String, nullable=True)

    inspections = relationship("Inspection", back_populates="worker")


class Device(Base):
    __tablename__ = "devices"

    id = Column(String, primary_key=True, index=True)
    device_code = Column(String, unique=True, index=True, nullable=False)
    device_type = Column(String, default="handheld")  # handheld | smartwatch
    worker_id = Column(String, ForeignKey("workers.id"), nullable=True)
    battery_percent = Column(Integer, default=100)
    connection_status = Column(String, default="online")
    last_seen = Column(DateTime, default=datetime.datetime.utcnow)
    sensor_health = Column(JSON, default={"gas": "ok", "vibration": "ok", "temperature": "ok", "humidity": "ok"})


class Inspection(Base):
    __tablename__ = "inspections"

    id = Column(String, primary_key=True, index=True)
    worker_id = Column(String, ForeignKey("workers.id"), nullable=False)
    device_id = Column(String, nullable=False)
    start_time = Column(DateTime, default=datetime.datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    status = Column(String, default="in_progress")
    inspected_sections = Column(JSON, default=["P1"])
    trainer_notes = Column(Text, nullable=True)
    probable_hazard_zone = Column(String, nullable=True)

    worker = relationship("Worker", back_populates="inspections")
    readings = relationship("SensorReading", back_populates="inspection")
    alerts = relationship("Alert", back_populates="inspection")


class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    inspection_id = Column(String, ForeignKey("inspections.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    gas_reading = Column(Float, nullable=False)
    gas_unit = Column(String, default="ppm CH4 eq.")
    vibration_reading = Column(Float, nullable=False)
    temperature = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    section_id = Column(String, nullable=False)
    distance_cm = Column(Float, nullable=True)

    inspection = relationship("Inspection", back_populates="readings")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String, primary_key=True, index=True)
    inspection_id = Column(String, ForeignKey("inspections.id"), nullable=True)
    worker_name = Column(String, nullable=False)
    alert_type = Column(String, nullable=False)
    severity = Column(String, nullable=False)  # low, medium, high, critical
    section_id = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    acknowledged_at = Column(DateTime, nullable=True)
    acknowledgement_status = Column(String, default="pending")

    inspection = relationship("Inspection", back_populates="alerts")


class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(String, primary_key=True, index=True)
    inspection_id = Column(String, ForeignKey("inspections.id"), nullable=False)
    model_version = Column(String, nullable=False)
    analysis_type = Column(String, default="rule_based")
    probable_zone = Column(String, nullable=False)
    confidence = Column(Float, nullable=True)
    explanation = Column(JSON, default=[])
    section_scores = Column(JSON, default={})
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class AssessmentRecord(Base):
    __tablename__ = "assessment_records"

    id = Column(String, primary_key=True, index=True)
    inspection_id = Column(String, ForeignKey("inspections.id"), nullable=False)
    trainer_id = Column(String, nullable=False)
    trainer_name = Column(String, nullable=False)
    worker_name = Column(String, nullable=False)
    scores = Column(JSON, nullable=False)
    feedback = Column(Text, nullable=False)
    assessment_status = Column(String, default="submitted")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    user_id = Column(String, nullable=False)
    user_name = Column(String, nullable=False)
    action = Column(String, nullable=False)
    details = Column(Text, nullable=False)
    category = Column(String, default="inspection")
