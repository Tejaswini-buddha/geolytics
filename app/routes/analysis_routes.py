from fastapi import APIRouter
from app.services.prompt_engine import generate_prompts
from app.services.ai_engine import get_ai_response
from app.services.parser import parse_response
from app.services.ml_model import predict_geo_score

router = APIRouter()

@router.post("/run-analysis")
def run_analysis(keyword: str):
    prompts = generate_prompts(keyword)

    results = []

    for p in prompts:
        ai_res = get_ai_response(p)
        parsed = parse_response(ai_res)

        score = predict_geo_score({})

        results.append({
            "prompt": p,
            "brands": parsed["brands"],
            "citations": parsed["citations"],
            "geo_score": score
        })

    return {"results": results}