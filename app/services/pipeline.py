import random

from app.services.prompt_engine import generate_prompts
from app.services.ai_engine import get_ai_response
from app.services.parser import parse_response


def run_full_pipeline(keyword: str, clf, reg):

    prompts = generate_prompts(keyword)

    results = []

    for prompt in prompts:

        # Step 1: AI Response
        ai_res = get_ai_response(prompt)

        # Step 2: Parse
        parsed = parse_response(ai_res)

        # Step 3: Simulate features
        word_count = random.randint(800, 2500)
        faq_schema = random.randint(0, 1)
        entity_density = round(random.uniform(0.3, 0.8), 2)

        features = [[word_count, faq_schema, entity_density]]

        # Step 4: ML Prediction
        cited = clf.predict(features)[0]
        geo_score = reg.predict(features)[0]

        results.append({
            "prompt": prompt,
            "brands": parsed["brands"],
            "citations": parsed["citations"],
            "features": {
                "word_count": word_count,
                "faq_schema": faq_schema,
                "entity_density": entity_density
            },
            "will_be_cited": "Yes" if cited == 1 else "No",
            "geo_score": round(float(geo_score), 2)
        })

    return results