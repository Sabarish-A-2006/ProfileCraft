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

## ⚡ Installation & Execution Guide

### Prerequisites
- **Python 3.9+**
- **Node.js 18+ & npm**

### 1. Backend Setup (Flask + SQLite)
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
*The backend server runs on `http://127.0.0.1:5001`.*

---

### 2. Frontend Setup (React + Vite)
In a separate terminal window:
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
The Flask server is pre-configured to automatically serve the production React build:
```bash
# 1. Build the frontend
cd profilecraft/frontend
npm run build

# 2. Run the Flask server
cd ../backend
python app.py
```
Open **`http://127.0.0.1:5001`** in your browser to access the entire full-stack application served directly from Flask!

# ProfileCraft
