import React, { useState } from 'react';
import MainMenu from './MainMenu';
import SettingsMenu from './SettingsMenu';
import './App.css';
import Game from './Game';


const App = () => {
  const [screen, setScreen] = useState('mainMenu');

  return (
    <div className="app">
      {screen === 'mainMenu' && (
        <MainMenu
          onStartGame={() => setScreen('game')}
          onSettings={() => setScreen('settingsMenu')}
        />
      )}
      {screen === 'settingsMenu' && (
        <SettingsMenu onBack={() => setScreen('mainMenu')} />
      )}
      {screen === 'game' && (
        <Game
          onBack={() => setScreen('mainMenu')}
        />
      )}
    </div>
  );
};

export default App;