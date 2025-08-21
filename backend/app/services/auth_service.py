from fastapi import HTTPException
from ..utils.security import hash_password, verify_password, create_jwt

async def register(db, email: str, password: str, full_name: str | None):
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    doc = {"email": email, "password": hash_password(password), "full_name": full_name}
    res = await db.users.insert_one(doc)
    # Return JSON-serializable minimal payload
    return {"_id": str(res.inserted_id), "email": email, "full_name": full_name}

async def login(db, email: str, password: str):
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_jwt(str(user["_id"]))
    return {"access_token": token, "token_type": "bearer", "user": {"_id": str(user["_id"]), "email": user["email"], "full_name": user.get("full_name")}}


async def change_password(db, user_id: str, current_password: str, new_password: str):
    user = await db.users.find_one({"_id": __import__('bson').ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not verify_password(current_password, user["password"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    hashed = hash_password(new_password)
    await db.users.update_one({"_id": user["_id"]}, {"$set": {"password": hashed}})
    return {"status": "ok"}