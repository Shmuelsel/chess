import React from "react";
import "./SettingsMenu.css";

const SettingsMenu = ({ onBack, onTimeChange, timeLimit, setPlayerMode, setPlayerColor, playerColor, playerMode }) => {

  //const playerColors = [{ label: "White", value: "w" }, { label: "Black", value: "b" }];
  const timeLevels = [{ label: "05:00", value: 5 * 60 }, { label: "10:00", value: 10 * 60 }, { label: "15:00", value: 15 * 60 }, { label: "20:00", value: 20 * 60 }];
  const playerModes = [{ label: "🕵️ vs 🕵️", value: "pvp" }, { label: "🕵️ vs 🤖", value: "pve" }];
  const [selectedTime, setSelectedTime] = React.useState(timeLevels.findIndex(t => t.value === timeLimit.value));
  // const [playerMode, setPlayerMode] = React.useState(playerMode);
  // const [playerColor, setPlayerColor] = React.useState(playerColor);

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
    setPlayerColor(prev => (prev === "w" ? "b" : "w"));
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
        {playerColor === "w" ? "Black" : "White"}
      </button>
      <button className="button" onClick={onBack}>
        Back
      </button>
    </div>
  );
};

export default SettingsMenu;
