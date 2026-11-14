import React, { useState, useEffect } from 'react';
import {
  User,
  Briefcase,
  FileText,
  Image,
  MapPin,
  Mail,
  Phone,
  Globe,
  Award,
  GraduationCap,
  ExternalLink,
  Sparkles,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  X,
  Wand2
} from 'lucide-react';
import { LinkedinIcon, GithubIcon, InstagramIcon } from './SocialIcons';

const POPULAR_SKILLS = [
  'Python', 'React', 'JavaScript', 'Flask', 'TypeScript',
  'Node.js', 'SQL', 'Docker', 'UI/UX Design', 'TailwindCSS',
  'Git', 'AWS', 'Next.js', 'Figma', 'GraphQL'
];

const INITIAL_FORM_STATE = {
  name: '',
  designation: '',
  bio: '',
  image_url: '',
  location: '',
  email: '',
  phone: '',
  website: '',
  skills: [],
  experience: '',
  education: '',
  linkedin: '',
  github: '',
  instagram: '',
  portfolio: ''
};

const DEMO_PRESETS = [
  {
    name: 'Devon Hayes',
    designation: 'Senior Frontend Architect',
    bio: 'Passionate UI/UX engineer and web performance advocate. Crafting accessible, delightful user experiences with React, TypeScript, and modern styling architectures.',
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    location: 'Bengaluru, India',
    email: 'devon.hayes@example.com',
    phone: '+91 98450 12345',
    website: 'https://devonhayes.dev',
    skills: ['React', 'TypeScript', 'Next.js', 'TailwindCSS', 'GraphQL', 'Web Performance'],
    experience: '6+ Years designing frontend ecosystems at scale',
    education: 'B.Tech in Information Technology',
    linkedin: 'https://linkedin.com/in/devonhayes',
    github: 'https://github.com/devonhayes',
    instagram: 'https://instagram.com/devon.creates',
    portfolio: 'https://devonhayes.dev/showcase'
  },
  {
    name: 'Aria Sterling',
    designation: 'Full-Stack Python Engineer',
    bio: 'Backend enthusiast specializing in Flask, PostgreSQL, microservices, and distributed systems. Committed to writing maintainable, clean code that powers millions of users.',
    image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    location: 'Seattle, WA, USA',
    email: 'aria.sterling@example.com',
    phone: '+1 (206) 555-0199',
    website: 'https://ariasterling.tech',
    skills: ['Python', 'Flask', 'Docker', 'PostgreSQL', 'Kubernetes', 'Redis', 'React'],
    experience: '5 Years engineering distributed cloud backends',
    education: 'M.S. in Computer Science',
    linkedin: 'https://linkedin.com/in/ariasterling',
    github: 'https://github.com/ariasterling',
    instagram: 'https://instagram.com/aria.codes',
    portfolio: 'https://ariasterling.tech/projects'
  }
];

