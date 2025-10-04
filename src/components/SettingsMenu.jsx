import React from "react";
import "./SettingsMenu.css";
import { GameMode, PlayerColor } from "../logic/gameConstants";

const SettingsMenu = ({ onBack, onTimeChange, timeLimit, setPlayerMode, setPlayerColor, playerColor, playerMode, level, setLevel }) => {

  const levels = [{ label: "Easy", value: 2 }, { label: "Medium", value: 5 }, { label: "Hard", value: 8 }, { label: "Expert", value: 12 }, { label: "Master", value: 15 }];
  const timeLevels = [{ label: "05:00", value: 5 * 60 }, { label: "10:00", value: 10 * 60 }, { label: "15:00", value: 15 * 60 }, { label: "20:00", value: 20 * 60 }];
  const playerModes = [{ label: "🕵️ vs 🕵️", value: GameMode.PLAYER_VS_PLAYER }, { label: "🕵️ vs 🤖", value: GameMode.PLAYER_VS_ENGINE }];
  const [selectedTime, setSelectedTime] = React.useState(timeLevels.findIndex(t => t.value === timeLimit.value));

  const handleTimeClick = () => {
    var nextIndex = (selectedTime + 1) % timeLevels.length;
    setSelectedTime(nextIndex);
    onTimeChange(timeLevels[nextIndex]);
  };

  const handlePlayerModeClick = () => {
    var nextIndex = (playerModes.findIndex(m => m.value === playerMode) + 1) % playerModes.length;
    setPlayerMode(playerModes[nextIndex].value);
  };

  const handlePlayerColorClick = () => {
    setPlayerColor(prev => (prev === PlayerColor.WHITE ? PlayerColor.BLACK : PlayerColor.WHITE));
  };

  const handleLevelClick = () => {
    var nextIndex = (levels.findIndex(l => l.value === level) + 1) % levels.length;
    setLevel(levels[nextIndex].value);
  };

  return (
    <div className="settings-menu">
      <h1>Settings</h1>
      <p>Game Settings (e.g., sound, theme)</p>
      <button className="button time" onClick={handleTimeClick}>
        {timeLevels[selectedTime].label} ⏳
      </button>
      <button className="button player-mode" onClick={handlePlayerModeClick}>
        {playerModes.findIndex(m => m.value === playerMode) === 0 ? playerModes[0].label : playerModes[1].label}
      </button>
      <button className="button player-color" onClick={handlePlayerColorClick}>
        {playerColor === PlayerColor.WHITE ? "White" : "Black"}
      </button>
      {playerMode === GameMode.PLAYER_VS_ENGINE && <button className="button level" onClick={handleLevelClick}>Level: {levels.find(l => l.value === level).label}</button>}
      <button className="button" onClick={onBack}>
        Back
      </button>
    </div>
  );
};

export default SettingsMenu;
