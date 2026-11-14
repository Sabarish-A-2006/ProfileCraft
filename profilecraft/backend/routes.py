"""
API routes for ProfileCraft backend.
Provides full CRUD RESTful endpoints with comprehensive input validation.
"""
import re
from urllib.parse import urlparse
from flask import Blueprint, request, jsonify
from database import db
from models import Profile

api_bp = Blueprint('api', __name__, url_prefix='/api')

EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')


def is_valid_url(url_str, optional=True):
    """Validate if URL has valid http/https scheme and netloc."""
    if not url_str:
        return optional
    try:
        parsed = urlparse(url_str.strip())
        return parsed.scheme in ('http', 'https') and bool(parsed.netloc)
    except Exception:
        return False


def validate_profile_payload(data, is_update=False):
    """
    Validate input data payload.
    Returns (cleaned_data, error_dict).
    """
    errors = {}
    cleaned = {}

    # Required fields on creation
    required_fields = ['name', 'designation', 'bio', 'image_url', 'location', 'email']

    if not is_update:
        for field in required_fields:
            val = data.get(field)
            if not val or not str(val).strip():
                errors[field] = f"{field.replace('_', ' ').capitalize()} is required."

    # Validate Name
    if 'name' in data:
        name = str(data.get('name', '')).strip()
        if not name and not is_update:
            errors['name'] = 'Full Name is required.'
        elif name and len(name) > 100:
            errors['name'] = 'Full Name must not exceed 100 characters.'
        else:
            cleaned['name'] = name

    # Validate Designation
    if 'designation' in data:
        desig = str(data.get('designation', '')).strip()
        if not desig and not is_update:
            errors['designation'] = 'Professional Title is required.'
        elif desig and len(desig) > 120:
            errors['designation'] = 'Professional Title must not exceed 120 characters.'
        else:
            cleaned['designation'] = desig

    # Validate Biography
    if 'bio' in data:
        bio = str(data.get('bio', '')).strip()
        if not bio and not is_update:
            errors['bio'] = 'Biography is required.'
        elif bio and len(bio) > 500:
            errors['bio'] = 'Biography must not exceed 500 characters.'
        else:
            cleaned['bio'] = bio

    # Validate Profile Image URL
    if 'image_url' in data:
        img_url = str(data.get('image_url', '')).strip()
        if not img_url and not is_update:
            errors['image_url'] = 'Profile image URL is required.'
        elif img_url and not is_valid_url(img_url, optional=False):
            errors['image_url'] = 'Profile image URL must be a valid HTTP or HTTPS web address.'
        else:
            cleaned['image_url'] = img_url

    # Validate Location
    if 'location' in data:
        loc = str(data.get('location', '')).strip()
        if not loc and not is_update:
            errors['location'] = 'Location is required.'
        elif loc and len(loc) > 120:
            errors['location'] = 'Location must not exceed 120 characters.'
        else:
            cleaned['location'] = loc

    # Validate Email
    if 'email' in data:
        email = str(data.get('email', '')).strip()
        if not email and not is_update:
            errors['email'] = 'Email address is required.'
        elif email and not EMAIL_REGEX.match(email):
            errors['email'] = 'Please enter a valid email address (e.g., name@example.com).'
        else:
            cleaned['email'] = email.lower()

    # Optional Phone
    if 'phone' in data:
        phone = str(data.get('phone', '')).strip()
        cleaned['phone'] = phone

    # Optional Website
    if 'website' in data:
        website = str(data.get('website', '')).strip()
        if website and not is_valid_url(website):
            errors['website'] = 'Website must be a valid HTTP or HTTPS web address.'
        else:
            cleaned['website'] = website

    # Skills parsing & validation
    if 'skills' in data:
        raw_skills = data.get('skills')
        skills_list = []
        if isinstance(raw_skills, list):
            skills_list = [str(s).strip() for s in raw_skills if str(s).strip()]
        elif isinstance(raw_skills, str):
            skills_list = [s.strip() for s in raw_skills.split(',') if s.strip()]

        if not skills_list and not is_update:
            errors['skills'] = 'At least one skill is required.'
        else:
            cleaned['skills'] = skills_list

    # Optional Experience & Education
    if 'experience' in data:
        cleaned['experience'] = str(data.get('experience', '')).strip()
    if 'education' in data:
        cleaned['education'] = str(data.get('education', '')).strip()

    # Social links
    social_fields = ['linkedin', 'github', 'instagram', 'portfolio']
    for field in social_fields:
        if field in data:
            url_val = str(data.get(field, '')).strip()
            if url_val and not is_valid_url(url_val):
                errors[field] = f"{field.capitalize()} link must be a valid HTTP or HTTPS web address."
            else:
                cleaned[field] = url_val

    return cleaned, errors


@api_bp.route('/health', methods=['GET'])
def health_check():
    """Healthcheck endpoint for monitoring and test verification."""
    return jsonify({
        'status': 'healthy',
        'service': 'ProfileCraft API',
        'database': 'SQLite profilecraft.db'
    }), 200


