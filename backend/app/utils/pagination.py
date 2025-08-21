from typing import Any, Dict

def build_query(params: Dict[str, Any]) -> Dict[str, Any]:
    # Convert query params into Mongo filter
    q = {"isDeleted": {"$ne": True}}  # default exclude deleted
    for k, v in params.items():
        if v in [None, "", "null"]:
            continue
        if k in ["skip", "limit", "sort_by", "sort_dir"]:
            continue
        # partial text for strings
        if k in ["DriverName","LicenseNumber","ContactNumber","Address","Remarks"]:
            q[k] = {"$regex": v, "$options": "i"}
        else:
            q[k] = v
    return q

def sort_tuple(sort_by: str | None, sort_dir: str | None):
    if not sort_by:
        return [("CreatedAt", -1)]
    direction = -1 if (sort_dir or "").lower() in ["desc", "-1"] else 1
    return [(sort_by, direction)]