export default function ProfileForm({
  onSubmit,
  isSubmitting = false,
  editingProfile = null,
  onCancelEdit,
  onFormChange
}) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState(false);
  const [touched, setTouched] = useState({});

  const MAX_BIO_LENGTH = 300;

  // Sync if editing profile changes
  useEffect(() => {
    if (editingProfile) {
      setFormData({
        name: editingProfile.name || '',
        designation: editingProfile.designation || '',
        bio: editingProfile.bio || '',
        image_url: editingProfile.image_url || '',
        location: editingProfile.location || '',
        email: editingProfile.email || '',
        phone: editingProfile.phone || '',
        website: editingProfile.website || '',
        skills: Array.isArray(editingProfile.skills) ? editingProfile.skills : [],
        experience: editingProfile.experience || '',
        education: editingProfile.education || '',
        linkedin: editingProfile.linkedin || '',
        github: editingProfile.github || '',
        instagram: editingProfile.instagram || '',
        portfolio: editingProfile.portfolio || ''
      });
      setErrors({});
      setImageError(false);
    }
  }, [editingProfile]);

  // Notify parent of form changes for real-time live preview
  useEffect(() => {
    if (onFormChange) {
      onFormChange(formData);
    }
  }, [formData, onFormChange]);

  const validateField = (name, value) => {
    let error = '';
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    const urlRegex = /^https?:\/\/.+/i;

    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Full name is required.';
        else if (value.trim().length > 100) error = 'Name cannot exceed 100 characters.';
        break;
      case 'designation':
        if (!value.trim()) error = 'Professional title is required.';
        break;
      case 'bio':
        if (!value.trim()) error = 'Short biography is required.';
        else if (value.trim().length > MAX_BIO_LENGTH) error = `Bio cannot exceed ${MAX_BIO_LENGTH} characters.`;
        break;
      case 'image_url':
        if (!value.trim()) error = 'Profile image URL is required.';
        else if (!urlRegex.test(value.trim())) error = 'URL must start with http:// or https://';
        break;
      case 'location':
        if (!value.trim()) error = 'Location is required.';
        break;
      case 'email':
        if (!value.trim()) error = 'Email address is required.';
        else if (!emailRegex.test(value.trim())) error = 'Please enter a valid email format (e.g. user@domain.com).';
        break;
      case 'website':
      case 'linkedin':
      case 'github':
      case 'instagram':
      case 'portfolio':
        if (value.trim() && !urlRegex.test(value.trim())) {
          error = 'URL must start with http:// or https://';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'image_url') {
      setImageError(false);
    }

    if (touched[name]) {
      const errorMsg = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  // Skill management
  const addSkill = (skillToAdd) => {
    const clean = skillToAdd.trim();
    if (!clean) return;
    if (formData.skills.includes(clean)) return;
    if (formData.skills.length >= 15) {
      setErrors((prev) => ({ ...prev, skills: 'Maximum 15 skills allowed.' }));
      return;
    }

    const updated = [...formData.skills, clean];
    setFormData((prev) => ({ ...prev, skills: updated }));
    setErrors((prev) => ({ ...prev, skills: '' }));
    setSkillInput('');
  };

  const removeSkill = (indexToRemove) => {
    const updated = formData.skills.filter((_, i) => i !== indexToRemove);
    setFormData((prev) => ({ ...prev, skills: updated }));
    if (updated.length === 0) {
      setErrors((prev) => ({ ...prev, skills: 'At least one skill is required.' }));
    }
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  // Quick fill demo data
  const handleFillDemo = () => {
    const randomDemo = DEMO_PRESETS[Math.floor(Math.random() * DEMO_PRESETS.length)];
    setFormData({ ...randomDemo });
    setErrors({});
    setImageError(false);
  };

  // Reset form
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form fields?')) {
      setFormData(INITIAL_FORM_STATE);
      setErrors({});
      setImageError(false);
      setTouched({});
      if (onCancelEdit) onCancelEdit();
    }
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check all fields
    const newErrors = {};
    const required = ['name', 'designation', 'bio', 'image_url', 'location', 'email'];

    required.forEach((f) => {
      const err = validateField(f, formData[f] || '');
      if (err) newErrors[f] = err;
    });

    ['website', 'linkedin', 'github', 'instagram', 'portfolio'].forEach((f) => {
      if (formData[f]) {
        const err = validateField(f, formData[f]);
        if (err) newErrors[f] = err;
      }
    });

    if (!formData.skills || formData.skills.length === 0) {
      newErrors.skills = 'At least one skill is required.';
    }

    setErrors(newErrors);

    // If any error exists, focus first error field
    if (Object.keys(newErrors).length > 0) {
      const firstKey = Object.keys(newErrors)[0];
      const el = document.getElementById(`input-${firstKey}`);
      if (el) el.focus();
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div id="create-profile" className="profile-form-wrapper">
      <div className="form-card-container">
        {/* Form Header */}
        <div className="form-header-bar">
          <div className="form-title-group">
            <div className="form-badge-icon">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="form-title">
                {editingProfile ? 'Edit Profile Card' : 'Create Your Profile Card'}
              </h2>
              <p className="form-subtitle">
                Enter your professional details below. Data is sent via POST to the Python Flask backend and stored in SQLite.
              </p>
            </div>
          </div>

          <div className="form-header-actions">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleFillDemo}
              title="Populate form with sample professional data"
            >
              <Wand2 size={15} />
              <span>Fill Demo Data</span>
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={handleReset}
              title="Clear all fields"
            >
              <RotateCcw size={15} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Global Error Notice */}
        {Object.keys(errors).length > 0 && (
          <div className="alert-banner alert-error animate-fade-in">
            <AlertCircle size={18} className="alert-icon" />
            <div>
              <strong>Please correct the following errors:</strong>
              <ul className="alert-list">
                {Object.values(errors).map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="form-body">
          {/* SECTION 1: Personal Information */}
          <div className="form-section">
            <div className="section-title-wrapper">
              <User size={18} className="section-icon" />
              <h3 className="section-title">1. Personal Information</h3>
            </div>

            <div className="form-grid-2">
              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="input-name" className="form-label required">
                  Full Name
                </label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input
                    id="input-name"
                    name="name"
                    type="text"
                    className={`form-input ${errors.name ? 'input-error' : ''}`}
                    placeholder="e.g. Alex Johnson"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                </div>
                {errors.name && <span className="field-error-msg">{errors.name}</span>}
              </div>

              {/* Designation */}
              <div className="form-group">
                <label htmlFor="input-designation" className="form-label required">
                  Professional Title / Designation
                </label>
                <div className="input-with-icon">
                  <Briefcase size={18} className="input-icon" />
                  <input
                    id="input-designation"
                    name="designation"
                    type="text"
                    className={`form-input ${errors.designation ? 'input-error' : ''}`}
                    placeholder="e.g. Lead Full-Stack Developer"
                    value={formData.designation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                </div>
                {errors.designation && <span className="field-error-msg">{errors.designation}</span>}
              </div>
            </div>

            {/* Profile Image URL & Live Preview */}
            <div className="form-grid-2">
              <div className="form-group">
                <label htmlFor="input-image_url" className="form-label required">
                  Profile Image URL
                </label>
                <div className="input-with-icon">
                  <Image size={18} className="input-icon" />
                  <input
                    id="input-image_url"
                    name="image_url"
                    type="url"
                    className={`form-input ${errors.image_url ? 'input-error' : ''}`}
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image_url}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                </div>
                {errors.image_url && <span className="field-error-msg">{errors.image_url}</span>}
                <span className="field-hint">Use a square portrait or avatar link (HTTPS).</span>
              </div>

              {/* Mini Image Preview thumbnail */}
              <div className="form-group">
                <label className="form-label">Image Preview</label>
                <div className="image-preview-box">
                  {formData.image_url && !imageError ? (
                    <img
                      src={formData.image_url}
                      alt="Avatar Preview"
                      className="preview-thumbnail"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="preview-fallback-avatar">
                      {formData.name ? (
                        <span>{formData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</span>
                      ) : (
                        <User size={24} />
                      )}
                    </div>
                  )}
                  <div className="preview-status-text">
                    {formData.image_url ? (
                      imageError ? (
                        <span className="text-warning">Image failed to load. Fallback avatar will be shown.</span>
                      ) : (
                        <span className="text-success flex-row items-center gap-1">
                          <CheckCircle size={14} /> Image loaded successfully
                        </span>
                      )
                    ) : (
                      <span className="text-muted">Enter image URL to view preview</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="form-group">
              <label htmlFor="input-location" className="form-label required">
                Location
              </label>
              <div className="input-with-icon">
                <MapPin size={18} className="input-icon" />
                <input
                  id="input-location"
                  name="location"
                  type="text"
                  className={`form-input ${errors.location ? 'input-error' : ''}`}
                  placeholder="e.g. San Francisco, CA / Chennai, India"
                  value={formData.location}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
              </div>
              {errors.location && <span className="field-error-msg">{errors.location}</span>}
            </div>

            {/* Short Biography */}
            <div className="form-group">
              <div className="label-with-counter">
                <label htmlFor="input-bio" className="form-label required">
                  Short Biography
                </label>
                <span className={`char-counter ${formData.bio.length > MAX_BIO_LENGTH ? 'counter-danger' : ''}`}>
                  {formData.bio.length} / {MAX_BIO_LENGTH}
                </span>
              </div>
              <div className="input-with-icon textarea-icon-wrapper">
                <FileText size={18} className="input-icon textarea-icon" />
                <textarea
                  id="input-bio"
                  name="bio"
                  rows={3}
                  className={`form-input form-textarea ${errors.bio ? 'input-error' : ''}`}
                  placeholder="Share a concise, engaging summary about yourself, your passion, and what drives your craft..."
                  value={formData.bio}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={MAX_BIO_LENGTH}
                  required
                />
              </div>
              {errors.bio && <span className="field-error-msg">{errors.bio}</span>}
            </div>
          </div>

          {/* SECTION 2: Contact Information */}
          <div className="form-section">
            <div className="section-title-wrapper">
              <Mail size={18} className="section-icon" />
              <h3 className="section-title">2. Contact Information</h3>
            </div>

            <div className="form-grid-3">
              {/* Email Address */}
              <div className="form-group">
                <label htmlFor="input-email" className="form-label required">
                  Email Address
                </label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input
                    id="input-email"
                    name="email"
                    type="email"
                    className={`form-input ${errors.email ? 'input-error' : ''}`}
                    placeholder="alex@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                </div>
                {errors.email && <span className="field-error-msg">{errors.email}</span>}
              </div>

              {/* Phone Number (Optional) */}
              <div className="form-group">
                <label htmlFor="input-phone" className="form-label">
                  Phone Number <span className="optional-tag">(Optional)</span>
                </label>
                <div className="input-with-icon">
                  <Phone size={18} className="input-icon" />
                  <input
                    id="input-phone"
                    name="phone"
                    type="tel"
                    className="form-input"
                    placeholder="+1 (555) 012-3456"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Personal Website (Optional) */}
              <div className="form-group">
                <label htmlFor="input-website" className="form-label">
                  Personal Website <span className="optional-tag">(Optional)</span>
                </label>
                <div className="input-with-icon">
                  <Globe size={18} className="input-icon" />
                  <input
                    id="input-website"
                    name="website"
                    type="url"
                    className={`form-input ${errors.website ? 'input-error' : ''}`}
                    placeholder="https://mywebsite.com"
                    value={formData.website}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                {errors.website && <span className="field-error-msg">{errors.website}</span>}
              </div>
            </div>
          </div>

          {/* SECTION 3: Professional Information */}
          <div className="form-section">
            <div className="section-title-wrapper">
              <Award size={18} className="section-icon" />
              <h3 className="section-title">3. Professional Skills & Background</h3>
            </div>

            {/* Interactive Skills Chip Input */}
            <div className="form-group">
              <label htmlFor="input-skills" className="form-label required">
                Skills & Technologies (Type and hit Enter or Comma)
              </label>

              <div className={`skills-input-box ${errors.skills ? 'input-error' : ''}`}>
                <div className="skills-chips-list">
                  {formData.skills.map((skill, index) => (
                    <span key={index} className="skill-chip">
                      <span>{skill}</span>
                      <button
                        type="button"
                        className="chip-remove-btn"
                        onClick={() => removeSkill(index)}
                        aria-label={`Remove ${skill}`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}

                  <input
                    id="input-skills"
                    type="text"
                    className="skill-text-inline-input"
                    placeholder={formData.skills.length === 0 ? "e.g. React, Python, Flask..." : "Add skill..."}
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    onBlur={() => {
                      if (skillInput.trim()) addSkill(skillInput);
                    }}
                  />
                </div>

                {skillInput.trim() && (
                  <button
                    type="button"
                    className="btn btn-sm btn-primary add-skill-btn"
                    onClick={() => addSkill(skillInput)}
                  >
                    <Plus size={14} /> Add
                  </button>
                )}
              </div>
              {errors.skills && <span className="field-error-msg">{errors.skills}</span>}

              {/* Quick suggestion pills */}
              <div className="skill-suggestions">
                <span className="suggestion-label">Suggestions:</span>
                <div className="suggestion-pills">
                  {POPULAR_SKILLS.filter(s => !formData.skills.includes(s)).slice(0, 8).map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      className="suggestion-pill"
                      onClick={() => addSkill(skill)}
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-grid-2">
              {/* Experience */}
              <div className="form-group">
                <label htmlFor="input-experience" className="form-label">
                  Experience Highlights <span className="optional-tag">(Optional)</span>
                </label>
                <div className="input-with-icon">
                  <Briefcase size={18} className="input-icon" />
                  <input
                    id="input-experience"
                    name="experience"
                    type="text"
                    className="form-input"
                    placeholder="e.g. 5+ Years in Full Stack Development"
                    value={formData.experience}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Education */}
              <div className="form-group">
                <label htmlFor="input-education" className="form-label">
                  Education Background <span className="optional-tag">(Optional)</span>
                </label>
                <div className="input-with-icon">
                  <GraduationCap size={18} className="input-icon" />
                  <input
                    id="input-education"
                    name="education"
                    type="text"
                    className="form-input"
                    placeholder="e.g. B.S. in Computer Science"
                    value={formData.education}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: Social Media Links */}
          <div className="form-section">
            <div className="section-title-wrapper">
              <Globe size={18} className="section-icon" />
              <h3 className="section-title">4. Social Media & Portfolio Links</h3>
            </div>

            <div className="form-grid-2">
              {/* LinkedIn URL */}
              <div className="form-group">
                <label htmlFor="input-linkedin" className="form-label">
                  LinkedIn URL
                </label>
                <div className="input-with-icon">
                  <LinkedinIcon size={18} className="input-icon" />
                  <input
                    id="input-linkedin"
                    name="linkedin"
                    type="url"
                    className={`form-input ${errors.linkedin ? 'input-error' : ''}`}
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedin}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                {errors.linkedin && <span className="field-error-msg">{errors.linkedin}</span>}
              </div>

              {/* GitHub URL */}
              <div className="form-group">
                <label htmlFor="input-github" className="form-label">
                  GitHub URL
                </label>
                <div className="input-with-icon">
                  <GithubIcon size={18} className="input-icon" />
                  <input
                    id="input-github"
                    name="github"
                    type="url"
                    className={`form-input ${errors.github ? 'input-error' : ''}`}
                    placeholder="https://github.com/username"
                    value={formData.github}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                {errors.github && <span className="field-error-msg">{errors.github}</span>}
              </div>

              {/* Instagram URL */}
              <div className="form-group">
                <label htmlFor="input-instagram" className="form-label">
                  Instagram URL <span className="optional-tag">(Optional)</span>
                </label>
                <div className="input-with-icon">
                  <InstagramIcon size={18} className="input-icon" />
                  <input
                    id="input-instagram"
                    name="instagram"
                    type="url"
                    className={`form-input ${errors.instagram ? 'input-error' : ''}`}
                    placeholder="https://instagram.com/username"
                    value={formData.instagram}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                {errors.instagram && <span className="field-error-msg">{errors.instagram}</span>}
              </div>

              {/* Portfolio URL */}
              <div className="form-group">
                <label htmlFor="input-portfolio" className="form-label">
                  Portfolio URL <span className="optional-tag">(Optional)</span>
                </label>
                <div className="input-with-icon">
                  <ExternalLink size={18} className="input-icon" />
                  <input
                    id="input-portfolio"
                    name="portfolio"
                    type="url"
                    className={`form-input ${errors.portfolio ? 'input-error' : ''}`}
                    placeholder="https://myportfolio.design"
                    value={formData.portfolio}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                {errors.portfolio && <span className="field-error-msg">{errors.portfolio}</span>}
              </div>
            </div>
          </div>

          {/* Form Actions & Submission Bar */}
          <div className="form-footer-actions">
            {editingProfile && (
              <button
                type="button"
                className="btn btn-secondary btn-lg"
                onClick={onCancelEdit}
                disabled={isSubmitting}
              >
                Cancel Edit
              </button>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg pulse-glow submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="spinner-icon animate-spin" />
                  <span>Processing & Saving to Backend...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>{editingProfile ? 'Update Profile Card' : 'Generate Profile Card'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
