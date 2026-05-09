import os
import jwt
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))
load_dotenv()

from models import LogInput, AnalyzeResponse, AuditBlock, UserCreate, UserLogin, Token
from analyzer import analyze_log
from audit_chain import build_block, verify_chain, GENESIS_HASH
from database import init_db, insert_block, load_chain, count_blocks, get_user_by_email, create_user
<<<<<<< HEAD
from parser import parse_input
=======
>>>>>>> 33aeb1f989947c36c4405a9299e8bf0e6738a7f3

# --- Security Configuration ---
SECRET_KEY = os.environ.get("JWT_SECRET", "super-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# --- App Setup ---
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173")

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(
    title="Triage-O-Matic",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Auth Routes ---
@app.post("/register")
def register_user(user: UserCreate):
    existing_user = get_user_by_email(user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw = get_password_hash(user.password)
    create_user(user.name, user.email, hashed_pw)
    return {"message": "User created successfully!"}

@app.post("/login", response_model=Token)
def login_user(user: UserLogin):
    db_user = get_user_by_email(user.email)
    if not db_user or not verify_password(user.password, db_user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# --- Existing Routes ---
@app.get("/health")
def health():
    key = os.environ.get("GROQ_API_KEY", "")
    return {
        "status": "ok",
        "blocks": count_blocks(),
        "groq_key_loaded": bool(key),
    }

@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(payload: LogInput):
    key = os.environ.get("GROQ_API_KEY", "")
    if not key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY not set.")
    try:
<<<<<<< HEAD
        parsed_data = parse_input(payload.data)  

        # If user uploads multiple logs (array / bulk)
        if isinstance(parsed_data, list):
            results = [analyze_log(item) for item in parsed_data]
            analysis = [item for sublist in results for item in sublist]

        else:
            # Handle empty input
            if parsed_data is None or (isinstance(parsed_data, str) and parsed_data.strip() == ""):
                raise HTTPException(status_code=400, detail="Empty log input")

            analysis = analyze_log(parsed_data)

=======
        analysis = analyze_log(payload.data) 
>>>>>>> 33aeb1f989947c36c4405a9299e8bf0e6738a7f3
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")

    chain = load_chain()
    previous_hash = chain[-1].block_hash if chain else GENESIS_HASH
    block = build_block(
        block_id=len(chain) + 1,
        previous_hash=previous_hash,
        input_data=payload.data,
        analysis=analysis, 
    )
    insert_block(block)
    return AnalyzeResponse(analysis=analysis, block=block)

@app.get("/audit-chain", response_model=list[AuditBlock])
def get_chain():
    return load_chain()

@app.get("/audit-chain/verify")
def verify():
    chain = load_chain()
    return {"intact": verify_chain(chain), "blocks": len(chain)}

@app.get("/audit-chain/{block_id}", response_model=AuditBlock)
def get_block(block_id: int):
    chain = load_chain()
    if block_id < 1 or block_id > len(chain):
        raise HTTPException(status_code=404, detail="Block not found")
    return chain[block_id - 1]