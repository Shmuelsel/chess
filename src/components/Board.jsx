import React, { useState } from "react";
import { Game } from "../logic/Game";
import Square from "./Square";
import "./Board.css"

const Board = ({ board, handleSquareClick }) => {

  return (
    <div className="board">
      {board.getSquares().map((row, rowIndex) => (
        <div key={rowIndex} className={"board-row"}>
          {row.map((square, colIndex) => (
            <div key={`${rowIndex}-${colIndex}`} >
              {console.log(square)}
                <Square
                    key={`${rowIndex}-${colIndex}`}
                    square={square}
                    onClick={() => handleSquareClick(rowIndex, colIndex)}
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
