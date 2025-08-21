from pydantic import BaseModel
from datetime import date
from typing import Optional
from app.models.driver import Specialization as SpecializationEnum, Status as StatusEnum


class DriverBase(BaseModel):
    DriverName: str
    LicenseNumber: str
    LicenseExpiryDate: date
    ContactNumber: str
    Address: str
    ExperienceYears: int
    Specialization: SpecializationEnum
    Status: StatusEnum = StatusEnum.OFF_DUTY
    Remarks: Optional[str] = None


class DriverCreate(DriverBase):
    pass


class DriverUpdate(BaseModel):
    DriverName: Optional[str] = None
    LicenseNumber: Optional[str] = None
    LicenseExpiryDate: Optional[date] = None
    ContactNumber: Optional[str] = None
    Address: Optional[str] = None
    ExperienceYears: Optional[int] = None
    Specialization: Optional[SpecializationEnum] = None
    Status: Optional[StatusEnum] = None
    Remarks: Optional[str] = None
