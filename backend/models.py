from pydantic import BaseModel
from typing import Any, Optional
from datetime import datetime

class LogInput(BaseModel):
    """Raw network log(s) submitted for analysis. Can be a dict or a list of dicts."""
    data: Any

class AnalysisResult(BaseModel):
    attack_type: str
    severity: str          # CRITICAL | HIGH | MEDIUM | LOW
    confidence: str
    affected_systems: list[str]
    attack_vector: str
    indicators: list[str]
    historical_context: str
    immediate_actions: list[str]
    long_term_solutions: list[str]
    rule_matched: str
    mitre_attack: Optional[str] = None

class AuditBlock(BaseModel):
    """One immutable, hash-chained audit entry."""
    id: int
    timestamp: datetime
    previous_hash: str
    data_hash: str
    block_hash: str
    input_data: Any
    analysis: list[AnalysisResult]

class AnalyzeResponse(BaseModel):
    analysis: list[AnalysisResult]
    block: AuditBlock

# --- Auth Models ---
class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str