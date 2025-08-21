# test_db.py
import motor.motor_asyncio
import asyncio

async def test_connection():
    client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.driver_management
    result = await db.drivers.insert_one({"DriverName": "From FastAPI", "LicenseNumber": "XYZ123"})
    print("Inserted ID:", result.inserted_id)

asyncio.run(test_connection())
