import React, { useState } from 'react';
import {
  Users,
  Search,
  Grid,
  List,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Mail,
  User,
  Plus,
  ArrowRight,
  ExternalLink,
  Briefcase
} from 'lucide-react';

export default function ProfileList({
  profiles = [],
  isLoading = false,
  onSelectProfile,
  onEditProfile,
  onDeleteProfile,
  onCreateNew,
  activeProfileId = null
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Filter profiles based on search term
  const filteredProfiles = profiles.filter((p) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const nameMatch = (p.name || '').toLowerCase().includes(term);
    const desigMatch = (p.designation || '').toLowerCase().includes(term);
    const locMatch = (p.location || '').toLowerCase().includes(term);
    const skillsMatch = (p.skills || []).some((s) => s.toLowerCase().includes(term));
    return nameMatch || desigMatch || locMatch || skillsMatch;
  });

  return (
    <section id="my-profiles" className="profiles-directory-section">
      <div className="directory-header-row">
        <div>
          <div className="inline-badge">
            <Users size={14} />
            <span>SQLite Database Records</span>
          </div>
          <h2 className="section-title-large">My Profiles</h2>
          <p className="section-description">
            Explore, manage, and inspect all profile cards saved in the backend database.
          </p>
        </div>

        {/* Total Count Badge */}
        <div className="count-pill">
          <span className="count-number">{profiles.length}</span>
          <span className="count-label">Saved {profiles.length === 1 ? 'Profile' : 'Profiles'}</span>
        </div>
      </div>

      {/* Directory Controls: Search Bar + View Mode Toggle + Create Button */}
      <div className="directory-controls-bar">
        {/* Search Bar */}
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search profiles by name, title, skill, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchTerm('')}
            >
              Clear
            </button>
          )}
        </div>

        {/* Layout Toggle (Grid / List) */}
        <div className="layout-toggle-group">
          <button
            type="button"
            className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
            aria-label="Grid View"
          >
            <Grid size={18} />
          </button>
          <button
            type="button"
            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List View"
            aria-label="List View"
          >
            <List size={18} />
          </button>
        </div>

        {/* Create Profile Quick CTA */}
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={onCreateNew}
        >
          <Plus size={16} />
          <span>New Profile</span>
        </button>
      </div>

      {/* Loading Skeleton / State */}
      {isLoading && (
        <div className="loading-grid">
          {[1, 2, 3].map((n) => (
            <div key={n} className="skeleton-card animate-pulse">
              <div className="skeleton-avatar"></div>
              <div className="skeleton-line line-title"></div>
              <div className="skeleton-line line-sub"></div>
              <div className="skeleton-line line-text"></div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredProfiles.length === 0 && (
        <div className="empty-state-box animate-fade-in">
          <div className="empty-state-icon">
            <Users size={48} />
          </div>
          <h3 className="empty-state-title">
            {searchTerm ? 'No matching profiles found' : 'No profiles generated yet'}
          </h3>
          <p className="empty-state-desc">
            {searchTerm
              ? `We couldn't find any profiles matching "${searchTerm}". Try a different name or technology keyword.`
              : 'Start your journey by filling out the profile generator form above to create and store your first professional card.'}
          </p>
          {searchTerm ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setSearchTerm('')}
            >
              Clear Search Query
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary pulse-glow"
              onClick={onCreateNew}
            >
              <Plus size={16} />
              <span>Create Your First Profile</span>
            </button>
          )}
        </div>
      )}

      {/* GRID VIEW */}
      {!isLoading && viewMode === 'grid' && filteredProfiles.length > 0 && (
        <div className="profiles-grid">
          {filteredProfiles.map((p) => {
            const isSelected = p.id === activeProfileId;
            const initials = p.name
              ? p.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()
              : 'PC';

            return (
              <div
                key={p.id}
                className={`directory-card ${isSelected ? 'selected-card' : ''}`}
              >
                <div className="directory-card-header">
                  <div className="directory-avatar-container">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="directory-avatar"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className="directory-fallback-avatar"
                      style={{ display: p.image_url ? 'none' : 'flex' }}
                    >
                      {initials}
                    </div>
                  </div>

                  <span className="directory-id-tag">#{p.id}</span>
                </div>

                <div className="directory-card-body">
                  <h4 className="directory-name">{p.name}</h4>
                  <p className="directory-title">{p.designation}</p>

                  <div className="directory-meta">
                    <span className="meta-pill">
                      <MapPin size={12} /> {p.location}
                    </span>
                  </div>

                  <p className="directory-bio-snippet">{p.bio}</p>

                  {/* Skills tags preview */}
                  <div className="directory-skills-preview">
                    {(p.skills || []).slice(0, 4).map((skill, idx) => (
                      <span key={idx} className="directory-skill-tag">
                        {skill}
                      </span>
                    ))}
                    {(p.skills || []).length > 4 && (
                      <span className="directory-skill-more">
                        +{(p.skills || []).length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="directory-card-actions">
                  <button
                    type="button"
                    className="action-btn view-btn"
                    onClick={() => onSelectProfile(p)}
                    title="View & Export Card"
                  >
                    <Eye size={15} />
                    <span>View</span>
                  </button>
                  <button
                    type="button"
                    className="action-btn edit-btn"
                    onClick={() => onEditProfile(p)}
                    title="Edit profile"
                  >
                    <Edit size={15} />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    className="action-btn delete-btn"
                    onClick={() => onDeleteProfile(p.id)}
                    title="Delete profile"
                  >
                    <Trash2 size={15} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST VIEW */}
      {!isLoading && viewMode === 'list' && filteredProfiles.length > 0 && (
        <div className="profiles-list-table-wrapper">
          <table className="profiles-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Designation</th>
                <th>Location</th>
                <th>Skills</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProfiles.map((p) => {
                const isSelected = p.id === activeProfileId;
                const initials = p.name
                  ? p.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()
                  : 'PC';

                return (
                  <tr
                    key={p.id}
                    className={`table-row ${isSelected ? 'row-selected' : ''}`}
                  >
                    <td>
                      <div className="table-user-cell">
                        <div className="table-avatar">
                          {p.image_url ? (
                            <img
                              src={p.image_url}
                              alt={p.name}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div
                            className="table-avatar-fallback"
                            style={{ display: p.image_url ? 'none' : 'flex' }}
                          >
                            {initials}
                          </div>
                        </div>
                        <div>
                          <div className="table-name">{p.name}</div>
                          <div className="table-email">{p.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="table-title-badge">{p.designation}</span>
                    </td>
                    <td>
                      <span className="flex-row items-center gap-1 text-muted">
                        <MapPin size={13} /> {p.location}
                      </span>
                    </td>
                    <td>
                      <div className="table-skills-cell">
                        {(p.skills || []).slice(0, 3).map((s, idx) => (
                          <span key={idx} className="table-skill-tag">{s}</span>
                        ))}
                        {(p.skills || []).length > 3 && (
                          <span className="table-skill-tag-more">
                            +{(p.skills || []).length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="table-actions-cell">
                        <button
                          type="button"
                          className="action-icon-btn text-indigo"
                          onClick={() => onSelectProfile(p)}
                          title="View & Export Card"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          className="action-icon-btn text-emerald"
                          onClick={() => onEditProfile(p)}
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          type="button"
                          className="action-icon-btn text-rose"
                          onClick={() => onDeleteProfile(p.id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

