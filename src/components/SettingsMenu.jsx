import React from "react";
import "./SettingsMenu.css";

const SettingsMenu = ({ onBack, onTimeChange, timeLimit }) => {

  const timeLevels = [{ label: "05:00", value: 5 * 60 }, { label: "10:00", value: 10 * 60 }, { label: "15:00", value: 15 * 60 }, { label: "20:00", value: 20 * 60 }];
  const [selectedTime, setSelectedTime] = React.useState(timeLevels.findIndex(t => t.value === timeLimit.value));

  const handleTimeClick = () => {
    var nextIndex = (selectedTime + 1) % timeLevels.length;
    setSelectedTime(nextIndex);
    onTimeChange(timeLevels[nextIndex]);
  };

  return (
    <div className="settings-menu">
      <h1>Settings</h1>
      <p>Game Settings (e.g., sound, theme)</p>
      <button className="button time" onClick={handleTimeClick}>
        {timeLevels[selectedTime].label} ⏳
      </button>
      <button className="button" onClick={onBack}>
        Back
      </button>
    </div>
  );
};

export default SettingsMenu;
