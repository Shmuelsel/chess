import React from 'react';
import './SettingsMenu.css';

const SettingsMenu = ({ onBack }) => {
  return (
    <div className="settings-menu">
      <h1>Settings</h1>
      <p>Game Settings (e.g., sound, theme)</p>
      <button className="button" onClick={onBack}>
        Back
      </button>
    </div>
  );
};

export default SettingsMenu;