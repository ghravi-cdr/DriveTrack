from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Response, Query, Header
from bson import ObjectId
from ..database import get_db
from ..utils.security import get_current_user_id
from ..config import settings
import jwt

router = APIRouter()


@router.post("/picture")
async def upload_profile_picture(
    file: UploadFile = File(...),
    db=Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Empty file")
    doc = {
        "UserId": ObjectId(user_id),
        "ContentType": file.content_type or "application/octet-stream",
        "Data": data,
    }
    # Upsert single record per user
    await db.profile_pics.update_one(
        {"UserId": ObjectId(user_id)}, {"$set": doc}, upsert=True
    )
    return {"status": "ok"}


@router.get("/picture")
async def get_profile_picture(
    db=Depends(get_db),
    token: str | None = Query(default=None),
    authorization: str | None = Header(default=None),
):
    user_id: str | None = None
    try:
        raw = None
        if authorization and authorization.startswith("Bearer "):
            raw = authorization.split(" ", 1)[1]
        elif token:
            raw = token
        if not raw:
            raise HTTPException(status_code=401, detail="Missing token")
        payload = jwt.decode(raw, settings.JWT_SECRET, algorithms=["HS256"])
        user_id = payload["sub"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    pic = await db.profile_pics.find_one({"UserId": ObjectId(user_id)})
    if not pic:
        raise HTTPException(status_code=404, detail="No profile picture")
    return Response(content=pic["Data"], media_type=pic.get("ContentType") or "application/octet-stream")