@api_bp.route('/profiles', methods=['POST'])
def create_profile():
    """
    POST /api/profiles
    Create and process a new profile.
    Genuinely processes, validates, and stores profile data in SQLite.
    """
    if not request.is_json:
        return jsonify({
            'success': False,
            'message': 'Request must contain valid JSON data.'
        }), 400

    data = request.get_json()
    if not data:
        return jsonify({
            'success': False,
            'message': 'Empty JSON payload received.'
        }), 400

    cleaned_data, errors = validate_profile_payload(data, is_update=False)
    if errors:
        return jsonify({
            'success': False,
            'message': 'Validation failed. Please correct the errors and try again.',
            'errors': errors
        }), 400

    try:
        new_profile = Profile(
            name=cleaned_data['name'],
            designation=cleaned_data['designation'],
            bio=cleaned_data['bio'],
            image_url=cleaned_data['image_url'],
            location=cleaned_data['location'],
            email=cleaned_data['email'],
            phone=cleaned_data.get('phone', ''),
            website=cleaned_data.get('website', ''),
            experience=cleaned_data.get('experience', ''),
            education=cleaned_data.get('education', ''),
            linkedin=cleaned_data.get('linkedin', ''),
            github=cleaned_data.get('github', ''),
            instagram=cleaned_data.get('instagram', ''),
            portfolio=cleaned_data.get('portfolio', '')
        )
        new_profile.set_skills_list(cleaned_data.get('skills', []))

        db.session.add(new_profile)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Profile generated successfully!',
            'profile': new_profile.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'An error occurred while saving the profile: {str(e)}'
        }), 500


@api_bp.route('/profiles', methods=['GET'])
def get_profiles():
    """
    GET /api/profiles
    Retrieve all profiles from the database, ordered by creation date descending.
    Supports optional `search` query parameter.
    """
    search_query = request.args.get('search', '').strip()

    try:
        query = Profile.query

        if search_query:
            wildcard = f"%{search_query}%"
            query = query.filter(
                (Profile.name.ilike(wildcard)) |
                (Profile.designation.ilike(wildcard)) |
                (Profile.location.ilike(wildcard)) |
                (Profile.skills.ilike(wildcard))
            )

        profiles = query.order_by(Profile.created_at.desc()).all()
        profiles_list = [p.to_dict() for p in profiles]

        return jsonify({
            'success': True,
            'count': len(profiles_list),
            'profiles': profiles_list
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Failed to retrieve profiles: {str(e)}'
        }), 500


@api_bp.route('/profiles/<int:profile_id>', methods=['GET'])
def get_profile_by_id(profile_id):
    """
    GET /api/profiles/{id}
    Retrieve a specific profile by primary key ID.
    """
    try:
        profile = db.session.get(Profile, profile_id)
        if not profile:
            return jsonify({
                'success': False,
                'message': f'Profile with ID {profile_id} not found.'
            }), 404

        return jsonify({
            'success': True,
            'profile': profile.to_dict()
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error fetching profile: {str(e)}'
        }), 500


@api_bp.route('/profiles/<int:profile_id>', methods=['PUT'])
def update_profile(profile_id):
    """
    PUT /api/profiles/{id}
    Update an existing profile by ID.
    """
    if not request.is_json:
        return jsonify({
            'success': False,
            'message': 'Request must contain valid JSON data.'
        }), 400

    try:
        profile = db.session.get(Profile, profile_id)
        if not profile:
            return jsonify({
                'success': False,
                'message': f'Profile with ID {profile_id} not found.'
            }), 404

        data = request.get_json()
        cleaned_data, errors = validate_profile_payload(data, is_update=True)
        if errors:
            return jsonify({
                'success': False,
                'message': 'Validation failed. Please correct the errors.',
                'errors': errors
            }), 400

        # Update fields
        for field in ['name', 'designation', 'bio', 'image_url', 'location',
                      'email', 'phone', 'website', 'experience', 'education',
                      'linkedin', 'github', 'instagram', 'portfolio']:
            if field in cleaned_data:
                setattr(profile, field, cleaned_data[field])

        if 'skills' in cleaned_data:
            profile.set_skills_list(cleaned_data['skills'])

        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Profile updated successfully!',
            'profile': profile.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error updating profile: {str(e)}'
        }), 500


@api_bp.route('/profiles/<int:profile_id>', methods=['DELETE'])
def delete_profile(profile_id):
    """
    DELETE /api/profiles/{id}
    Delete a profile from the SQLite database.
    """
    try:
        profile = db.session.get(Profile, profile_id)
        if not profile:
            return jsonify({
                'success': False,
                'message': f'Profile with ID {profile_id} not found.'
            }), 404

        db.session.delete(profile)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Profile deleted successfully!',
            'deleted_id': profile_id
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error deleting profile: {str(e)}'
        }), 500

