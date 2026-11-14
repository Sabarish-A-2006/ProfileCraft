# ProfileCraft — Full-Stack User Profile Card Generator

A modern, responsive, full-stack web application that allows users to create, customize, export, and manage professional profile cards. Demonstrates robust frontend-to-backend communication using **HTTP POST requests**, **JSON data transfer**, **Python Flask processing**, **SQLite database persistence via SQLAlchemy**, and **dynamic React rendering**.

---

## 🚀 Key Features

- **Form Submission & POST Request Workflow**: Genuinely transmits form data to the Flask backend via HTTP POST, validates inputs on the server, commits to an SQLite database, and dynamically transforms the JSON response into a profile card.
- **Three Selectable Card Styles**:
  1. **Minimal Professional**: Ultra-clean white background, refined typography, subtle shadows, executive finish.
  2. **Modern Gradient**: Multi-stop gradient header, dynamic accents, glassmorphic badges, high-energy tech styling.
  3. **Dark Premium**: Charcoal/obsidian surface, subtle neon/gold glow, luxury minimalist aesthetic.
- **Accent Color Customizer**: Switch live between Indigo, Violet, Emerald, Rose, Amber, and Cyan palettes.
- **Export & Sharing Suite**:
  - **Download as PNG**: High-resolution image capture powered by `html2canvas`.
  - **Print Card**: Clean print layout with tailored `@media print` stylesheets.
  - **Copy Summary**: Formatted clipboard copy with instant feedback.
  - **Web Share**: Native browser sharing dialog integration.
- **SQLite Database Persistence (CRUD)**:
  - Create new profiles via `POST /api/profiles`.
  - Retrieve all stored profiles via `GET /api/profiles`.
  - Search profiles in real time by name, title, skill, or location.
  - View individual profiles via `GET /api/profiles/:id`.
  - Edit existing profiles via `PUT /api/profiles/:id`.
  - Delete profiles via `DELETE /api/profiles/:id`.
- **Validation & Security**:
  - Full server-side and client-side input validation.
  - Strict email regex format checking.
  - Safe URL verification (`http://` and `https://` only).
  - Character limits and real-time character counters.
  - Image fallback avatars when images fail to load.
- **Modern UI / UX**:
  - Single Page Application (SPA) architecture with smooth scrolling navigation.
  - Interactive chip input for technical skills with quick-add suggestion pills.
  - Light and Dark mode toggle with persistent storage in `localStorage`.
  - Toast notifications system and celebratory confetti on card generation.
  - Mobile-first, fully responsive layout across desktop, tablet, and mobile devices.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, JavaScript ES6+, HTML5, CSS3, Vite, Lucide Icons, html2canvas, canvas-confetti |
| **Backend** | Python 3, Flask, Flask-CORS, RESTful API architecture |
| **Database** | SQLite (`profilecraft.db`), Flask-SQLAlchemy (ORM) |
| **Tooling** | Visual Studio Code, Git, cURL / Postman |

---

## 📁 Project Folder Structure

```
profilecraft/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Sticky header with links, badge, theme toggle, mobile drawer
│   │   │   ├── Hero.jsx            # Hero section with CTA buttons and showcase cards
│   │   │   ├── ProfileForm.jsx     # Interactive multi-section form with real-time validation
│   │   │   ├── ProfileCard.jsx     # 3-style profile card with social links & fallback avatar
│   │   │   ├── ProfilePreview.jsx  # Live generator stage, style switcher, PNG/print export
│   │   │   ├── ProfileList.jsx     # "My Profiles" directory with search, grid/list view, CRUD
│   │   │   ├── ThemeToggle.jsx     # Light/Dark mode switch
│   │   │   └── SocialIcons.jsx     # Clean SVG brand icons (LinkedIn, GitHub, Instagram)
│   │   │
│   │   ├── services/
│   │   │   └── api.js              # Fetch client wrapper for all backend REST endpoints
│   │   │
│   │   ├── App.jsx                 # Master application controller and state orchestrator
│   │   ├── App.css                 # Comprehensive CSS design system, themes, and animations
│   │   └── main.jsx                # React DOM entry point
│   │
│   ├── index.html                  # HTML5 template with Google Fonts (Inter, Outfit)
│   ├── vite.config.js              # Vite server configuration and /api proxy
│   └── package.json                # Frontend dependencies and scripts
│
├── backend/
│   ├── app.py                      # Flask application factory, CORS, static server & seed data
│   ├── database.py                 # SQLAlchemy database instance and table initialization
│   ├── models.py                   # Profile ORM model and serialization methods
│   ├── routes.py                   # RESTful API endpoints and server-side validation logic
│   ├── requirements.txt            # Python dependencies
│   └── profilecraft.db             # Persistent SQLite database file
│
├── .gitignore                      # Git ignore file for Python and Node
└── README.md                       # Complete documentation
```

