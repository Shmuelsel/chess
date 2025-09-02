import React from "react";
import "./Square.css";
import PieceComponent from "./Piece";
import { useTurn } from "./Game";



const Square = ({ isSelected, onClick, square, row, col, isHighlighted, isThreatened, kingsPosition, isLastMoveFrom, isLastMoveTo, playerColor }) => {
  const piece = square.getPiece();
  const { turn } = useTurn();

  const squareClass = `square ${playerColor === "w" ? "" : "transformed"}
                              ${piece && piece.getColor() === turn ? 'occupied' : ''}
                              ${(row + col) % 2 === 0 ? 'white' : 'black'} 
                              ${isLastMoveFrom ? 'last-move-from' : ''}
                              ${isLastMoveTo ? 'last-move-to' : ''}
                              ${isSelected ? 'selected' : 'notSelected'}
                              ${isHighlighted ? 'highlighted' : ''}
                              ${isHighlighted && square.getPiece() ? 'eatable' : ''}
                              ${isThreatened ? 'threatened' : ''}
                              ${isThreatened && square.getPiece() && square.getPiece().getType() === 'k' ? 'check' : ''}`;



  const handleClick = () => {
    onClick()
  }

  return (
    <div className={`square${row}-${col}` }>
      <div className={squareClass} onClick={handleClick} >
        {piece && (<PieceComponent piece={piece} />)}
      </div>
    </div>
  );
};

export default Square;
