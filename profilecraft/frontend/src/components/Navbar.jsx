import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  UserPlus,
  Users,
  Home,
  Menu,
  X,
  CreditCard,
  Layers
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar({
  theme,
  onToggleTheme,
  profileCount = 0,
  activeSection = 'home',
  onNavigate
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className={`navbar-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Brand Logo & Name */}
        <a
          href="#home"
          className="navbar-brand"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
        >
          <div className="brand-icon-wrapper">
            <Layers className="brand-icon" size={22} />
            <Sparkles className="brand-sparkle" size={12} />
          </div>
          <div className="brand-text-wrapper">
            <span className="brand-name">Profile<span className="brand-accent">Craft</span></span>
            <span className="brand-tag">v1.0</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="navbar-nav desktop-nav">
          <button
            type="button"
            className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
          >
            <Home size={16} />
            <span>Home</span>
          </button>

          <button
            type="button"
            className={`nav-link ${activeSection === 'create' ? 'active' : ''}`}
            onClick={() => handleNavClick('create-profile')}
          >
            <UserPlus size={16} />
            <span>Create Profile</span>
          </button>

          <button
            type="button"
            className={`nav-link ${activeSection === 'preview' ? 'active' : ''}`}
            onClick={() => handleNavClick('preview-section')}
          >
            <CreditCard size={16} />
            <span>Live Card</span>
          </button>

          <button
            type="button"
            className={`nav-link ${activeSection === 'profiles' ? 'active' : ''}`}
            onClick={() => handleNavClick('my-profiles')}
          >
            <Users size={16} />
            <span>My Profiles</span>
            {profileCount > 0 && (
              <span className="nav-badge" title={`${profileCount} saved profiles`}>
                {profileCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Action Area */}
        <div className="navbar-actions">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />

          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <div className="mobile-nav-links">
            <button
              type="button"
              className={`mobile-nav-link ${activeSection === 'home' ? 'active' : ''}`}
              onClick={() => handleNavClick('home')}
            >
              <Home size={18} />
              <span>Home</span>
            </button>
            <button
              type="button"
              className={`mobile-nav-link ${activeSection === 'create' ? 'active' : ''}`}
              onClick={() => handleNavClick('create-profile')}
            >
              <UserPlus size={18} />
              <span>Create Profile</span>
            </button>
            <button
              type="button"
              className={`mobile-nav-link ${activeSection === 'preview' ? 'active' : ''}`}
              onClick={() => handleNavClick('preview-section')}
            >
              <CreditCard size={18} />
              <span>Live Card</span>
            </button>
            <button
              type="button"
              className={`mobile-nav-link ${activeSection === 'profiles' ? 'active' : ''}`}
              onClick={() => handleNavClick('my-profiles')}
            >
              <div className="flex-row items-center gap-2">
                <Users size={18} />
                <span>My Profiles</span>
              </div>
              {profileCount > 0 && <span className="nav-badge">{profileCount}</span>}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