---

## 💾 Database Schema (`profilecraft.db`)

The SQLite database contains the `profiles` table:

| Field | Data Type | Nullable | Description |
|---|---|---|---|
| `id` | Integer | No | Primary Key, Auto-incrementing |
| `name` | String(120) | No | Full Name |
| `designation` | String(150) | No | Professional Title / Role |
| `bio` | Text | No | Short Biography (max 500 chars) |
| `image_url` | String(500) | No | Profile photo web URL |
| `location` | String(120) | No | City, State / Country |
| `email` | String(150) | No | Email address |
| `phone` | String(50) | Yes | Optional contact phone |
| `website` | String(255) | Yes | Personal website / blog URL |
| `skills` | Text (JSON) | No | Serialized list of skills |
| `experience` | String(200) | Yes | Optional experience summary |
| `education` | String(200) | Yes | Optional education credential |
| `linkedin` | String(255) | Yes | LinkedIn profile URL |
| `github` | String(255) | Yes | GitHub profile URL |
| `instagram` | String(255) | Yes | Instagram profile URL |
| `portfolio` | String(255) | Yes | Portfolio website URL |
| `created_at` | DateTime | No | Creation timestamp (UTC) |
| `updated_at` | DateTime | No | Last update timestamp (UTC) |

---

## 🔌 RESTful API Endpoints

All API endpoints are prefixed with `/api`.

| Method | Endpoint | Description | Request Body | Response Status |
|---|---|---|---|---|
| `GET` | `/api/health` | Service health status | None | `200 OK` |
| `POST` | `/api/profiles` | Create a new profile | JSON profile payload | `201 Created` |
| `GET` | `/api/profiles` | Retrieve all profiles (supports `?search=`) | None | `200 OK` |
| `GET` | `/api/profiles/<id>` | Retrieve single profile by ID | None | `200 OK` / `404 Not Found` |
| `PUT` | `/api/profiles/<id>` | Update an existing profile | JSON fields to update | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/profiles/<id>` | Permanently delete a profile | None | `200 OK` / `404 Not Found` |

### Example POST Request Payload:
```json
{
  "name": "Alex Johnson",
  "designation": "Full-Stack Developer",
  "bio": "Passionate developer crafting modern web applications with React, Python, and cloud services.",
  "image_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  "location": "Chennai, India",
  "email": "alex.johnson@example.com",
  "phone": "+91 98765 43210",
  "website": "https://alexjohnson.dev",
  "skills": ["Python", "Flask", "React", "JavaScript", "SQL", "Docker"],
  "experience": "5+ Years building scalable web applications",
  "education": "B.Tech in Computer Science & Engineering",
  "linkedin": "https://linkedin.com/in/alexjohnson-dev",
  "github": "https://github.com/alexjohnson-dev",
  "instagram": "https://instagram.com/alexjohnson.dev",
  "portfolio": "https://alexjohnson.dev/portfolio"
}
```

### Example Backend JSON Response (`201 Created`):
```json
{
  "success": true,
  "message": "Profile generated successfully!",
  "profile": {
    "id": 1,
    "name": "Alex Johnson",
    "designation": "Full-Stack Developer",
    "bio": "Passionate developer crafting modern web applications with React, Python, and cloud services.",
    "image_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    "location": "Chennai, India",
    "email": "alex.johnson@example.com",
    "phone": "+91 98765 43210",
    "website": "https://alexjohnson.dev",
    "skills": ["Python", "Flask", "React", "JavaScript", "SQL", "Docker"],
    "experience": "5+ Years building scalable web applications",
    "education": "B.Tech in Computer Science & Engineering",
    "linkedin": "https://linkedin.com/in/alexjohnson-dev",
    "github": "https://github.com/alexjohnson-dev",
    "instagram": "https://instagram.com/alexjohnson.dev",
    "portfolio": "https://alexjohnson.dev/portfolio",
    "created_at": "2026-11-14T10:56:00.000000",
    "updated_at": "2026-11-14T10:56:00.000000"
  }
}
```

---

## ⚡ Installation & Execution Guide

### Prerequisites
- **Python 3.9+**
- **Node.js 18+ & npm**

### 1. Backend Setup (Flask + SQLite)
Open a terminal and navigate to the backend folder:
```bash
cd profilecraft/backend

