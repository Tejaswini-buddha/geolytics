import pickle
import os
from fastapi import FastAPI, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import Base, engine, SessionLocal
from app.models.project import Project
from app.models.user import User
from app.models.prompt_log import PromptLog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# CREATE APP FIRST
app = FastAPI()

# THEN ADD CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
from app.services.pipeline import run_full_pipeline

clf = None
reg = None

if os.path.exists("app/ml/classifier.pkl"):
    with open("app/ml/classifier.pkl", "rb") as f:
        clf = pickle.load(f)

if os.path.exists("app/ml/regressor.pkl"):
    with open("app/ml/regressor.pkl", "rb") as f:
        reg = pickle.load(f)

# ----------------------------
# Create DB tables automatically
# ----------------------------
Base.metadata.create_all(bind=engine)


# ----------------------------
# DB Session Dependency
# ----------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ----------------------------
# Request Schema
# ----------------------------
class ProjectCreate(BaseModel):
    name: str
    domain: str

class PromptRun(BaseModel):
    keyword:str
    prompt_text:str
    success_score:int

# ----------------------------
# FastAPI App
# ----------------------------
app = FastAPI(
    title="GEOlytics API",
    version="0.1.0"
)

# ----------------------------
class UserSignup(BaseModel):
    username:str
    email:str
    password:str


class UserLogin(BaseModel):
    email:str
    password:str

# ----------------------------
# Root
# ----------------------------
@app.get("/")
def root():
    return {
        "message": "GEOlytics running successfully"
    }


# ----------------------------
# Health Check
# ----------------------------
@app.get("/health")
def health():
    return {
        "status": "ok"
    }


# ----------------------------
# Prompt Generator
# ----------------------------
@app.post("/generate-prompts")
def generate_prompts(keyword: str):

    prompts = [
        f"What are the best {keyword} tools?",
        f"Top companies in {keyword}",
        f"How does {keyword} affect SEO?"
    ]

    return {
        "keyword": keyword,
        "prompts": prompts
    }


# ----------------------------
# Mock GEO Analysis
# ----------------------------
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
            "Increase entity density"
        ]
    }


# ----------------------------
# Create Project (Saves to DB)
# ----------------------------
@app.post("/project")
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db)
):
    new_project = Project(
        name=project.name,
        domain=project.domain
    )

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return {
        "id": new_project.id,
        "name": new_project.name,
        "domain": new_project.domain
    }


# ----------------------------
# View All Projects
# ----------------------------
@app.get("/projects")
def get_projects(
    db: Session = Depends(get_db)
):
    projects = db.query(Project).all()

    return [
        {
            "id": p.id,
            "name": p.name,
            "domain": p.domain
        }
        for p in projects
    ]



@app.post("/citation-tracker")
def citation_tracker(domain: str):

    citations = [
        {
            "source":"searchenginejournal.com",
            "position":1,
            "brand_mentioned":True
        },
        {
            "source":"hubspot.com",
            "position":2,
            "brand_mentioned":True
        },
        {
            "source":"moz.com",
            "position":3,
            "brand_mentioned":False
        }
    ]


    total_mentions = 2
    total_citations = len(citations)

    visibility_score = round(
        (total_mentions / total_citations)*100,
        2
    )


    return {
        "domain":domain,

        "ai_citations_found":total_citations,

        "brand_mentions":total_mentions,

        "visibility_score":visibility_score,

        "citations":citations,

        "recommendations":[
            "Increase FAQ schema markup",
            "Improve answer-first content formatting",
            "Add stronger entity coverage"
        ]
    }

@app.post("/competitor-analysis")
def competitor_analysis(
    domain:str,
    competitor:str
):

    return {

        "your_domain":domain,
        "competitor":competitor,

        "comparison":{

            "brand_influence_score":{
                domain:84,
                competitor:76
            },

            "citation_share":{
                domain:"58%",
                competitor:"42%"
            },

            "average_rank":{
                domain:2,
                competitor:4
            },

            "visibility_probability":{
                domain:"82%",
                competitor:"69%"
            }

        },

        "winner":domain,

        "recommendations":[
            "Increase FAQ schema",
            "Expand authority pages",
            "Improve entity coverage"
        ]
    }

@app.post("/prompt-monitor")
def prompt_monitor(keyword:str):

    return {

        "keyword":keyword,

        "prompts_monitored":[

            {
                "prompt":"Best AI SEO tools",
                "brand_mentions":4,
                "citations":6,
                "success_score":88
            },

            {
                "prompt":"Top GEO platforms",
                "brand_mentions":3,
                "citations":5,
                "success_score":79
            },

            {
                "prompt":"How to improve AEO",
                "brand_mentions":5,
                "citations":7,
                "success_score":91
            }

        ],

        "trend_analysis":{
            "visibility_change":"+12%",
            "citation_volatility":"Low",
            "prompt_stability":"High"
        },

        "best_prompt":
            "How to improve AEO",

        "recommendations":[
            "Scale high-performing prompts",
            "Improve weak prompt variants",
            "Expand prompt diversity"
        ]
    }

