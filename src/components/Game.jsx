import React from "react";
import { Game } from "../logic/Game";
import { Board as boardLogic } from "../logic/Board";
import Board from "./Board";
import "./Game.css";


const GameComponent = ({ onBack }) => {
  const [game, setGame] = React.useState(new Game());

  const onSquareClick = (row, col) => {
    var x = game.getBoard().getSquare(row, col).getPiece();
    {console.log(x.getColor() + x.getType());
    }
    
  };

  return (
    
    <div className="game">
      <button onClick={onBack}> its start of new age</button>
      <Board board={game.getBoard()} handleSquareClick={onSquareClick} />
    </div>
  );
};

export default GameComponent;
