import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  Sparkles,
  Server,
  Layers,
  Heart
} from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProfileForm from './components/ProfileForm';
import ProfilePreview from './components/ProfilePreview';
import ProfileList from './components/ProfileList';
import { api } from './services/api';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('profilecraft-theme') || 'light';
  });

  // Profiles list from SQLite backend
  const [profiles, setProfiles] = useState([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);

  // Active / generated profile displayed in the card preview
  const [currentProfile, setCurrentProfile] = useState(null);

  // Form draft for live preview while typing
  const [formDraft, setFormDraft] = useState(null);

  // Profile currently being edited (null when creating new)
  const [editingProfile, setEditingProfile] = useState(null);

  // Card customization styles
  const [cardStyle, setCardStyle] = useState('gradient'); // 'minimal' | 'gradient' | 'dark'
  const [accentColor, setAccentColor] = useState('#6366f1');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  // Active navigation section
  const [activeSection, setActiveSection] = useState('home');

  // Backend status check
  const [backendOnline, setBackendOnline] = useState(true);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('profilecraft-theme', theme);
  }, [theme]);

  // Load profiles from backend on initial mount
  useEffect(() => {
    fetchProfiles();
  }, []);

  const showToast = (message, type = 'success') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const fetchProfiles = async () => {
    try {
      setIsLoadingProfiles(true);
      const res = await api.getProfiles();
      if (res && res.profiles) {
        setProfiles(res.profiles);
        setBackendOnline(true);

        // Select the first profile if no current profile
        if (!currentProfile && res.profiles.length > 0) {
          setCurrentProfile(res.profiles[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load profiles from backend:', err);
      setBackendOnline(false);
      showToast('Backend server connection issue. Please ensure Flask is running.', 'error');
    } finally {
      setIsLoadingProfiles(false);
    }
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Trigger celebration confetti
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#8b5cf6', '#3b82f6', '#10b981', '#f43f5e']
      });
    } catch (e) {
      // Confetti fallback
    }
  };

  // Form Submit: Handles POST /api/profiles or PUT /api/profiles/:id
  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);

      if (editingProfile) {
        // PUT request to update profile
        const response = await api.updateProfile(editingProfile.id, formData);
        if (response && response.profile) {
          const updated = response.profile;
          setCurrentProfile(updated);
          setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
          setEditingProfile(null);
          triggerCelebration();
          showToast(response.message || 'Profile updated successfully in SQLite database!', 'success');
          scrollTo('preview-section');
        }
      } else {
        // Genuine HTTP POST request to Flask backend
        const response = await api.createProfile(formData);
        if (response && response.profile) {
          const created = response.profile;
          setCurrentProfile(created);
          setProfiles((prev) => [created, ...prev]);
          triggerCelebration();
          showToast(response.message || 'Profile card generated & saved successfully!', 'success');
          scrollTo('preview-section');
        }
      }
    } catch (err) {
      console.error('Error submitting profile:', err);
      let errorMsg = err.message || 'Failed to submit profile to backend.';
      if (err.errors) {
        const errorDetails = Object.values(err.errors).join(' ');
        errorMsg = `${errorMsg} (${errorDetails})`;
      }
      showToast(errorMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit profile click
  const handleEditProfile = (profileToEdit) => {
    setEditingProfile(profileToEdit);
    scrollTo('create-profile');
    showToast(`Loaded ${profileToEdit.name}'s profile into editor.`, 'info');
  };

  // Handle Cancel edit
  const handleCancelEdit = () => {
    setEditingProfile(null);
  };

  // Handle Delete profile click
  const handleDeleteProfile = async (idToDelete) => {
    const profileObj = profiles.find((p) => p.id === idToDelete);
    const confirmMsg = profileObj
      ? `Are you sure you want to delete ${profileObj.name}'s profile? This will permanently remove it from the SQLite database.`
      : 'Are you sure you want to delete this profile?';

    if (window.confirm(confirmMsg)) {
      try {
        const response = await api.deleteProfile(idToDelete);
        const remaining = profiles.filter((p) => p.id !== idToDelete);
        setProfiles(remaining);

        if (currentProfile && currentProfile.id === idToDelete) {
          setCurrentProfile(remaining.length > 0 ? remaining[0] : null);
        }

        if (editingProfile && editingProfile.id === idToDelete) {
          setEditingProfile(null);
        }

        showToast(response.message || 'Profile removed from database.', 'success');
      } catch (err) {
        console.error('Failed to delete profile:', err);
        showToast(err.message || 'Error deleting profile.', 'error');
      }
    }
  };

  // Select profile for viewing in showcase
  const handleSelectProfile = (p) => {
    setCurrentProfile(p);
    scrollTo('preview-section');
  };

  // Determine what to display on the preview card
  // If editing or typing new without saved card, use draft; otherwise use currentProfile
  const displayedProfile = currentProfile || (formDraft?.name ? formDraft : profiles[0]);
  const isDraftMode = !currentProfile && Boolean(formDraft?.name);

  return (
    <div className="app-layout">
      {/* Toast Notification Container */}
      {toast && (
        <div className={`toast-banner toast-${toast.type} animate-slide-down`}>
          <div className="toast-content">
            {toast.type === 'success' && <CheckCircle2 size={18} className="toast-icon text-success" />}
            {toast.type === 'error' && <AlertCircle size={18} className="toast-icon text-danger" />}
            {toast.type === 'info' && <Info size={18} className="toast-icon text-info" />}
            <span className="toast-text">{toast.message}</span>
          </div>
          <button
            type="button"
            className="toast-close-btn"
            onClick={() => setToast(null)}
            aria-label="Dismiss notification"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        theme={theme}
        onToggleTheme={handleToggleTheme}
        profileCount={profiles.length}
        activeSection={activeSection}
        onNavigate={scrollTo}
      />

      <main className="main-content">
        {/* Hero Section */}
        <Hero
          onStartCreate={() => scrollTo('create-profile')}
          onPreviewProfiles={() => scrollTo('my-profiles')}
          profileCount={profiles.length}
        />

        {/* Profile Creation Form Section */}
        <section className="form-outer-section">
          <div className="container">
            <ProfileForm
              onSubmit={handleFormSubmit}
              isSubmitting={isSubmitting}
              editingProfile={editingProfile}
              onCancelEdit={handleCancelEdit}
              onFormChange={setFormDraft}
            />
          </div>
        </section>

        {/* Dynamic Profile Card Generator Output & Customizer */}
        <section className="preview-outer-section">
          <div className="container">
            <ProfilePreview
              profile={displayedProfile}
              cardStyle={cardStyle}
              onStyleChange={setCardStyle}
              accentColor={accentColor}
              onAccentChange={setAccentColor}
              onEdit={handleEditProfile}
              onDelete={handleDeleteProfile}
              onShowToast={showToast}
              isLiveDraft={isDraftMode}
            />
          </div>
        </section>

        {/* My Profiles Directory Section */}
        <section className="directory-outer-section">
          <div className="container">
            <ProfileList
              profiles={profiles}
              isLoading={isLoadingProfiles}
              onSelectProfile={handleSelectProfile}
              onEditProfile={handleEditProfile}
              onDeleteProfile={handleDeleteProfile}
              onCreateNew={() => {
                setEditingProfile(null);
                scrollTo('create-profile');
              }}
              activeProfileId={currentProfile?.id}
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-container">
          <div className="footer-brand-col">
            <div className="footer-logo">
              <Layers size={20} className="text-primary" />
              <span className="footer-name">Profile<span className="brand-accent">Craft</span></span>
            </div>
            <p className="footer-desc">
              A modern, full-stack User Profile Card Generator demonstrating React frontend architecture,
              Python Flask RESTful API processing, and persistent SQLite database storage.
            </p>
          </div>

          <div className="footer-links-col">
            <h5 className="footer-heading">Architecture</h5>
            <ul className="footer-list">
              <li><span className="tech-badge">Python 3 + Flask</span></li>
              <li><span className="tech-badge">SQLite + SQLAlchemy</span></li>
              <li><span className="tech-badge">React 19 + Vite</span></li>
              <li><span className="tech-badge">RESTful JSON API</span></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h5 className="footer-heading">Features</h5>
            <ul className="footer-list">
              <li>3 Card Templates</li>
              <li>PNG & Print Export</li>
              <li>Live Image Validation</li>
              <li>Full CRUD Operations</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p>© 2026 ProfileCraft. Built with precision for modern developers.</p>
          <div className="footer-status-pill">
            <span className={`status-dot ${backendOnline ? 'online' : 'offline'}`}></span>
            <span>Flask Backend: {backendOnline ? 'Online (5001)' : 'Connecting...'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

