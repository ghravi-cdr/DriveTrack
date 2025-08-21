from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGO_URI: str = "mongodb+srv://hack06:knrpj1UEINmVSsTh@hackethon.qdczhgv.mongodb.net/"
    MONGO_DB: str = "driver_mgmt"
    JWT_SECRET: str = "efec25d55462d1fc92288ef6853f0785"
    JWT_EXPIRE_MINUTES: int = 120

    class Config:
        env_file = ".env"

settings = Settings()
