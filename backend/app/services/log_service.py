from ..models.log import Action
from datetime import datetime

async def add_log(db, action: Action, collection: str, record_id=None, user_id=None, diff=None):
    log = {
        "action": action.value if hasattr(action, "value") else str(action),
        "collection": collection,
        "record_id": record_id,
        "user_id": user_id,
        "diff": diff,
        "created_at": datetime.utcnow()
    }
    await db.logs.insert_one(log)