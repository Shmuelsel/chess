import React from "react";
import { Square as SquareLogic } from "../logic/Square";
import "./Square.css";
import PieceComponent from "./Piece";


const Square = ({ isSelected, onClick, square, row, col, isHighlighted, isTreatened, kingsPosition }) => {
  const squareClass = `square ${(row + col) % 2 === 0 ? 'white' : 'black'} 
                              ${isSelected ? 'selected' : ''}
                              ${isHighlighted ? 'highlighted' : ''}
                              ${isTreatened ? 'treatened' : ''}
                              ${isTreatened && square.getPiece() && square.getPiece().getType() === 'k' ? 'check' : ''}`;


  const piece = square.getPiece();
  const handleClick = () => {
    onClick()
  }

  return (
    <div className={`square${row}-${col}`}>
      <div className={squareClass} onClick={handleClick} >
        {piece && piece.getType() === 'p' && (
          <img
            src="../assets/images/vs.jpg"
            alt="vs"
            className="piece-image"
          />
        )}
        {piece && (<PieceComponent piece={piece} />)}
      </div>
    </div>
  );
};

export default Square;
