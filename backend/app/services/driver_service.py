from datetime import datetime
from bson import ObjectId
from app.schemas.driver import DriverCreate, DriverUpdate

async def create_driver(db, payload: DriverCreate, user_id: str):
    data = payload.dict()

    if "LicenseExpiryDate" in data and isinstance(data["LicenseExpiryDate"], datetime) is False:
        data["LicenseExpiryDate"] = datetime.combine(data["LicenseExpiryDate"], datetime.min.time())

    data["CreatedBy"] = ObjectId(user_id)
    data["CreatedAt"] = datetime.utcnow()
    data["UpdatedBy"] = ObjectId(user_id)
    data["UpdatedAt"] = datetime.utcnow()
    data["IsActive"] = True
    data["isDeleted"] = False

    result = await db.drivers.insert_one(data)
    return await db.drivers.find_one({"_id": result.inserted_id})


async def update_driver(db, driver_id: str, payload: DriverUpdate, user_id: str):
    update_data = {k: v for k, v in payload.dict(exclude_unset=True).items()}

    if "LicenseExpiryDate" in update_data and update_data["LicenseExpiryDate"]:
        update_data["LicenseExpiryDate"] = datetime.combine(update_data["LicenseExpiryDate"], datetime.min.time())

    update_data["UpdatedBy"] = ObjectId(user_id)
    update_data["UpdatedAt"] = datetime.utcnow()

    await db.drivers.update_one({"_id": ObjectId(driver_id)}, {"$set": update_data})
    return await db.drivers.find_one({"_id": ObjectId(driver_id)})


# ✅ NEW FUNCTION
async def delete_driver(db, driver_id: str, user_id: str):
    """Soft delete a driver (set isDeleted=True instead of removing from DB)."""
    update_data = {
        "isDeleted": True,
        "UpdatedBy": ObjectId(user_id),
        "UpdatedAt": datetime.utcnow(),
    }
    await db.drivers.update_one({"_id": ObjectId(driver_id)}, {"$set": update_data})
    return await db.drivers.find_one({"_id": ObjectId(driver_id)})
