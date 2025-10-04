import React, { useState } from 'react';
import MainMenu from './MainMenu';
import SettingsMenu from './SettingsMenu';
import './App.css';
import Game from './Game';
import { GameMode, PlayerColor } from '../logic/gameConstants';


const App = () => {
  const [screen, setScreen] = useState('mainMenu');
  const [timeLimit, setTimeLimit] = useState({  label: "10:00", value: 10 * 60 });
  const [playerMode, setPlayerMode] = useState(GameMode.PLAYER_VS_ENGINE);
  const [playerColor, setPlayerColor] = useState(PlayerColor.WHITE);
  const [level, setLevel] = useState(2);

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
          level={level}
          setLevel={setLevel}
        />
      )}
      {screen === 'game' && (
        <Game
          onBack={() => setScreen('mainMenu')}
          timeLimit={timeLimit}
          playerMode={playerMode}
          playerColor={playerColor}
          level={level}
        />
      )}
    </div>
  );
};

export default App;