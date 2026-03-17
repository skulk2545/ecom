from typing import Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_admin_user
from app.db.dependencies import get_db
from app.models.settings import Setting
from app.schemas.settings import Setting as SettingSchema, LandingPageSettingsUpdate

router = APIRouter()

@router.get("", response_model=Dict[str, str])
def get_settings(db: Session = Depends(get_db)):
    settings = db.query(Setting).all()
    return {s.key: s.value for s in settings}

@router.post("/landing-page", response_model=Dict[str, str])
def update_landing_page_settings(
    payload: LandingPageSettingsUpdate,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin_user),
):
    updates = payload.model_dump(exclude_unset=True)
    for key, value in updates.items():
        if value is None:
            continue
        setting = db.query(Setting).filter(Setting.key == key).first()
        if setting:
            setting.value = value
        else:
            setting = Setting(key=key, value=value)
            db.add(setting)
    
    db.commit()
    
    all_settings = db.query(Setting).all()
    return {s.key: s.value for s in all_settings}
