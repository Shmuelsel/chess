import React, { useState } from "react";
import { Game } from "../logic/Game";
import Square from "./Square";
import "./Board.css"

const Board = ({ board, onSquareClick }) => {

  return (
    <div className="board">
      {board.getSquares().map((row, rowIndex) => (
        <div key={rowIndex} className={"board-row"}>
          {row.map((square, colIndex) => (
            <div key={`${rowIndex}-${colIndex}`} className={`square${ (rowIndex + colIndex) % 2 === 0 ? 'White' : 'Black'}`}>
                <Square
                    key={`${rowIndex}-${colIndex}`}
                    square={square}
                    onClick={() => onSquareClick(rowIndex, colIndex)}
                    row={rowIndex}
                    col={colIndex}
                />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
