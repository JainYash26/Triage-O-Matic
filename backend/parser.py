import json

def parse_input(data):
    # Already structured → return as is
    if isinstance(data, (dict, list)):
        return data

    # If string → try JSON
    if isinstance(data, str):
        try:
            return json.loads(data)
        except:
            return {
                "raw_logs": data,
                "lines": data.splitlines()
            }

    # fallback for anything else
    text = str(data)
    return {
        "raw_logs": text,
        "lines": text.splitlines()
    }