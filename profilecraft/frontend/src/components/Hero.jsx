import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Eye,
  ShieldCheck,
  Zap,
  Palette,
  Database,
  Code2
} from 'lucide-react';

export default function Hero({ onStartCreate, onPreviewProfiles, profileCount = 0 }) {
  return (
    <section id="home" className="hero-section">
      <div className="hero-glow-blob blob-1"></div>
      <div className="hero-glow-blob blob-2"></div>

      <div className="hero-container">
        {/* Top Feature Pill */}
        <div className="hero-badge animate-fade-in">
          <Sparkles size={14} className="hero-badge-icon" />
          <span>Full-Stack Web Application • Python Flask + React + SQLite</span>
        </div>

        {/* Main Heading */}
        <h1 className="hero-title animate-slide-up">
          Your Identity. <span className="gradient-text">Your Style.</span> Your Profile.
        </h1>

        {/* Supporting Description */}
        <p className="hero-description animate-slide-up delay-1">
          Create beautiful, personalized profile cards in seconds. Add your details,
          customize your appearance, and generate a profile that represents you.
          Powered by real-time HTTP POST requests, server-side validation, and SQLite persistence.
        </p>

        {/* Action Buttons */}
        <div className="hero-actions animate-slide-up delay-2">
          <button
            type="button"
            className="btn btn-primary btn-lg pulse-glow"
            onClick={onStartCreate}
          >
            <span>Create Your Profile</span>
            <ArrowRight size={18} />
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-lg"
            onClick={onPreviewProfiles}
          >
            <Eye size={18} />
            <span>Preview Profiles {profileCount > 0 && `(${profileCount})`}</span>
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="hero-features-grid animate-slide-up delay-3">
          <div className="feature-pill">
            <Zap size={16} className="feature-icon text-amber" />
            <span>Instant POST Generation</span>
          </div>
          <div className="feature-pill">
            <Palette size={16} className="feature-icon text-indigo" />
            <span>3 Premium Card Styles</span>
          </div>
          <div className="feature-pill">
            <Database size={16} className="feature-icon text-emerald" />
            <span>SQLite Database Storage</span>
          </div>
          <div className="feature-pill">
            <Code2 size={16} className="feature-icon text-cyan" />
            <span>PNG & Print Export</span>
          </div>
        </div>

        {/* Visual Showcase Teaser Cards */}
        <div className="hero-card-showcase animate-slide-up delay-4">
          <div className="showcase-card showcase-card-1">
            <div className="showcase-avatar">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Alex"
              />
            </div>
            <div className="showcase-info">
              <h4>Alex Johnson</h4>
              <p>Full-Stack Developer</p>
              <div className="showcase-tags">
                <span>Python</span>
                <span>React</span>
                <span>SQL</span>
              </div>
            </div>
            <span className="showcase-style-label">Minimal Style</span>
          </div>

          <div className="showcase-card showcase-card-2 featured-card">
            <div className="showcase-avatar border-gradient">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80"
                alt="Sophia"
              />
            </div>
            <div className="showcase-info">
              <h4>Sophia Martinez</h4>
              <p>Product Designer</p>
              <div className="showcase-tags">
                <span>UI/UX</span>
                <span>Figma</span>
                <span>Design Systems</span>
              </div>
            </div>
            <span className="showcase-style-label gradient-badge">Modern Gradient</span>
          </div>

          <div className="showcase-card showcase-card-3">
            <div className="showcase-avatar dark-ring">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                alt="Marcus"
              />
            </div>
            <div className="showcase-info">
              <h4>Marcus Vance</h4>
              <p>Cloud & AI Architect</p>
              <div className="showcase-tags">
                <span>PyTorch</span>
                <span>GCP</span>
                <span>Docker</span>
              </div>
            </div>
            <span className="showcase-style-label dark-badge">Dark Premium</span>
          </div>
        </div>
      </div>
    </section>
  );
}

