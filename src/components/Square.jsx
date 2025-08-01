import React from "react";
import { Square as SquareLogic } from "../logic/Square";
import "./Square.css";
import PieceComponent from "./Piece";
import { PieceImages } from "../logic/pieceConstants";


const Square = ({ isSelected, onClick, square, row, col, isHighlighted, isThreatened, kingsPosition }) => {
  const squareClass = `square ${(row + col) % 2 === 0 ? 'white' : 'black'} 
                              ${isSelected ? 'selected' : ''}
                              ${isHighlighted ? 'highlighted' : ''}
                              ${isThreatened ? 'threatened' : ''}
                              ${isThreatened && square.getPiece() && square.getPiece().getType() === 'k' ? 'check' : ''}`;


  const piece = square.getPiece();
  const handleClick = () => {
    onClick()
  }

  return (
    <div className={`square${row}-${col}`}>
      <div className={squareClass} onClick={handleClick} >
        {piece && (<PieceComponent piece={piece} />)}
      </div>
    </div>
  );
};

export default Square;
