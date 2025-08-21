# Driver Management Backend (FastAPI + MongoDB)

## Quickstart
1) Create and fill `.env` (copy from `.env.sample`).
2) Install deps: `pip install -r requirements.txt`
3) Run: `uvicorn app.main:app --reload`

### Deploy to Railway

- Add a new Railway service from this backend directory
- Set Start Command to: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Add environment variables in Railway: `MONGO_URI`, `MONGO_DB`, `JWT_SECRET`, `JWT_EXPIRE_MINUTES`

### Endpoints
- `POST /api/auth/register` – create initial user (admin)
- `POST /api/auth/login` – returns JWT
- `GET /api/drivers` – list with filters, sort, pagination
- `POST /api/drivers` – create driver
- `GET /api/drivers/{id}` – fetch one
- `PUT /api/drivers/{id}` – update driver
- `DELETE /api/drivers/{id}` – soft delete (isDeleted=true, IsActive=false)
- `GET /api/logs` – list logs (filter by user, date range, action, record type)

All protected (except login/register). Use JWT `Authorization: Bearer <token>`.