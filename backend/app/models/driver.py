# models/driver.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

# Keep your enums
class Specialization(str, Enum):
    HEAVY_VEHICLES = "HEAVY_VEHICLES"
    LIGHT_VEHICLES = "LIGHT_VEHICLES"
    VIP_DUTY = "VIP_DUTY"
    EMERGENCY_RESPONSE = "EMERGENCY_RESPONSE"
    ESCORT = "ESCORT"
    OTHER = "OTHER"

class Status(str, Enum):
    ON_DUTY = "ON_DUTY"
    OFF_DUTY = "OFF_DUTY"
    ON_LEAVE = "ON_LEAVE"

# NEW: Driver model
class Driver(BaseModel):
    id: Optional[str]  # Mongo _id as string
    DriverName: str
    LicenseNumber: str
    LicenseExpiryDate: datetime
    ContactNumber: str
    Address: str
    ExperienceYears: int
    Specialization: Specialization
    Status: Status
    Remarks: Optional[str] = None
    CreatedBy: Optional[str] = None
    CreatedAt: Optional[datetime] = None
    UpdatedBy: Optional[str] = None
    UpdatedAt: Optional[datetime] = None
    IsActive: bool = True
    isDeleted: bool = False

    class Config:
        orm_mode = True
