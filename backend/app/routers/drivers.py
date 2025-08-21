from fastapi import APIRouter, Depends, HTTPException,Request
from typing import Optional
from bson import ObjectId
from datetime import datetime, timedelta

from ..database import get_db
from ..utils.security import get_current_user_id
from app.schemas.driver import DriverCreate, DriverUpdate
from ..utils.pagination import build_query, sort_tuple
from ..services.driver_service import create_driver, update_driver, delete_driver

router = APIRouter()


# Helper to convert Mongo docs into JSON serializable dict
def serialize_driver(doc):
    if not doc:
        return None
    doc["_id"] = str(doc["_id"])
    if "CreatedBy" in doc and isinstance(doc["CreatedBy"], ObjectId):
        doc["CreatedBy"] = str(doc["CreatedBy"])
    if "UpdatedBy" in doc and isinstance(doc["UpdatedBy"], ObjectId):
        doc["UpdatedBy"] = str(doc["UpdatedBy"])
    return doc


@router.get("/")
async def list_drivers(
    request: Request,
    db=Depends(get_db),
    skip: int = 0,
    limit: int = 50,
    sort_by: Optional[str] = None,
    sort_dir: Optional[str] = "asc"
):
    # Extract filters from query params (ignoring skip/limit/sort_by/sort_dir)
    filters = dict(request.query_params)
    filters.pop("skip", None)
    filters.pop("limit", None)
    filters.pop("sort_by", None)
    filters.pop("sort_dir", None)

    # Build query
    q = {**build_query(filters), "isDeleted": {"$ne": True}}

    # Handle sorting safely
    sort = sort_tuple(sort_by, sort_dir) if sort_by else [("_id", 1)]

    # Fetch drivers
    cursor = (
        db.drivers.find(q)
        .sort(sort)
        .skip(skip)
        .limit(min(limit, 200))
    )

    items = [serialize_driver(d) async for d in cursor]
    total = await db.drivers.count_documents(q)

    # KPIs
    on_duty = await db.drivers.count_documents({**q, "Status": "ON_DUTY"})
    on_leave = await db.drivers.count_documents({**q, "Status": "ON_LEAVE"})
    soon = datetime.utcnow() + timedelta(days=30)
    expiring = await db.drivers.count_documents(
        {**q, "LicenseExpiryDate": {"$lte": soon}}
    )

    return {
        "items": items,
        "total": total,
        "kpis": {
            "total": total,
            "on_duty": on_duty,
            "on_leave": on_leave,
            "expiring": expiring,
        },
    }

@router.post("/create")
async def create_driver_route(
    payload: DriverCreate, db=Depends(get_db), user_id: str = Depends(get_current_user_id)
):
    driver = await create_driver(db, payload, user_id)
    return serialize_driver(driver)


@router.get("/{driver_id}")
async def get_driver(
    driver_id: str, db=Depends(get_db), user_id: str = Depends(get_current_user_id)
):
    d = await db.drivers.find_one({"_id": ObjectId(driver_id), "isDeleted": {"$ne": True}})
    if not d:
        raise HTTPException(status_code=404, detail="Driver not found")
    return serialize_driver(d)


@router.put("/{driver_id}")
async def update_driver_route(
    driver_id: str,
    payload: DriverUpdate,
    db=Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    driver = await update_driver(db, driver_id, payload, user_id)
    return serialize_driver(driver)


@router.delete("/{driver_id}")
async def delete_driver_route(
    driver_id: str, db=Depends(get_db), user_id: str = Depends(get_current_user_id)
):
    driver = await delete_driver(db, driver_id, user_id)
    return serialize_driver(driver)
