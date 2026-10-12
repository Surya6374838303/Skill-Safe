from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import datetime
from ..database import get_db
from ..models import AssessmentRecord
from ..schemas import AssessmentCreate, AssessmentResponse

router = APIRouter(prefix="/api/assessments", tags=["assessments"])

@router.get("", response_model=List[AssessmentResponse])
def list_assessments(db: Session = Depends(get_db)):
    return db.query(AssessmentRecord).order_by(AssessmentRecord.created_at.desc()).all()

@router.post("", response_model=AssessmentResponse)
def submit_assessment(payload: AssessmentCreate, db: Session = Depends(get_db)):
    rec = AssessmentRecord(
        id=f"asmt-{int(datetime.datetime.utcnow().timestamp())}",
        inspection_id=payload.inspection_id,
        trainer_id=payload.trainer_id,
        trainer_name=payload.trainer_name,
        worker_name=payload.worker_name,
        scores=payload.scores,
        feedback=payload.feedback,
        assessment_status="submitted",
        created_at=datetime.datetime.utcnow(),
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    return rec
