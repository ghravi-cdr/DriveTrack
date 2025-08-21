import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "driver_mgmt"

async def migrate():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

    cursor = db.drivers.find({"LicenseExpiryDate": {"$type": "string"}})

    async for doc in cursor:
        try:
            date_str = doc["LicenseExpiryDate"]
            # Try parsing string into datetime
            new_date = datetime.strptime(date_str, "%Y-%m-%d")
            await db.drivers.update_one(
                {"_id": doc["_id"]},
                {"$set": {"LicenseExpiryDate": new_date}}
            )
            print(f"Updated {doc['_id']} -> {new_date}")
        except Exception as e:
            print(f"Skipping {doc['_id']} due to error: {e}")

    print("✅ Migration completed!")

if __name__ == "__main__":
    asyncio.run(migrate())
