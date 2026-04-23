def parse_response(response):
    return {
        "brands": response.get("brands", []),
        "citations": response.get("citations", [])
    }