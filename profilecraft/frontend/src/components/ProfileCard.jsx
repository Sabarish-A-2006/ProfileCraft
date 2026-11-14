import React, { useState } from 'react';
import {
  MapPin,
  Mail,
  Phone,
  Globe,
  Briefcase,
  GraduationCap,
  ExternalLink,
  User,
  Check,
  Share2,
  Download,
  Printer,
  Copy,
  Edit3,
  Trash2,
  Sparkles
} from 'lucide-react';
import { LinkedinIcon, GithubIcon, InstagramIcon } from './SocialIcons';

export default function ProfileCard({
  profile,
  cardStyle = 'minimal', // 'minimal' | 'gradient' | 'dark'
  accentColor = '#6366f1',
  onEdit,
  onDelete,
  onCopyInfo,
  onShare,
  cardRef,
  isLiveDraft = false
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!profile) return null;

  const {
    name = 'Your Full Name',
    designation = 'Professional Title',
    bio = 'Your personal biography and professional introduction will appear right here.',
    image_url = '',
    location = 'Location',
    email = 'email@example.com',
    phone = '',
    website = '',
    skills = [],
    experience = '',
    education = '',
    linkedin = '',
    github = '',
    instagram = '',
    portfolio = '',
    id
  } = profile;

  // Initials for avatar fallback
  const initials = name
    ? name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'PC';

  const handleCopy = () => {
    if (onCopyInfo) {
      onCopyInfo(profile);
    } else {
      const summary = `${name} | ${designation}\n📍 ${location}\n✉️ ${email}\n\n${bio}\n\nSkills: ${skills.join(', ')}`;
      navigator.clipboard.writeText(summary);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      ref={cardRef}
      id={`profile-card-${id || 'preview'}`}
      className={`profile-card style-${cardStyle} ${isLiveDraft ? 'is-draft' : ''}`}
      style={{ '--accent-color': accentColor }}
    >
      {/* Decorative Card Header Bar / Gradient Banner */}
      <div className="card-top-banner">
        <div className="banner-pattern"></div>
        {isLiveDraft && (
          <span className="card-status-badge">
            <Sparkles size={12} /> Live Preview
          </span>
        )}
        {id && !isLiveDraft && (
          <span className="card-id-badge">ID #{id}</span>
        )}
      </div>

      <div className="card-content-wrapper">
        {/* Profile Image & Avatar */}
        <div className="card-avatar-wrapper">
          <div className="avatar-frame">
            {image_url && !imageFailed ? (
              <img
                src={image_url}
                alt={name}
                className="avatar-img"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="avatar-fallback">
                {initials ? <span>{initials}</span> : <User size={36} />}
              </div>
            )}
          </div>
          <span className="online-indicator" title="Active Profile"></span>
        </div>

        {/* Name & Title */}
        <div className="card-header-info">
          <h3 className="card-name">{name || 'Your Full Name'}</h3>
          <div className="card-designation-badge">
            <span>{designation || 'Professional Title'}</span>
          </div>
          <div className="card-location">
            <MapPin size={14} className="location-icon" />
            <span>{location || 'Location'}</span>
          </div>
        </div>

        {/* Biography */}
        <div className="card-bio-section">
          <p className="card-bio-text">{bio}</p>
        </div>

        {/* Skills Tags */}
        {skills && skills.length > 0 && (
          <div className="card-skills-section">
            <h5 className="section-mini-heading">Core Competencies & Skills</h5>
            <div className="card-skills-tags">
              {skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Background / Experience / Education */}
        {(experience || education) && (
          <div className="card-meta-details">
            {experience && (
              <div className="meta-item">
                <Briefcase size={14} className="meta-icon" />
                <span>{experience}</span>
              </div>
            )}
            {education && (
              <div className="meta-item">
                <GraduationCap size={14} className="meta-icon" />
                <span>{education}</span>
              </div>
            )}
          </div>
        )}

        {/* Contact Links Bar */}
        <div className="card-contact-section">
          {email && (
            <a
              href={`mailto:${email}`}
              className="contact-pill"
              title={`Send email to ${email}`}
            >
              <Mail size={14} />
              <span>{email}</span>
            </a>
          )}
          {phone && (
            <a
              href={`tel:${phone}`}
              className="contact-pill"
              title={`Call ${phone}`}
            >
              <Phone size={14} />
              <span>{phone}</span>
            </a>
          )}
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-pill website-pill"
              title={`Visit ${website}`}
            >
              <Globe size={14} />
              <span>{website.replace(/^https?:\/\//i, '')}</span>
              <ExternalLink size={12} className="link-arrow" />
            </a>
          )}
        </div>

        {/* Social Media Links Bar */}
        {(linkedin || github || instagram || portfolio) && (
          <div className="card-social-section">
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn linkedin-btn"
                aria-label="LinkedIn Profile"
                title="LinkedIn Profile"
              >
                <LinkedinIcon size={18} />
              </a>
            )}
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn github-btn"
                aria-label="GitHub Profile"
                title="GitHub Profile"
              >
                <GithubIcon size={18} />
              </a>
            )}
            {instagram && (
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn instagram-btn"
                aria-label="Instagram Profile"
                title="Instagram Profile"
              >
                <InstagramIcon size={18} />
              </a>
            )}
            {portfolio && (
              <a
                href={portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn portfolio-btn"
                aria-label="Portfolio Showcase"
                title="Portfolio Showcase"
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>
        )}

        {/* Footer Brand Tag */}
        <div className="card-footer-branding">
          <span className="craft-watermark">Crafted with ProfileCraft</span>
        </div>
      </div>
    </div>
  );
}
