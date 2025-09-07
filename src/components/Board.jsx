import React, { useState } from "react";
import { Game } from "../logic/Game";
import Square from "./Square";
import "./Board.css";

const Board = ({
  board,
  handleSquareClick,
  isSelected,
  highlightedSq,
  threatenedSq,
  lastMove,
  playerColor,
}) => {
  return (
    <div className={playerColor === "w" ? "board" : "board transformed"}>
      {board.getSquares().map((row, rowIndex) => (
        <>
          {/* <div className="row-label">
            {playerColor === "w" ? 8 - rowIndex : rowIndex + 1}
          </div> */}
          <div key={rowIndex} className={"board-row"}>
            {row.map((square, colIndex) => {
              return (
                <div key={`${rowIndex}-${colIndex}`}>
                  <Square
                    playerColor={playerColor}
                    key={`${rowIndex}-${colIndex}`}
                    isSelected={
                      isSelected &&
                      isSelected.row === rowIndex &&
                      isSelected.col === colIndex
                    }
                    isHighlighted={highlightedSq.some(
                      (move) => move[0] === rowIndex && move[1] === colIndex
                    )}
                    isThreatened={threatenedSq.some(
                      (move) => move[0] === rowIndex && move[1] === colIndex
                    )}
                    square={square}
                    onClick={() => handleSquareClick(rowIndex, colIndex)}
                    row={rowIndex}
                    col={colIndex}
                    isLastMoveFrom={
                      lastMove &&
                      lastMove.actions.some(
                        (action) =>
                          action.move.from.row === rowIndex &&
                          action.move.from.col === colIndex
                      )
                    }
                    isLastMoveTo={
                      lastMove &&
                      lastMove.actions.some(
                        (action) =>
                          action.move.to.row === rowIndex &&
                          action.move.to.col === colIndex
                      )
                    }
                    // isLastMoveFrom={lastMove && lastMove.actions[0].move.from.col === colIndex && lastMove.actions[0].move.from.row === rowIndex}
                    // isLastMoveTo={lastMove && lastMove.actions[0].move.to.col === colIndex && lastMove.actions[0].move.to.row === rowIndex}
                  />
                  {/* {rowIndex === 7 && (
                    <div className="col-label">
                      {playerColor === "w"
                        ? String.fromCharCode(97 + colIndex)
                        : String.fromCharCode(104 - colIndex)}
                    </div>
                  )} */}
                </div>
              );
            })}
          </div>
        </>
      ))}
    </div>
  );
};

export default Board;
