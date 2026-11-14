"""
Data models for the ProfileCraft application.
Defines the Profile table and serialization methods.
"""
from datetime import datetime, timezone
import json
from database import db


class Profile(db.Model):
    """
    Profile model representing a user's professional profile card data.
    Stored in SQLite 'profilecraft.db' under the 'profiles' table.
    """
    __tablename__ = 'profiles'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(120), nullable=False)
    designation = db.Column(db.String(150), nullable=False)
    bio = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    location = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(150), nullable=False)
    phone = db.Column(db.String(50), nullable=True)
    website = db.Column(db.String(255), nullable=True)
    skills = db.Column(db.Text, nullable=False)  # JSON-encoded array of skill strings
    experience = db.Column(db.String(200), nullable=True)
    education = db.Column(db.String(200), nullable=True)
    linkedin = db.Column(db.String(255), nullable=True)
    github = db.Column(db.String(255), nullable=True)
    instagram = db.Column(db.String(255), nullable=True)
    portfolio = db.Column(db.String(255), nullable=True)
    created_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    def get_skills_list(self):
        """Parse stored JSON skills into a python list."""
        try:
            if isinstance(self.skills, list):
                return self.skills
            parsed = json.loads(self.skills)
            return parsed if isinstance(parsed, list) else [str(parsed)]
        except Exception:
            # Fallback if comma separated string
            if self.skills:
                return [s.strip() for s in self.skills.split(',') if s.strip()]
            return []

    def set_skills_list(self, skills_input):
        """Convert a list or comma-separated string into a JSON string."""
        if isinstance(skills_input, list):
            cleaned = [str(s).strip() for s in skills_input if str(s).strip()]
            self.skills = json.dumps(cleaned)
        elif isinstance(skills_input, str):
            # Check if it's already JSON string
            try:
                parsed = json.loads(skills_input)
                if isinstance(parsed, list):
                    cleaned = [str(s).strip() for s in parsed if str(s).strip()]
                    self.skills = json.dumps(cleaned)
                    return
            except Exception:
                pass
            cleaned = [s.strip() for s in skills_input.split(',') if s.strip()]
            self.skills = json.dumps(cleaned)
        else:
            self.skills = json.dumps([])

    def to_dict(self):
        """Serialize Profile model into a dictionary matching API requirements."""
        return {
            'id': self.id,
            'name': self.name,
            'designation': self.designation,
            'bio': self.bio,
            'image_url': self.image_url,
            'location': self.location,
            'email': self.email,
            'phone': self.phone or '',
            'website': self.website or '',
            'skills': self.get_skills_list(),
            'experience': self.experience or '',
            'education': self.education or '',
            'linkedin': self.linkedin or '',
            'github': self.github or '',
            'instagram': self.instagram or '',
            'portfolio': self.portfolio or '',
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

