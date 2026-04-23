from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.project import Project

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/create-project")
def create_project(name: str, domain: str, db: Session = Depends(get_db)):
    project = Project(name=name, domain=domain)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project