@app.post("/content-optimizer")
def content_optimizer(domain:str):

    return {

        "domain":domain,

        "current_geo_score":74,

        "optimization_opportunities":[

            {
                "issue":"Missing FAQ schema",
                "impact":"High",
                "recommendation":
                "Add FAQ structured data"
            },

            {
                "issue":"Weak answer-first formatting",
                "impact":"Medium",
                "recommendation":
                "Use concise snippet-ready answers"
            },

            {
                "issue":"Low entity density",
                "impact":"High",
                "recommendation":
                "Increase semantic entity coverage"
            }

        ],

        "predicted_geo_score_after_fixes":89,

        "content_improvement_priority":[
            "Schema markup",
            "Featured snippet formatting",
            "Authority expansion"
        ],

        "success_probability":"84%"
    }

@app.post("/brand-influence-score")
def brand_influence_score(brand:str):

    return {

        "brand":brand,

        "overall_influence_score":86,

        "score_components":{

            "llm_mention_share":83,

            "citation_authority_score":88,

            "answer_presence_score":84,

            "entity_relevance_score":89

        },

        "engine_visibility":{

            "OpenAI":87,

            "Google_AI":81,

            "Anthropic":85

        },

        "market_position":"Leader",

        "recommendations":[
            "Increase expert citation sources",
            "Strengthen entity authority",
            "Expand answer-engine coverage"
        ]
    }

@app.post("/geo-predictor")
def geo_predictor(
    word_count: int,
    faq_schema: int,
    entity_density: float
):
    if clf is None or reg is None:
        return {"error": "Model not loaded. Run training first."}

    features = [[word_count, faq_schema, entity_density]]

    cited = clf.predict(features)[0]
    score = reg.predict(features)[0]

    return {
        "will_be_cited": "Yes" if cited == 1 else "No",
        "predicted_geo_score": round(float(score), 2)
    }

@app.get("/dashboard-metrics")
def dashboard_metrics():

    return {

        "kpis":{
            "geo_score":87,
            "aeo_score":82,
            "brand_influence":86,
            "citation_visibility":"66.7%"
        },

        "citation_trend":[
            {"month":"Jan","score":64},
            {"month":"Feb","score":69},
            {"month":"Mar","score":73},
            {"month":"Apr","score":81},
            {"month":"May","score":87}
        ],

        "competitor_leaderboard":[
            {
                "domain":"openai.com",
                "score":87
            },
            {
                "domain":"hubspot.com",
                "score":78
            },
            {
                "domain":"moz.com",
                "score":71
            }
        ],

        "top_recommendations":[
            "Improve FAQ structured data",
            "Increase answer-engine formatting",
            "Expand entity authority signals"
        ]
    }

@app.get("/export-report")
def export_report():

    return {

        "report_title":"GEOlytics Visibility Audit",

        "executive_summary":{
            "geo_score":87,
            "brand_influence":86,
            "citation_visibility":"66.7%"
        },

        "citation_audit":{
            "citations_found":14,
            "brand_mentions":9,
            "top_sources":[
                "searchenginejournal.com",
                "hubspot.com",
                "moz.com"
            ]
        },

        "competitor_benchmark":{
            "your_domain":"openai.com",
            "competitor":"hubspot.com",
            "winner":"openai.com"
        },

        "optimization_actions":[
            "Add FAQ schema",
            "Increase entity coverage",
            "Improve snippet formatting"
        ],

        "predicted_growth":{
            "projected_geo_score":92,
            "visibility_lift":"+18%"
        },

        "report_status":"Ready for PDF export"
    }

@app.post("/signup")
def signup(
    user:UserSignup,
    db:Session=Depends(get_db)
):

    new_user=User(
        username=user.username,
        email=user.email,
        password=user.password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message":"User created",
        "user_id":new_user.id
    }

@app.post("/login")
def login(
    user:UserLogin,
    db:Session=Depends(get_db)
):

    existing_user=db.query(User).filter(
        User.email==user.email
    ).first()


    if not existing_user:
        return {
            "error":"User not found"
        }

    if existing_user.password != user.password:
        return {
            "error":"Invalid credentials"
        }

    return {
        "message":"Login successful",
        "username":existing_user.username
    }

@app.post("/save-prompt-run")
def save_prompt_run(
    run:PromptRun,
    db:Session=Depends(get_db)
):

    new_run=PromptLog(
        keyword=run.keyword,
        prompt_text=run.prompt_text,
        success_score=run.success_score
    )

    db.add(new_run)
    db.commit()
    db.refresh(new_run)

    return {
        "message":"Prompt run stored",
        "id":new_run.id
    }

@app.get("/prompt-history")
def prompt_history(
    db:Session=Depends(get_db)
):

    rows=db.query(PromptLog).all()

    return [
        {
            "id":r.id,
            "keyword":r.keyword,
            "prompt":r.prompt_text,
            "success_score":r.success_score
        }
        for r in rows
    ]

@app.post("/full-analysis")
def full_analysis(keyword: str):

    if clf is None or reg is None:
        return {"error": "Model not loaded"}

    results = run_full_pipeline(keyword, clf, reg)

    return {
        "keyword": keyword,
        "total_prompts": len(results),
        "analysis": results
    }