import React, { useState } from 'react';
import MainMenu from './MainMenu';
import SettingsMenu from './SettingsMenu';
import './App.css';
import Game from './Game';


const App = () => {
  const [screen, setScreen] = useState('mainMenu');
  const [timeLimit, setTimeLimit] = useState({  label: "10:00", value: 10 * 60 });
  const [playerMode, setPlayerMode] = useState("pve");
  const [playerColor, setPlayerColor] = useState("w");

  return (
    <div className="app">
      {screen === 'mainMenu' && (
        <MainMenu
          onStartGame={() => setScreen('game')}
          onSettings={() => setScreen('settingsMenu')}
        />
      )}
      {screen === 'settingsMenu' && (
        <SettingsMenu
          onBack={() => setScreen('mainMenu')}
          onTimeChange={setTimeLimit}
          timeLimit={timeLimit}
          setPlayerMode={setPlayerMode}
          setPlayerColor={setPlayerColor}
          playerColor={playerColor}
          playerMode={playerMode}
        />
      )}
      {screen === 'game' && (
        <Game
          onBack={() => setScreen('mainMenu')}
          timeLimit={timeLimit}
          playerMode={playerMode}
          playerColor={playerColor}
        />
      )}
    </div>
  );
};

export default App;