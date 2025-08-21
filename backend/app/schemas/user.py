from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from bson import ObjectId

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

class UserOut(BaseModel):
    id: PyObjectId = Field(alias="_id")
    email: EmailStr
    full_name: Optional[str] = None
    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True