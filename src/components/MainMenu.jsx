import React from 'react';
import './MainMenu.css';

const MainMenu = ({ onStartGame, onSettings }) => {
  return (
    <div className="main-menu">
      <h1>Chess Game</h1>
      <button className="button" onClick={onStartGame}>
        Start Game
      </button>
      <button className="button" onClick={onSettings}>
        Settings
      </button>
    </div>
  );
};

export default MainMenu;