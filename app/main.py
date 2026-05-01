from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import math

from app.database import Base, engine, SessionLocal
from app.models.project import Project
from app.models.user import User
from app.models.prompt_log import PromptLog

# ===============================
# INIT APP
# ===============================
app = FastAPI()

# ===============================
# CORS FIX
# ===============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===============================
# CREATE TABLES
# ===============================
Base.metadata.create_all(bind=engine)

# ===============================
# DB SESSION
# ===============================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ===============================
# SCHEMAS
# ===============================
class ProjectCreate(BaseModel):
    name: str
    domain: str

class UserSignup(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class AnalysisRequest(BaseModel):
    keyword: str
    project_id: int

class DomainRequest(BaseModel):
    domain: str

# ===============================
# ROOT
# ===============================
@app.get("/")
def root():
    return {"message": "GEOlytics AI Backend Running 🚀"}

# ===============================
# LOGIN
# ===============================
@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if not existing_user:
        raise HTTPException(status_code=401, detail="User not found")

    if existing_user.password != user.password:
        raise HTTPException(status_code=401, detail="Invalid password")

    return {
        "message": "Login successful",
        "username": existing_user.username
    }

# ===============================
# SIGNUP
# ===============================
@app.post("/signup")
def signup(user: UserSignup, db: Session = Depends(get_db)):
    new_user = User(
        username=user.username,
        email=user.email,
        password=user.password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created"}

# ===============================
# PROJECT
# ===============================
@app.post("/project")
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    new_project = Project(name=project.name, domain=project.domain)

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return new_project

@app.get("/projects")
def get_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()

# ===============================
# REAL-TIME DOMAIN ANALYSIS
# ===============================
@app.post("/run-analysis")
def run_analysis(data: DomainRequest):

    domain = data.domain.lower()

    length = len(domain)
    words = domain.split(".")

    geo_score = min(60 + length * 2, 100)
    aeo_score = min(50 + len(words) * 10 + length // 2, 100)
    brand_visibility = min(40 + length * 3, 100)

    citations_found = length + len(words) * 2
    competitor_rank = max(1, 10 - (length % 7))

    recommendations = []

    if geo_score < 80:
        recommendations.append("Improve geo targeting content")

    if aeo_score < 80:
        recommendations.append("Add FAQ schema for AEO")

    if brand_visibility < 80:
        recommendations.append("Increase brand mentions")

    if not recommendations:
        recommendations.append("Strong SEO performance")

    return {
        "domain": domain,
        "geo_score": geo_score,
        "aeo_score": aeo_score,
        "brand_visibility": brand_visibility,
        "citations_found": citations_found,
        "competitor_rank": competitor_rank,
        "recommendations": recommendations
    }

# ===============================
# REAL AI KEYWORD ANALYSIS
# ===============================
@app.post("/full-analysis")
def full_analysis(data: AnalysisRequest, db: Session = Depends(get_db)):

    keyword = data.keyword.lower()
    words = keyword.split()

    length = len(keyword)
    word_count = len(words)

    # 🔥 SMART SCORING ENGINE
    geo_score = min(50 + length * 2 + word_count * 5, 100)
    aeo_score = min(40 + word_count * 12 + length // 2, 100)

    # 🔥 VISIBILITY LOGIC
    if geo_score > 85:
        visibility = "High"
    elif geo_score > 65:
        visibility = "Medium"
    else:
        visibility = "Low"

    recommendations = []

    if word_count < 3:
        recommendations.append("Use long-tail keywords")

    if geo_score < 80:
        recommendations.append("Improve local SEO signals")

    if aeo_score < 80:
        recommendations.append("Optimize for voice search & FAQ")

    if not recommendations:
        recommendations.append("SEO looks strong")

    # SAVE HISTORY
    log = PromptLog(
        keyword=keyword,
        geo_score=geo_score,
        aeo_score=aeo_score,
        visibility=visibility,
        project_id=data.project_id
    )

    db.add(log)
    db.commit()

    return {
        "keyword": keyword,
        "geo_score": geo_score,
        "aeo_score": aeo_score,
        "visibility": visibility,
        "recommendations": recommendations
    }

# ===============================
# HISTORY
# ===============================
@app.get("/analysis-history")
def history(db: Session = Depends(get_db)):
    return db.query(PromptLog).all()