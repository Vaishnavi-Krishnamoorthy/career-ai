from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.schemas import HackathonCreate, HackathonResponse
from app.services.hackathon_service import hackathon_service

router = APIRouter(prefix="/hackathons", tags=["Hackathons"])

@router.get("", response_model=List[HackathonResponse])
def list_hackathons(
    search: Optional[str] = Query(None, description="Search term for title or organizer"),
    mode: Optional[str] = Query(None, description="Filter by mode: Online, Hybrid, In-Person, All"),
    tag: Optional[str] = Query(None, description="Filter by tag (AI, Web3, Mobile, etc.)"),
    featured_only: bool = Query(False, description="Return only featured hackathons"),
    db: Session = Depends(get_db)
):
    return hackathon_service.get_hackathons(
        db=db,
        search=search,
        mode=mode,
        tag=tag,
        featured_only=featured_only
    )

@router.get("/{hackathon_id}", response_model=HackathonResponse)
def get_hackathon(hackathon_id: str, db: Session = Depends(get_db)):
    hackathon = hackathon_service.get_hackathon_by_id(db=db, hackathon_id=hackathon_id)
    if not hackathon:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hackathon not found")
    return hackathon

@router.post("", response_model=HackathonResponse, status_code=status.HTTP_201_CREATED)
def create_hackathon(hackathon_in: HackathonCreate, db: Session = Depends(get_db)):
    return hackathon_service.create_hackathon(db=db, hackathon_in=hackathon_in)
