import React from "react";
import { Game } from "../logic/Game";
import { Board as boardLogic } from "../logic/Board";
import Board from "./Board";

const GameComponent = ({ onBack }) => {
  const [game, setGame] = React.useState(new Game());

  const onSquareClick = (row, col) => {
  };

  return (
    <div className="game">
      <button onClick={onBack}> its start of new age</button>
      <Board board={game.getBoard()} handleSquareClick={onSquareClick} />
    </div>
  );
};

export default GameComponent;
