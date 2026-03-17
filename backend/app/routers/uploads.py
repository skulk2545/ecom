import os
import shutil
import uuid
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status
from app.core.security import get_current_admin_user

router = APIRouter()

# Directory for uploaded files
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("", status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = File(...),
    _admin=Depends(get_current_admin_user),
):
    # Validate file type (e.g., images only)
    allowed_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type {file.content_type} not supported. Use JPG, PNG, GIF, or WebP."
        )

    # Create a unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    # Save the file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save file: {str(e)}"
        )
    finally:
        file.file.close()

    # Return the URL of the uploaded file
    # For now, let's return a relative path that can be prefixed by the base URL
    return {"url": f"/uploads/{unique_filename}", "filename": unique_filename}
