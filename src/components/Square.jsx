import React from "react";
import { Square as SquareLogic } from "../logic/Square";
import "./Square.css";
import PieceComponent from "./Piece";

const Square = ({ isSelected, onClick, square, row, col, isHighlighted, isTreatened }) => {
  const squareClass = `square ${(row + col) % 2 === 0 ? 'white' : 'black'} 
                              ${isSelected ? 'selected' : ''}
                              ${isHighlighted ? 'highlighted' : ''}
                              ${isTreatened ? 'treatened' : ''}`;
                              

  const piece = square.getPiece();
  

  const handleClick = () => {
    //console.log(`Square clicked: Row ${row}, Col ${col}`);
    onClick()
  }

 
  return (
    <div className={`square${row}-${col}`}>
    <div
    
      className={squareClass}
      onClick={handleClick}
    >
      {piece && (<PieceComponent piece={piece}/>
      ) }
    </div></div>
  );
};

export default Square;
