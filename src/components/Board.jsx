import React, { useState } from "react";
import { Game } from "../logic/Game";
import Square from "./Square";
import "./Board.css"

const Board = ({ board, handleSquareClick, isSelected, highlightedSq, treatenedSq }) => {

  return (
    <div className="board">
      {board.getSquares().map((row, rowIndex) => (
        <div key={rowIndex} className={"board-row"}>
          {row.map((square, colIndex) => {
            
            return (
              <div key={`${rowIndex}-${colIndex}`} >
                
                  <Square
                      key={`${rowIndex}-${colIndex}`}
                      isSelected={isSelected && isSelected.row === rowIndex && isSelected.col === colIndex}
                      isHighlighted={highlightedSq.some(move => move[0] === rowIndex && move[1] === colIndex)}
                      isTreatened={treatenedSq.some(move => move[0] === rowIndex && move[1] === colIndex)}
                      square={square}
                      onClick={() => handleSquareClick(rowIndex, colIndex)}
                      row={rowIndex}
                      col={colIndex}
                  />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Board;
