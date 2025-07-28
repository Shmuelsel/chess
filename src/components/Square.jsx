import React from "react";
import { Square as SquareLogic } from "../logic/Square";
import "./Square.css";
import PieceComponent from "./Piece";

const Square = ({ square, onClick, row, col }) => {
  const squareClass = `square ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
  const piece = square.getPiece();
  const [selectedSquare, setSelectedSquare] = React.useState(null)

  const handleClick = () => {
    selectedSquare === null ? setSelectedSquare(square) : setSelectedSquare(null);
    console.log(`Square clicked: Row ${row}, Col ${col}`);
    onClick()
  }

 
  return (
    <div className={`square${row}-${col}`}>
    <div
    
      className={squareClass}
      
      onClick={handleClick}
    >
      {piece && (
        <PieceComponent
          piece={piece}
        />
      ) }
    </div></div>
  );
};

export default Square;
