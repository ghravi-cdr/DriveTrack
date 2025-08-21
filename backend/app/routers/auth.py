from fastapi import APIRouter, Depends
from ..database import get_db
from ..models.user import UserCreate, UserLogin
from ..services.auth_service import register, login, change_password
from ..utils.security import get_current_user_id
from pydantic import BaseModel

router = APIRouter()

@router.post("/register")
async def register_user(payload: UserCreate, db=Depends(get_db)):
    return await register(db, payload.email, payload.password, payload.full_name)

@router.post("/login")
async def login_user(payload: UserLogin, db=Depends(get_db)):
    return await login(db, payload.email, payload.password)


class ChangePasswordIn(BaseModel):
    current_password: str
    new_password: str


@router.post("/change-password")
async def change_password_route(payload: ChangePasswordIn, db=Depends(get_db), user_id: str = Depends(get_current_user_id)):
    return await change_password(db, user_id, payload.current_password, payload.new_password)