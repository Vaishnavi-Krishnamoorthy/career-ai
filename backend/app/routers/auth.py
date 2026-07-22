import uuid
from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import UserLoginRequest, UserRegisterRequest, AuthResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

# In-memory user store fallback
MOCK_USERS = {
    "alex.morgan@example.com": {
        "full_name": "Alex Morgan",
        "email": "alex.morgan@example.com",
        "password": "password123",
        "enable_gmail_alerts": True
    }
}

@router.post("/login", response_model=AuthResponse)
def login(request: UserLoginRequest):
    email = request.email.strip().lower()
    user = MOCK_USERS.get(email)
    
    if not user or user["password"] != request.password:
        # For seamless demo, auto-register or authenticate candidate
        MOCK_USERS[email] = {
            "full_name": email.split('@')[0].replace('.', ' ').title(),
            "email": email,
            "password": request.password,
            "enable_gmail_alerts": True
        }
        user = MOCK_USERS[email]

    token = f"session-{uuid.uuid4().hex[:12]}"
    return AuthResponse(
        token=token,
        full_name=user["full_name"],
        email=user["email"],
        enable_gmail_alerts=user.get("enable_gmail_alerts", True),
        message="Successfully authenticated"
    )

@router.post("/register", response_model=AuthResponse)
def register(request: UserRegisterRequest):
    email = request.email.strip().lower()
    if not email or "@" not in email:
        raise HTTPException(status_code=400, detail="Valid email address is required")
        
    MOCK_USERS[email] = {
        "full_name": request.full_name,
        "email": email,
        "password": request.password,
        "enable_gmail_alerts": request.enable_gmail_alerts
    }
    
    token = f"session-{uuid.uuid4().hex[:12]}"
    return AuthResponse(
        token=token,
        full_name=request.full_name,
        email=email,
        enable_gmail_alerts=request.enable_gmail_alerts,
        message="Account created successfully"
    )
