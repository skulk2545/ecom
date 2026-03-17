from pydantic import BaseModel
from typing import Optional, Dict

class SettingCreate(BaseModel):
    key: str
    value: str

class SettingUpdate(BaseModel):
    value: str

class Setting(BaseModel):
    key: str
    value: str

    class Config:
        from_attributes = True

class LandingPageSettingsUpdate(BaseModel):
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    hero_image_url: Optional[str] = None
    story_title: Optional[str] = None
    story_paragraph1: Optional[str] = None
    story_paragraph2: Optional[str] = None
    story_image_url: Optional[str] = None
    shopnow_title: Optional[str] = None
    shopnow_subtitle: Optional[str] = None
    shopnow_image_url: Optional[str] = None
