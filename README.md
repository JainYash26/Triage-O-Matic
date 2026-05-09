# CyberGuard AI (Triage-O-Matic SIEM)

An enterprise-ready, AI-powered network threat detection SIEM. Features include a tamper-proof cryptographic audit chain, stateless JWT authentication, visual threat dashboards, and fully observable LLM pipelines powered by LLaMA-3, LangChain, and LangSmith.

---

## Architecture

```
cyberguard/
├── backend/                   FastAPI (Python)
│   ├── main.py                Routes: /login /register /analyze-file /audit-chain /audit-chain/{id} /audit-chain/verify /health
│   ├── analyzer.py            LangChain + Groq (LLaMA-3) threat analysis
│   ├── audit_chain.py         SHA-256 hash chain builder + verifier
│   ├── database.py            SQLite persistence (Users + Audit Blocks)
│   ├── models.py              Pydantic data models (Validation)
│   ├── parser.py              Log ingestion parser (handles CSV/TXT/JSON fallbacks)
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/                  React + Vite
│   ├── src/
│   │   ├── App.jsx            React Router + protected routes
│   │   ├── api/client.js      HTTP calls & JWT bearer token injection
│   │   ├── utils/hash.js      SHA-256 client utilities
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── LogInput.jsx     (Drag & Drop log ingestion)
│   │   │   ├── AnalysisView.jsx (Recharts Threat Dashboard)
│   │   │   └── AuditChain.jsx   (Cryptographic ledger UI)
│   │   └── pages/
│   │       ├── LandingPage.jsx
│   │       ├── LoginPage.jsx
│   │       ├── SignupPage.jsx
│   │       ├── AnalyzePage.jsx
│   │       └── ChainPage.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml         Isolated multi-container orchestration
├── .env.example
└── README.md
```

---

## Core Features

- **Observable AI Inference**: Utilizes LangChain to enforce strict Pydantic JSON schemas and LangSmith for full trace visibility, token tracking, and latency monitoring.
- **Cryptographic Ledger**: Every AI analysis is hashed alongside the raw input using SHA-256 and chained to the previous block, creating a 100% tamper-evident database.
- **Zero-Trust Authentication**: Stateless session management via PyJWT, with user credentials securely salted and hashed using bcrypt and passlib.
- **Token-Aware Ingestion**: Drag-and-drop `.csv`, `.txt`, or `.json` log files. The Python backend safely parses and truncates massive logs (keeping the most recent 150 events) to protect the LLM context window.
- **Visual Threat Dashboard**: Interactive Recharts-powered UI mapping out critical, high, and medium severity threats dynamically from the AI's JSON output.

---

## Quick Start (Docker — Recommended)

```bash
# 1. Clone and enter
git clone https://github.com/yourname/cyberguard.git
cd cyberguard

# 2. Set your environment variables
cp .env.example .env

# Edit .env and paste:
# GROQ_API_KEY=gsk_your_groq_key_here
# LANGCHAIN_TRACING_V2=true
# LANGCHAIN_API_KEY=lsv2_pt_your_langsmith_key_here
# LANGCHAIN_PROJECT=CyberGuard-SIEM

# 3. Build and start both isolated containers
docker compose up --build

# App:      http://localhost:5173
# API docs: http://localhost:8000/docs
```

---

## Manual Setup (No Docker)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Add your GROQ_API_KEY and LANGCHAIN_API_KEY to .env

uvicorn main:app --reload
# Runs on http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## API Reference

| Method | Path | Description | Authentication |
|--------|------|-------------|----------------|
| POST | `/register` | Create a new user account | None |
| POST | `/login` | Authenticate and receive JWT | None |
| GET | `/health` | Health check + block count | None |
| POST | `/analyze-file` | Upload `.csv`/`.txt`/`.json` log for AI analysis | Required (JWT) |
| GET | `/audit-chain` | List all cryptographic audit blocks | Required (JWT) |
| GET | `/audit-chain/{id}` | Get single block details | Required (JWT) |
| GET | `/audit-chain/verify` | Verify blockchain integrity | Required (JWT) |

---

## Production Deployment

### Scaling to PostgreSQL

The current architecture uses SQLite mapped to a Docker volume (`/data/cyberguard.db`) for portability. For enterprise scaling and horizontal concurrency, the system is designed to hot-swap to PostgreSQL.

In `database.py`, uncomment the PostgreSQL block at the bottom:

```python
import psycopg2, psycopg2.extras
DATABASE_URL = os.environ["DATABASE_URL"]

def _conn():
    conn = psycopg2.connect(DATABASE_URL)
    conn.cursor_factory = psycopg2.extras.RealDictCursor
    return conn
```

Then `pip install psycopg2-binary` and set `DATABASE_URL` in your environment.

---

## How the Cryptographic Hash Chain Works

To prevent malicious insiders from altering log history, each block stores:

```
data_hash     = SHA-256(raw_input_log + AI_threat_analysis)
previous_hash = block_hash of the block before it
block_hash    = SHA-256(previous_hash + data_hash)
```

Altering a past record in the database changes its `data_hash`, which cascades and invalidates the `block_hash` of every subsequent entry. The frontend instantly flags the breach via the `/audit-chain/verify` endpoint.
