import pickle
import os

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import Base, engine, SessionLocal
from app.models.analysis import Analysis
from app.models.project import Project
from app.models.user import User
from app.models.prompt_log import PromptLog
from app.services.pipeline import run_full_pipeline
from fastapi.middleware.cors import CORSMiddleware

# ================================
# CREATE APP (ONLY ONCE)
# ================================
app = FastAPI(
    title="GEOlytics API",
    version="0.1.0"
)

# ================================
# CORS (VERY IMPORTANT)
# ================================
app.add_middleware(
CORSMiddleware,
allow_origins=[
"https://geolytics-pearl.vercel.app"
],
allow_credentials=True,
allow_methods=["*"],
allow_headers=["*"],
)
# ================================
# LOAD MODELS
# ================================
clf = None
reg = None

if os.path.exists("app/ml/classifier.pkl"):
    with open("app/ml/classifier.pkl", "rb") as f:
        clf = pickle.load(f)

if os.path.exists("app/ml/regressor.pkl"):
    with open("app/ml/regressor.pkl", "rb") as f:
        reg = pickle.load(f)

# ================================
# CREATE DB TABLES
# ================================
Base.metadata.create_all(bind=engine)


# ================================
# DB SESSION
# ================================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ================================
# SCHEMAS
# ================================
class ProjectCreate(BaseModel):
    name: str
    domain: str


class PromptRun(BaseModel):
    keyword: str
    prompt_text: str
    success_score: int


class UserSignup(BaseModel):
    username: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


# ================================
# BASIC ROUTES
# ================================
@app.get("/")
def root():
    return {"message": "GEOlytics running successfully"}


@app.get("/health")
def health():
    return {"status": "ok"}


# ================================
# PROMPT GENERATION
# ================================
@app.post("/generate-prompts")
def generate_prompts(keyword: str):
    prompts = [
        f"What are the best {keyword} tools?",
        f"Top companies in {keyword}",
        f"How does {keyword} affect SEO?",
    ]

    return {"keyword": keyword, "prompts": prompts}


# ================================
# RUN ANALYSIS (MOCK)
# ================================
@app.post("/run-analysis")
def run_analysis(domain: str):
    return {
        "domain": domain,
        "geo_score": 82,
        "aeo_score": 76,
        "brand_visibility": 88,
        "citations_found": 14,
        "competitor_rank": 3,
        "recommendations": [
            "Add FAQ schema",
            "Improve answer-first formatting",
            "Increase entity density",
        ],
    }


# ================================
# PROJECT CRUD
# ================================
@app.post("/project")
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    new_project = Project(name=project.name, domain=project.domain)

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return {
        "id": new_project.id,
        "name": new_project.name,
        "domain": new_project.domain,
    }


@app.get("/projects")
def get_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).all()

    return [
        {"id": p.id, "name": p.name, "domain": p.domain}
        for p in projects
    ]


# ================================
# FULL ANALYSIS (IMPORTANT API)
# ================================
import random

@app.post("/full-analysis")
def full_analysis(keyword: str):

    geo = random.randint(60, 95)
    aeo = random.randint(55, 90)
    visibility = random.choice(["Low", "Medium", "High"])

    return {
        "keyword": keyword,
        "geo_score": geo,
        "aeo_score": aeo,
        "visibility": visibility,
        "recommendations": [
            f"Improve {keyword} content",
            f"Add structured data for {keyword}",
            f"Increase authority pages for {keyword}"
        ]
    }

# ================================
# DASHBOARD DATA
# ================================
@app.get("/dashboard-metrics")
def dashboard_metrics():
    return {
        "kpis": {
            "geo_score": 87,
            "aeo_score": 82,
            "brand_influence": 86,
            "citation_visibility": "66.7%",
        },
        "citation_trend": [
            {"month": "Jan", "score": 64},
            {"month": "Feb", "score": 69},
            {"month": "Mar", "score": 73},
            {"month": "Apr", "score": 81},
            {"month": "May", "score": 87},
        ],
    }


# ================================
# USER AUTH
# ================================
@app.post("/signup")
def signup(user: UserSignup, db: Session = Depends(get_db)):
    new_user = User(
        username=user.username,
        email=user.email,
        password=user.password,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created", "user_id": new_user.id}


@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not existing_user:
        return {"error": "User not found"}

    if existing_user.password != user.password:
        return {"error": "Invalid credentials"}

    return {
        "message": "Login successful",
        "username": existing_user.username,
    }


# ================================
# PROMPT LOGGING
# ================================
@app.post("/save-prompt-run")
def save_prompt_run(run: PromptRun, db: Session = Depends(get_db)):
    new_run = PromptLog(
        keyword=run.keyword,
        prompt_text=run.prompt_text,
        success_score=run.success_score,
    )

    db.add(new_run)
    db.commit()
    db.refresh(new_run)

    return {"message": "Prompt run stored", "id": new_run.id}


@app.get("/prompt-history")
def prompt_history(db: Session = Depends(get_db)):
    rows = db.query(PromptLog).all()

    return [
        {
            "id": r.id,
            "keyword": r.keyword,
            "prompt": r.prompt_text,
            "success_score": r.success_score,
        }
        for r in rows
    ]

# ================================
@app.post("/full-analysis")
def full_analysis(keyword: str, project_id: int, db: Session = Depends(get_db)):

    result = run_full_pipeline(keyword)

    new_analysis = Analysis(
        keyword=keyword,
        project_id=project_id,
        geo_score=result["geo_score"],
        aeo_score=result["aeo_score"],
        visibility=result["visibility"]
    )

    db.add(new_analysis)
    db.commit()
    db.refresh(new_analysis)

    return result
