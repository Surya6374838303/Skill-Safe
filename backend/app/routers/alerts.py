from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import datetime
from ..database import get_db
from ..models import Alert, AuditLog
from ..schemas import AlertResponse, AlertAcknowledgeRequest

router = APIRouter(prefix="/api/alerts", tags=["alerts"])

@router.get("", response_model=List[AlertResponse])
def list_alerts(db: Session = Depends(get_db)):
    return db.query(Alert).order_by(Alert.created_at.desc()).all()

@router.post("/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: str, payload: AlertAcknowledgeRequest = None, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.acknowledgement_status = "acknowledged"
    alert.acknowledged_at = datetime.datetime.utcnow()

    # Log to audit trail
    log = AuditLog(
        id=f"log-{int(datetime.datetime.utcnow().timestamp())}",
        timestamp=datetime.datetime.utcnow(),
        user_id="USR-SUPERVISOR",
        user_name="Control Room Lead",
        action="Alert Acknowledged",
        details=f"Supervisor marked alert {alert_id} on section {alert.section_id} as acknowledged.",
        category="alert"
    )
    db.add(log)
    db.commit()

    return {"message": "Alert successfully acknowledged", "id": alert_id}
