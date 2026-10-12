import datetime
from .database import SessionLocal, engine, Base
from .models import Worker, Device, Inspection, Alert, AssessmentRecord, AuditLog

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(Worker).first():
        print("Database already seeded.")
        db.close()
        return

    print("Seeding initial SkillSafe demo data...")

    # 1. Workers
    w1 = Worker(
        id="w-101",
        worker_code="SK-IND-01",
        name="Rajesh Kumar",
        department="Industrial Gas Transmission",
        role="Senior Gas Fitter (NSQF L5)",
        active_status=True,
        assigned_device_id="dev-esp32-01",
        assigned_watch_id="wat-ble-01",
        current_status="inspection_in_progress",
    )
    w2 = Worker(
        id="w-102",
        worker_code="SK-VOC-04",
        name="Ananya Sharma",
        department="Vocational Training Wing",
        role="Apprentice Trainee (NSQF L3)",
        active_status=True,
        assigned_device_id="dev-esp32-02",
        assigned_watch_id="wat-ble-02",
        current_status="alert_received",
    )
    w3 = Worker(
        id="w-103",
        worker_code="SK-MAI-08",
        name="Vikram Singh",
        department="Pipeline Integrity & Maintenance",
        role="Diagnostic Lead (NSQF L6)",
        active_status=True,
        assigned_device_id="dev-esp32-03",
        assigned_watch_id="wat-ble-03",
        current_status="inspection_in_progress",
    )
    w4 = Worker(
        id="w-104",
        worker_code="SK-IND-09",
        name="Pooja Patel",
        department="City Gas Distribution (CGD)",
        role="Safety Inspector",
        active_status=True,
        assigned_device_id="dev-esp32-04",
        assigned_watch_id="wat-ble-04",
        current_status="inspection_completed",
    )
    db.add_all([w1, w2, w3, w4])

    # 2. Devices
    d1 = Device(
        id="dev-esp32-01",
        device_code="SS-HANDHELD-ESP32-01",
        device_type="handheld",
        worker_id="w-101",
        battery_percent=88,
        connection_status="online",
    )
    d2 = Device(
        id="dev-esp32-02",
        device_code="SS-HANDHELD-ESP32-02",
        device_type="handheld",
        worker_id="w-102",
        battery_percent=42,
        connection_status="online",
    )
    db.add_all([d1, d2])

    # 3. Inspections
    insp1 = Inspection(
        id="INSP-2026-089",
        worker_id="w-102",
        device_id="dev-esp32-02",
        start_time=datetime.datetime.utcnow() - datetime.timedelta(minutes=25),
        status="in_progress",
        inspected_sections=["P1", "P2", "P3", "P4"],
        trainer_notes="Trainee followed 45-degree angle. Section P4 flagged for secondary review.",
        probable_hazard_zone="P4",
    )
    db.add(insp1)

    # 4. Alerts
    a1 = Alert(
        id="alt-001",
        inspection_id="INSP-2026-089",
        worker_name="Ananya Sharma",
        alert_type="high_priority_hazard",
        severity="critical",
        section_id="P4",
        message="Probable Hazard Zone: Section P4 gas reading elevated to 138.9 ppm with coincident vibration anomaly (1.28 mm/s RMS).",
        created_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=5),
        acknowledgement_status="pending",
    )
    db.add(a1)

    # 5. Assessments
    asmt1 = AssessmentRecord(
        id="asmt-001",
        inspection_id="INSP-2026-089",
        trainer_id="TR-HARISH-01",
        trainer_name="Harish Chandra",
        worker_name="Ananya Sharma",
        scores={
            "deviceHandling": 4,
            "inspectionProcedure": 5,
            "hazardIdentification": 5,
            "safetyResponse": 4,
            "alertAcknowledgement": 4,
            "inspectionCompletion": 3,
            "accurateReporting": 4,
        },
        feedback="Trainee showed high hazard awareness at P4. Certified for Level 4 upon repeat verification.",
        assessment_status="submitted",
    )
    db.add(asmt1)

    # 6. Audit Logs
    log1 = AuditLog(
        id="log-001",
        timestamp=datetime.datetime.utcnow(),
        user_id="SYS-SEED",
        user_name="System Initializer",
        action="Database Seeded",
        details="Initial SIH 2026 demo records populated.",
        category="admin",
    )
    db.add(log1)

    db.commit()
    db.close()
    print("Database seeding completed successfully.")

if __name__ == "__main__":
    seed_database()
