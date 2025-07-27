import React from "react";
import { Game } from "../logic/Game";
//import "./Game.css";
import { Board } from "../logic/Board";


const GameComponent = ({ onBack }) => {
    const [game, setGame] = React.useState(new Game());

    return (
        <div className="game">
            <button onClick={onBack}> its start of new age</button>
        </div>
    );
}

export default GameComponent;