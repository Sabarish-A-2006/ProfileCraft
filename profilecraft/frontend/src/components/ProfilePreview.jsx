import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import {
  Download,
  Printer,
  Copy,
  Share2,
  Check,
  Palette,
  Sparkles,
  Layers,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-react';
import ProfileCard from './ProfileCard';

const ACCENT_COLORS = [
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Cyan', value: '#06b6d4' }
];

export default function ProfilePreview({
  profile,
  cardStyle,
  onStyleChange,
  accentColor,
  onAccentChange,
  onEdit,
  onDelete,
  onShowToast,
  isLiveDraft = false
}) {
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Download Profile Card as PNG
  const handleDownloadPNG = async () => {
    if (!cardRef.current) return;
    try {
      setDownloading(true);
      if (onShowToast) onShowToast('Generating high-resolution PNG...', 'info');

      // Create canvas from the profile card element
      const canvas = await html2canvas(cardRef.current, {
        scale: 2.5, // High resolution output
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false
      });

      const image = canvas.toDataURL('image/png');
      const filename = `${(profile?.name || 'profile').toLowerCase().replace(/\s+/g, '-')}-profile-card.png`;

      const link = document.createElement('a');
      link.href = image;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (onShowToast) onShowToast('Profile card downloaded as PNG!', 'success');
    } catch (err) {
      console.error('Download PNG failed:', err);
      if (onShowToast) onShowToast('Failed to export PNG. Please try again.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  // Print Profile Card
  const handlePrint = () => {
    window.print();
  };

  // Copy Profile Info
  const handleCopy = () => {
    if (!profile) return;
    const skillsText = (profile.skills || []).join(', ');
    const textToCopy = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${profile.name} - ${profile.designation}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Location: ${profile.location}
✉️ Email: ${profile.email}
${profile.phone ? `📞 Phone: ${profile.phone}\n` : ''}${profile.website ? `🌐 Website: ${profile.website}\n` : ''}
About:
${profile.bio}

Skills: ${skillsText}
${profile.linkedin ? `LinkedIn: ${profile.linkedin}\n` : ''}${profile.github ? `GitHub: ${profile.github}\n` : ''}
Generated with ProfileCraft.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    if (onShowToast) onShowToast('Profile details copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  // Share profile
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.name || 'ProfileCraft'} - Profile Card`,
          text: `Check out ${profile?.name}'s professional profile card!`,
          url: window.location.href,
        });
        if (onShowToast) onShowToast('Profile shared successfully!', 'success');
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  return (
    <section id="preview-section" className="preview-showcase-section">
      <div className="section-header-centered">
        <div className="inline-badge">
          <Sparkles size={14} />
          <span>Interactive Output & Customizer</span>
        </div>
        <h2 className="section-title-large">Dynamic Profile Card</h2>
        <p className="section-description">
          Customize your card style in real-time. Switch between 3 bespoke themes,
          select accent palettes, and export as a high-res PNG or print.
        </p>
      </div>

      {/* Control Panel: Template Style Switcher + Accent Colors */}
      <div className="preview-customizer-bar">
        {/* Style Selector Tabs */}
        <div className="style-tabs-group">
          <span className="control-group-label">Card Template:</span>
          <div className="style-tabs">
            <button
              type="button"
              className={`style-tab-btn ${cardStyle === 'minimal' ? 'active' : ''}`}
              onClick={() => onStyleChange('minimal')}
            >
              <span className="style-indicator minimal-dot"></span>
              <span>1. Minimal Professional</span>
            </button>
            <button
              type="button"
              className={`style-tab-btn ${cardStyle === 'gradient' ? 'active' : ''}`}
              onClick={() => onStyleChange('gradient')}
            >
              <span className="style-indicator gradient-dot"></span>
              <span>2. Modern Gradient</span>
            </button>
            <button
              type="button"
              className={`style-tab-btn ${cardStyle === 'dark' ? 'active' : ''}`}
              onClick={() => onStyleChange('dark')}
            >
              <span className="style-indicator dark-dot"></span>
              <span>3. Dark Premium</span>
            </button>
          </div>
        </div>

        {/* Accent Color Picker */}
        <div className="accent-color-group">
          <span className="control-group-label">
            <Palette size={14} /> Accent Color:
          </span>
          <div className="color-dots-row">
            {ACCENT_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                className={`color-dot-btn ${accentColor === c.value ? 'selected' : ''}`}
                style={{ backgroundColor: c.value }}
                onClick={() => onAccentChange(c.value)}
                title={c.name}
                aria-label={`Select ${c.name} accent`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Profile Card Output Container */}
      <div className="card-render-stage">
        <ProfileCard
          cardRef={cardRef}
          profile={profile}
          cardStyle={cardStyle}
          accentColor={accentColor}
          isLiveDraft={isLiveDraft}
          onCopyInfo={handleCopy}
        />
      </div>

      {/* Export & Sharing Action Toolbar */}
      <div className="preview-actions-bar">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleDownloadPNG}
          disabled={downloading || !profile}
          title="Download card as PNG image"
        >
          <Download size={16} />
          <span>{downloading ? 'Exporting...' : 'Download PNG'}</span>
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={handlePrint}
          disabled={!profile}
          title="Print profile card"
        >
          <Printer size={16} />
          <span>Print Card</span>
        </button>

        <button
          type="button"
          className="btn btn-outline"
          onClick={handleCopy}
          disabled={!profile}
          title="Copy profile text summary"
        >
          {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
          <span>{copied ? 'Copied!' : 'Copy Info'}</span>
        </button>

        <button
          type="button"
          className="btn btn-outline"
          onClick={handleShare}
          disabled={!profile}
          title="Share profile link or info"
        >
          <Share2 size={16} />
          <span>Share</span>
        </button>

        {profile?.id && (
          <>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => onEdit && onEdit(profile)}
              title="Edit this profile in form"
            >
              <Edit size={16} />
              <span>Edit</span>
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-danger-hover"
              onClick={() => onDelete && onDelete(profile.id)}
              title="Delete this profile from database"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </>
        )}
      </div>
    </section>
  );
}

