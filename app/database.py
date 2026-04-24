from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# -----------------------------------
# DATABASE URL
# -----------------------------------
# SQLite (local development)
DATABASE_URL = "sqlite:///./geolytics.db"

# 👉 For PostgreSQL later (Render)
# DATABASE_URL = "postgresql://user:password@host:port/dbname"

# -----------------------------------
# ENGINE
# -----------------------------------
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # needed for SQLite
)

# -----------------------------------
# SESSION
# -----------------------------------
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# -----------------------------------
# BASE MODEL
# -----------------------------------
Base = declarative_base()

# -----------------------------------
# DEPENDENCY (VERY IMPORTANT)
# -----------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()