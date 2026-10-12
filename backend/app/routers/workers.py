from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Worker

router = APIRouter(prefix="/api/workers", tags=["workers"])

@router.get("")
def list_workers(db: Session = Depends(get_db)):
    workers = db.query(Worker).all()
    return workers

@router.post("")
def create_worker(data: dict, db: Session = Depends(get_db)):
    w = Worker(
        id=f"w-{data.get('worker_code', 'new')}",
        worker_code=data.get("worker_code", "SK-VOC-01"),
        name=data.get("name", "New Worker"),
        department=data.get("department", "Vocational Training Wing"),
        role=data.get("role", "Trainee"),
        active_status=True,
        assigned_device_id=data.get("assigned_device_id"),
        assigned_watch_id=data.get("assigned_watch_id"),
        current_status="available",
    )
    db.add(w)
    db.commit()
    db.refresh(w)
    return w