# Create a virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS / Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install Python requirements
pip install -r requirements.txt

# Start the Flask backend server
python app.py
```
*The backend server will run on `http://127.0.0.1:5001`.*
*(Initial showcase sample profiles are automatically seeded into `profilecraft.db` on first start).*

---

### 2. Frontend Setup (React + Vite)
In a second terminal window, navigate to the frontend folder:
```bash
cd profilecraft/frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
*The React frontend will start on `http://localhost:5173`.*

Open your web browser and navigate to:
👉 **`http://localhost:5173`**

---

### 3. Unified Production Mode (Optional)
The Flask server is pre-configured to automatically serve the production React build if generated:
```bash
# 1. Build the frontend
cd profilecraft/frontend
npm run build

# 2. Run the Flask server
cd ../backend
python app.py
```
Open **`http://127.0.0.1:5001`** in your browser to access the entire full-stack application served seamlessly from Flask!

---

## 🧪 Testing with cURL / Postman

### 1. Test Healthcheck Endpoint
```bash
curl -X GET http://127.0.0.1:5001/api/health
```

### 2. Retrieve All Profiles
```bash
curl -X GET http://127.0.0.1:5001/api/profiles
```

### 3. Create a New Profile (HTTP POST)
```bash
curl -X POST http://127.0.0.1:5001/api/profiles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sarah Connor",
    "designation": "Cybersecurity Specialist",
    "bio": "Defending cloud networks and ensuring resilient digital infrastructure.",
    "image_url": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    "location": "Austin, TX, USA",
    "email": "sarah.connor@example.com",
    "skills": ["Network Security", "Python", "Penetration Testing", "Linux", "Docker"],
    "linkedin": "https://linkedin.com/in/sarahconnor",
    "github": "https://github.com/sarahconnor"
  }'
```

### 4. Update Profile (HTTP PUT)
```bash
curl -X PUT http://127.0.0.1:5001/api/profiles/1 \
  -H "Content-Type: application/json" \
  -d '{
    "designation": "Lead Full-Stack Architect"
  }'
```

### 5. Delete Profile (HTTP DELETE)
```bash
curl -X DELETE http://127.0.0.1:5001/api/profiles/1
```

---

## 🎨 UI/UX Design Philosophy

ProfileCraft combines the intuitive personal branding of **Linktree**, the visual elegance of **modern bento grid portfolios**, and the structured efficiency of **SaaS digital identity dashboards**:
- **Micro-Interactions**: Real-time bio character counter, interactive skill chip additions, image preview verification, and confetti bursts on successful creation.
- **Accessibility**: Clear labels, accessible ARIA tags, distinct focus rings, and high contrast ratios in both light and dark modes.
- **Card Customization**: Real-time template swapping (Minimal, Modern Gradient, Dark Premium) and 6 preset accent tones without page reload.

---

## 📄 License
This project is open-source and available under the MIT License.

