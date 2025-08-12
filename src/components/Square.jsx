import React from "react";
import { Square as SquareLogic } from "../logic/Square";
import "./Square.css";
import PieceComponent from "./Piece";
import { PieceImages } from "../logic/pieceConstants";
import { useTurn } from "./Game";



const Square = ({ isSelected, onClick, square, row, col, isHighlighted, isThreatened, kingsPosition }) => {
  const piece = square.getPiece();
  const {turn} = useTurn();
  const squareClass = `square ${piece && piece.getColor() === turn ? 'occupied' : ''}
                              ${(row + col) % 2 === 0 ? 'white' : 'black'} 
                              ${isSelected ? 'selected' : 'notSelected'}
                              ${isHighlighted ? 'highlighted' : ''}
                              ${isHighlighted && square.getPiece() ? 'eatable' : ''}
                              ${isThreatened ? 'threatened' : ''}
                              ${isThreatened && square.getPiece() && square.getPiece().getType() === 'k' ? 'check' : ''}`;


  
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
