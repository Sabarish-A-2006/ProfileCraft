"""
Main Flask application entry point for ProfileCraft.
Initializes the Flask server, SQLite database, CORS, and registers API routes.
"""
import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from database import db, init_db
from models import Profile
from routes import api_bp

load_dotenv()

def create_app(test_config=None):
    """Application factory for ProfileCraft Flask backend."""
    base_dir = os.path.abspath(os.path.dirname(__file__))
    dist_folder = os.path.abspath(os.path.join(base_dir, '..', 'frontend', 'dist'))

    if os.path.isdir(dist_folder):
        app = Flask(__name__, static_folder=dist_folder, static_url_path='')
    else:
        app = Flask(__name__)

    db_path = os.path.join(base_dir, 'profilecraft.db')

    app.config.from_mapping(
        SECRET_KEY=os.environ.get('SECRET_KEY', 'profilecraft-dev-secret-key-2026'),
        SQLALCHEMY_DATABASE_URI=f'sqlite:///{db_path}',
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        JSON_SORT_KEYS=False
    )

    if test_config:
        app.config.update(test_config)

    # Enable CORS for frontend communication
    CORS(app, resources={
        r"/api/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    # Initialize database
    init_db(app)

    # Register API blueprint
    app.register_blueprint(api_bp)

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        """Serve built React frontend SPA or API root status."""
        if path.startswith('api'):
            return jsonify({'error': 'Endpoint not found'}), 404

        if os.path.isdir(dist_folder) and path and os.path.isfile(os.path.join(dist_folder, path)):
            return send_from_directory(dist_folder, path)

        if os.path.isdir(dist_folder) and os.path.isfile(os.path.join(dist_folder, 'index.html')):
            return send_from_directory(dist_folder, 'index.html')

        return jsonify({
            'application': 'ProfileCraft Backend API',
            'status': 'online',
            'endpoints': {
                'POST /api/profiles': 'Create and process a new profile',
                'GET /api/profiles': 'Retrieve all profiles (supports ?search=)',
                'GET /api/profiles/<id>': 'Retrieve a specific profile',
                'PUT /api/profiles/<id>': 'Update an existing profile',
                'DELETE /api/profiles/<id>': 'Delete a profile',
                'GET /api/health': 'API Health check'
            }
        })

    # Seed initial showcase profiles if database is empty
    with app.app_context():
        seed_initial_data()

    return app


def seed_initial_data():
    """Seed sample profiles if database has no records."""
    try:
        if Profile.query.first() is None:
            sample_profiles = [
                {
                    "name": "Alex Johnson",
                    "designation": "Full-Stack Developer",
                    "bio": "Passionate developer crafting high-performance web applications with React, Python, and cloud technologies. Open-source enthusiast and mentor.",
                    "image_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
                    "location": "Chennai, India",
                    "email": "alex.johnson@example.com",
                    "phone": "+91 98765 43210",
                    "website": "https://alexjohnson.dev",
                    "skills": ["Python", "Flask", "React", "JavaScript", "SQL", "Docker", "TailwindCSS"],
                    "experience": "5+ Years building scalable web applications",
                    "education": "B.Tech in Computer Science & Engineering",
                    "linkedin": "https://linkedin.com/in/alexjohnson-dev",
                    "github": "https://github.com/alexjohnson-dev",
                    "instagram": "https://instagram.com/alexjohnson.dev",
                    "portfolio": "https://alexjohnson.dev/portfolio"
                },
                {
                    "name": "Sophia Martinez",
                    "designation": "Principal Product Designer",
                    "bio": "Architecting intuitive digital experiences and scalable design systems for modern SaaS products. Believer in human-centered innovation.",
                    "image_url": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
                    "location": "San Francisco, USA",
                    "email": "sophia.m@example.com",
                    "phone": "+1 (415) 890-2341",
                    "website": "https://sophiadesigns.io",
                    "skills": ["UI/UX Design", "Figma", "Design Systems", "Prototyping", "User Research", "Frontend Dev"],
                    "experience": "8 Years leading creative design teams",
                    "education": "M.S. in Human-Computer Interaction",
                    "linkedin": "https://linkedin.com/in/sophiamartinez",
                    "github": "https://github.com/sophiamartinez",
                    "instagram": "https://instagram.com/sophia.ux",
                    "portfolio": "https://sophiadesigns.io"
                },
                {
                    "name": "Marcus Vance",
                    "designation": "AI Systems & Cloud Architect",
                    "bio": "Specializing in distributed systems, generative AI pipelines, and high-throughput data backends. Turning complex algorithms into production reality.",
                    "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
                    "location": "London, UK",
                    "email": "marcus.vance@example.com",
                    "phone": "+44 20 7946 0958",
                    "website": "https://marcusvance.tech",
                    "skills": ["Python", "PyTorch", "Kubernetes", "FastAPI", "PostgreSQL", "MLOps", "GCP"],
                    "experience": "7+ Years in Distributed AI & Cloud Architecture",
                    "education": "M.Eng in Artificial Intelligence",
                    "linkedin": "https://linkedin.com/in/marcusvance",
                    "github": "https://github.com/marcusvance",
                    "instagram": "https://instagram.com/marcusvance.ai",
                    "portfolio": "https://marcusvance.tech"
                }
            ]

            for item in sample_profiles:
                p = Profile(
                    name=item["name"],
                    designation=item["designation"],
                    bio=item["bio"],
                    image_url=item["image_url"],
                    location=item["location"],
                    email=item["email"],
                    phone=item.get("phone", ""),
                    website=item.get("website", ""),
                    experience=item.get("experience", ""),
                    education=item.get("education", ""),
                    linkedin=item.get("linkedin", ""),
                    github=item.get("github", ""),
                    instagram=item.get("instagram", ""),
                    portfolio=item.get("portfolio", "")
                )
                p.set_skills_list(item["skills"])
                db.session.add(p)

            db.session.commit()
            print("[ProfileCraft] Seeded initial sample profiles successfully.")
    except Exception as e:
        print(f"[ProfileCraft] Error seeding database: {e}")
        db.session.rollback()


app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print(f"🚀 ProfileCraft Backend running on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
