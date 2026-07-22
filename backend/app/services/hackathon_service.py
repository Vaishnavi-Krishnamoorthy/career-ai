from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.db_models import Hackathon
from app.models.schemas import HackathonCreate

class HackathonService:
    def get_hackathons(
        self,
        db: Session,
        search: Optional[str] = None,
        mode: Optional[str] = None,
        tag: Optional[str] = None,
        featured_only: bool = False
    ) -> List[Hackathon]:
        query = db.query(Hackathon)

        if search:
            search_pattern = f"%{search}%"
            query = query.filter(
                (Hackathon.title.ilike(search_pattern)) | 
                (Hackathon.organizer.ilike(search_pattern)) | 
                (Hackathon.description.ilike(search_pattern))
            )

        if mode and mode.lower() != "all":
            query = query.filter(Hackathon.mode.ilike(mode))

        if featured_only:
            query = query.filter(Hackathon.is_featured == True)

        hackathons = query.order_by(Hackathon.created_at.desc()).all()

        if tag and tag.lower() != "all":
            hackathons = [h for h in hackathons if any(tag.lower() in t.lower() for t in (h.tags or []))]

        return hackathons

    def get_hackathon_by_id(self, db: Session, hackathon_id: str) -> Optional[Hackathon]:
        return db.query(Hackathon).filter(Hackathon.id == hackathon_id).first()

    def create_hackathon(self, db: Session, hackathon_in: HackathonCreate) -> Hackathon:
        hackathon = Hackathon(**hackathon_in.model_dump())
        db.add(hackathon)
        db.commit()
        db.refresh(hackathon)
        return hackathon

hackathon_service = HackathonService()
