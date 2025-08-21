import os
import sys
import json
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime

ENV_PATH = r"E:/DriverM/backend/.env"
DRIVERS_PATH = r"E:/DriverM/Drivers.json"


def read_env(path):
    data = {}
    if not os.path.exists(path):
        return data
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" in line:
                k, v = line.split("=", 1)
                data[k.strip()] = v.strip()
    return data


def main():
    env = read_env(ENV_PATH)
    uri = env.get("MONGO_URI", "mongodb://localhost:27017")
    dbname = env.get("MONGO_DB", "driver_mgmt")

    if not os.path.exists(DRIVERS_PATH):
        print("ERROR: Drivers.json not found at", DRIVERS_PATH)
        sys.exit(1)

    def convert_extjson(obj):
        # Recursively convert Extended JSON patterns to Python types
        if isinstance(obj, dict):
            # $oid
            if list(obj.keys()) == ["$oid"]:
                return ObjectId(obj["$oid"])
            # $date
            if list(obj.keys()) == ["$date"]:
                s = obj["$date"]
                # Some dates are like '2026-05-20T00:00:00.000Z'
                if isinstance(s, str):
                    try:
                        if s.endswith('Z'):
                            s = s.replace('Z', '+00:00')
                        return datetime.fromisoformat(s)
                    except Exception:
                        pass
                return s
            return {k: convert_extjson(v) for k, v in obj.items()}
        if isinstance(obj, list):
            return [convert_extjson(v) for v in obj]
        return obj

    with open(DRIVERS_PATH, "r", encoding="utf-8") as f:
        raw = json.load(f)
        data = convert_extjson(raw)
        if not isinstance(data, list):
            print("ERROR: Drivers.json must contain a JSON array of documents")
            sys.exit(1)

    print("Connecting to MongoDB at", uri)
    try:
        client = MongoClient(uri, serverSelectionTimeoutMS=10000)
        client.admin.command('ping')
    except Exception as e:
        print("ERROR: cannot connect to MongoDB:\n", e)
        sys.exit(2)

    db = client[dbname]
    col = db['drivers']
    try:
        print("Clearing existing documents in", f"{dbname}.drivers")
        col.delete_many({})
        res = col.insert_many(data)
        print("Inserted", len(res.inserted_ids), "documents into", f"{dbname}.drivers")
    except Exception as e:
        print("ERROR during insert:\n", e)
        sys.exit(3)


if __name__ == '__main__':
    main()
