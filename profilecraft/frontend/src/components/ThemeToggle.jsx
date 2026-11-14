import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle-btn"
      onClick={onToggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className={`theme-toggle-track ${isDark ? 'dark' : 'light'}`}>
        <span className="theme-toggle-thumb">
          {isDark ? <Moon size={14} className="theme-icon moon" /> : <Sun size={14} className="theme-icon sun" />}
        </span>
      </div>
      <span className="theme-toggle-label">{isDark ? 'Dark' : 'Light'}</span>
    </button>
  );
}

