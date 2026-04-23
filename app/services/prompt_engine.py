def generate_prompts(keyword: str):
    templates = [
        f"What is the best {keyword}?",
        f"Top companies for {keyword}",
        f"Explain {keyword} in detail",
    ]
    return templates