"""
Threat analyzer using Groq — free, no credit card needed.
Get your key at console.groq.com
"""
import json
import os
import urllib.request
import urllib.error
from dotenv import load_dotenv
from models import AnalysisResult

load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))
load_dotenv()

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
GROQ_URL     = "https://api.groq.com/openai/v1/chat/completions"
MODEL        = "llama-3.3-70b-versatile"   # latest stable Groq model

SYSTEM_PROMPT = (
    "You are an expert cybersecurity AI threat analyst embedded in a SIEM. "
    "You will receive a bulk dump of network logs containing both healthy and malicious traffic. "
    "Filter out the healthy traffic and identify all distinct security threats. "
    "Always respond ONLY with valid JSON — no markdown, no preamble."
)

USER_TEMPLATE = """Analyze these bulk network logs:

{log_json}

Return ONLY a JSON object with a "threats" array containing the exact keys below for EACH threat found. 
If the traffic is 100% healthy, return an empty array for "threats".
{{
  "threats": [
    {{
      "attack_type": "e.g. SSH Brute Force",
      "severity": "CRITICAL or HIGH or MEDIUM or LOW",
      "confidence": "XX%",
      "affected_systems": ["list"],
      "attack_vector": "one sentence",
      "indicators": ["IOC 1", "IOC 2"],
      "historical_context": "2-3 sentences",
      "immediate_actions": ["step 1", "step 2"],
      "long_term_solutions": ["fix 1", "fix 2"],
      "rule_matched": "RULE-XXX-001",
      "mitre_attack": "T1XXX.XXX"
    }}
  ]
}}"""

def analyze_log(log_data) -> list[AnalysisResult]:
    api_key = os.environ.get("GROQ_API_KEY", GROQ_API_KEY)
    # --- NEW: Support ALL input formats (text, CSV, logs, JSON) ---
    if isinstance(log_data, str):
        # Wrap raw logs so AI understands it clearly
        log_data = {
            "raw_logs": log_data,
            "format": "unstructured_log_text"
        }

    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not set.")

    if not api_key.startswith("gsk_"):
        raise RuntimeError("GROQ_API_KEY looks wrong. It should start with 'gsk_'.")

    payload = json.dumps({
        "model": MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",   "content": USER_TEMPLATE.format(
                log_json=json.dumps(log_data, indent=2)
            )},
        ],
        "temperature": 0.2,
        "max_tokens": 2048, # Increased token limit for bulk logs
    }).encode()

    req = urllib.request.Request(
        GROQ_URL,
        data=payload,
        headers={
            "Content-Type":  "application/json",
            "Authorization": f"Bearer {api_key}",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) CyberGuard/1.0"
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            body = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        raise RuntimeError(f"Groq API error {e.code}: {error_body}")

    raw = body["choices"][0]["message"]["content"].strip()
    raw = raw.replace("```json", "").replace("```", "").strip()

    if "{" in raw:
        raw = raw[raw.index("{"):raw.rindex("}")+1]

    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        raise RuntimeError(f"Invalid JSON from AI: {raw}")
    
    # Extract the list of threats from the AI's JSON response
    threats_list = parsed.get("threats", [])
    
    return [AnalysisResult(**threat) for threat in threats_list]