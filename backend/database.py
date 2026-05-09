"""
Persistent SQLite storage for the audit chain and users.
"""
import sqlite3
import json
import os
from datetime import datetime, timezone
from models import AuditBlock, AnalysisResult

DB_PATH = os.environ.get("DB_PATH", "cyberguard.db")

# ── Schema ────────────────────────────────────────────────────────────────────

def init_db() -> None:
    with _conn() as conn:
        # Audit Chain Table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS audit_chain (
                id            INTEGER PRIMARY KEY,
                timestamp     TEXT    NOT NULL,
                previous_hash TEXT    NOT NULL,
                data_hash     TEXT    NOT NULL,
                block_hash    TEXT    NOT NULL,
                input_data    TEXT    NOT NULL,  
                analysis      TEXT    NOT NULL   
            )
        """)
        # Users Table
        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL
            )
        """)
        conn.commit()

# ── User Auth CRUD ────────────────────────────────────────────────────────────

def get_user_by_email(email: str):
    with _conn() as conn:
        return conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()

def create_user(name: str, email: str, password_hash: str) -> None:
    with _conn() as conn:
        conn.execute(
            "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
            (name, email, password_hash)
        )
        conn.commit()

# ── Audit Chain CRUD ──────────────────────────────────────────────────────────

def insert_block(block: AuditBlock) -> None:
    with _conn() as conn:
        conn.execute(
            """INSERT INTO audit_chain
               (id, timestamp, previous_hash, data_hash, block_hash, input_data, analysis)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (
                block.id,
                block.timestamp.isoformat(),
                block.previous_hash,
                block.data_hash,
                block.block_hash,
                json.dumps(block.input_data),
                json.dumps([a.model_dump() for a in block.analysis] if isinstance(block.analysis, list) else block.analysis.model_dump())
            ),
        )
        conn.commit()

def load_chain() -> list[AuditBlock]:
    with _conn() as conn:
        rows = conn.execute(
            "SELECT * FROM audit_chain ORDER BY id ASC"
        ).fetchall()
    return [_row_to_block(row) for row in rows]

def count_blocks() -> int:
    with _conn() as conn:
        return conn.execute("SELECT COUNT(*) FROM audit_chain").fetchone()[0]

# ── Helpers ───────────────────────────────────────────────────────────────────

def _conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def _row_to_block(row: sqlite3.Row) -> AuditBlock:
    raw_analysis = json.loads(row["analysis"])
    
    if isinstance(raw_analysis, list):
        parsed_analysis = [AnalysisResult(**a) for a in raw_analysis]
    else:
        parsed_analysis = [AnalysisResult(**raw_analysis)]

    return AuditBlock(
        id=row["id"],
        timestamp=datetime.fromisoformat(row["timestamp"]),
        previous_hash=row["previous_hash"],
        data_hash=row["data_hash"],
        block_hash=row["block_hash"],
        input_data=json.loads(row["input_data"]),
        analysis=parsed_analysis,
    )