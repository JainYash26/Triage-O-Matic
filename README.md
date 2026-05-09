# CyberGuard AI

AI-powered network threat detection with tamper-proof hash-chained audit logs.

---

## Architecture

```
cyberguard/
├── backend/                   FastAPI (Python)
│   ├── main.py                Routes: /analyze  /audit-chain  /health
│   ├── analyzer.py            Claude AI threat analysis
│   ├── audit_chain.py         SHA-256 hash chain builder + verifier
│   ├── database.py            SQLite persistence (swap for PostgreSQL)
│   ├── models.py              Pydantic data models
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/                  React + Vite
│   ├── src/
│   │   ├── App.jsx            Router + shared state
│   │   ├── api/client.js      All HTTP calls to backend
│   │   ├── utils/hash.js      SHA-256 client utilities
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── LogInput.jsx
│   │   │   ├── AnalysisView.jsx
│   │   │   └── AuditChain.jsx
│   │   └── pages/
│   │       ├── AnalyzePage.jsx
│   │       └── ChainPage.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml         One-command start for everything
├── .env.example
└── README.md
```

---

## Quick start (Docker — recommended)

```bash
# 1. Clone and enter
git clone https://github.com/yourname/cyberguard.git
cd cyberguard

# 2. Set your API key
cp .env.example .env
# Edit .env and paste: ANTHROPIC_API_KEY=sk-ant-xxxxx

# 3. Build and start both services
docker compose up --build

# App:      http://localhost:5173
# API docs: http://localhost:8000/docs
```

---

## Manual setup (no Docker)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env

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

## API reference

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check + block count |
| POST | `/analyze` | Analyze a log, store block |
| GET | `/audit-chain` | List all audit blocks |
| GET | `/audit-chain/{id}` | Get single block |
| GET | `/audit-chain/verify` | Verify chain integrity |

**POST /analyze — example request:**
```json
{
  "data": {
    "timestamp": "2024-01-15T14:23:45Z",
    "source_ip": "192.168.1.105",
    "destination_ip": "10.0.0.1",
    "protocol": "TCP",
    "destination_port": 22,
    "failed_attempts": 1203
  }
}
```

---

## Production deployment

### Backend → Render / Railway

1. Push `backend/` folder to a GitHub repo
2. Create a new **Web Service** on Render
3. Set environment variables:
   - `ANTHROPIC_API_KEY` = your key
   - `FRONTEND_URL` = https://your-frontend.vercel.app
   - `DB_PATH` = `/data/cyberguard.db`
4. Add a **Disk** volume mounted at `/data` (for SQLite persistence)
5. Build command: `pip install -r requirements.txt`
6. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend → Vercel / Netlify

1. Push `frontend/` to GitHub
2. Import repo on Vercel
3. Set env var: `VITE_API_URL` = https://your-backend.render.com
4. Deploy — Vercel auto-detects Vite

### Switching to PostgreSQL

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

## How the hash chain works

Each block stores:
- `data_hash` = SHA-256(input_log + AI_analysis)
- `previous_hash` = block_hash of the block before it
- `block_hash` = SHA-256(previous_hash + data_hash)

Changing any past entry changes its `data_hash`, which changes its `block_hash`,
which breaks every block that follows it. The `/audit-chain/verify` endpoint
detects this instantly.

---

## License

MIT
