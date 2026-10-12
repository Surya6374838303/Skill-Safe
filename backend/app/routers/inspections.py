from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import datetime
from ..database import get_db
from ..models import Inspection, Worker
from ..schemas import InspectionStartRequest, InspectionCompleteRequest, InspectionResponse

router = APIRouter(prefix="/api/inspections", tags=["inspections"])

@router.post("/start", response_model=InspectionResponse, status_code=status.HTTP_201_CREATED)
def start_inspection(payload: InspectionStartRequest, db: Session = Depends(get_db)):
    insp_id = f"INSP-{datetime.datetime.utcnow().strftime('%Y%m%d-%H%M')}"
    worker = db.query(Worker).filter(Worker.id == payload.worker_id).first()
    worker_name = worker.name if worker else "Field Worker"

    insp = Inspection(
        id=insp_id,
        worker_id=payload.worker_id,
        device_id=payload.device_id,
        start_time=datetime.datetime.utcnow(),
        status="in_progress",
        inspected_sections=payload.inspected_sections,
    )
    if worker:
        worker.current_status = "inspection_in_progress"

    db.add(insp)
    db.commit()
    db.refresh(insp)

    return {
        "id": insp.id,
        "worker_id": insp.worker_id,
        "worker_name": worker_name,
        "device_id": insp.device_id,
        "start_time": insp.start_time,
        "end_time": insp.end_time,
        "status": insp.status,
        "inspected_sections": insp.inspected_sections,
        "trainer_notes": insp.trainer_notes,
        "probable_hazard_zone": insp.probable_hazard_zone,
    }

@router.post("/{inspection_id}/complete")
def complete_inspection(inspection_id: str, payload: InspectionCompleteRequest, db: Session = Depends(get_db)):
    insp = db.query(Inspection).filter(Inspection.id == inspection_id).first()
    if not insp:
        raise HTTPException(status_code=404, detail="Inspection not found")

    insp.end_time = datetime.datetime.utcnow()
    insp.status = "completed"
    if payload.trainer_notes:
        insp.trainer_notes = payload.trainer_notes

    worker = db.query(Worker).filter(Worker.id == insp.worker_id).first()
    if worker:
        worker.current_status = "inspection_completed"

    db.commit()
    return {"message": "Inspection marked as completed", "id": inspection_id}

@router.get("", response_model=List[InspectionResponse])
def list_inspections(db: Session = Depends(get_db)):
    insps = db.query(Inspection).order_by(Inspection.start_time.desc()).all()
    results = []
    for i in insps:
        results.append({
            "id": i.id,
            "worker_id": i.worker_id,
            "worker_name": i.worker.name if i.worker else "Field Operator",
            "device_id": i.device_id,
            "start_time": i.start_time,
            "end_time": i.end_time,
            "status": i.status,
            "inspected_sections": i.inspected_sections or ["P1"],
            "trainer_notes": i.trainer_notes,
            "probable_hazard_zone": i.probable_hazard_zone,
        })
    return results

@router.get("/{inspection_id}", response_model=InspectionResponse)
def get_inspection(inspection_id: str, db: Session = Depends(get_db)):
    insp = db.query(Inspection).filter(Inspection.id == inspection_id).first()
    if not insp:
        raise HTTPException(status_code=404, detail="Inspection not found")
    return {
        "id": insp.id,
        "worker_id": insp.worker_id,
        "worker_name": insp.worker.name if insp.worker else "Field Operator",
        "device_id": insp.device_id,
        "start_time": insp.start_time,
        "end_time": insp.end_time,
        "status": insp.status,
        "inspected_sections": insp.inspected_sections or ["P1"],
        "trainer_notes": insp.trainer_notes,
        "probable_hazard_zone": insp.probable_hazard_zone,
    }
