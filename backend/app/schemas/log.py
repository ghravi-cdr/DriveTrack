from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from bson import ObjectId
from models.log import Action

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
    @classmethod
    def validate(cls, v):
        if isinstance(v, ObjectId):
            return v
        from bson import ObjectId as OID
        try:
            return OID(str(v))
        except Exception:
            raise ValueError("Invalid ObjectId")

class LogCreate(BaseModel):
    action: Action
    collection: str
    record_id: Optional[PyObjectId] = None
    user_id: Optional[PyObjectId] = None
    diff: Optional[dict] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class LogOut(LogCreate):
    id: PyObjectId = Field(alias="_id")
    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True