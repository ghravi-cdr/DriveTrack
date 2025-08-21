from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends
from app.database import get_db  # adjust to your project
from bson import ObjectId

router = APIRouter()
@router.get("/")
async def list_logs(
    db=Depends(get_db),
    action: Optional[str] = None,  
    start: Optional[str] = None,
    end: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
):
    q = {}

    # Filters
    if action:
        q["Action"] = action.upper()   # match your DB field
    if start or end:
        q["Time"] = {}
        if start:
            q["Time"]["$gte"] = start
        if end:
            q["Time"]["$lte"] = end

    cursor = (
        db.logs.find(q)
        .sort("Time", -1)   # match DB field
        .skip(skip)
        .limit(min(limit, 500))
    )

    items = []
    async for log in cursor:
        items.append({
            "Time": log.get("Time"),
            "Name": log.get("Name"),
            "Action": log.get("Action"),
            "Record": log.get("Record")
        })

    total = await db.logs.count_documents(q)

    return {"items": items, "total": total}
