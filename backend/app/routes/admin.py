from fastapi import APIRouter, Depends
from app.utils.security import get_admin_user

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/dashboard")
def admin_dashboard(admin=Depends(get_admin_user)):
    return {
        "message": "Welcome Admin",
        "admin_id": admin.id,
        "email": admin.email
    }