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
  recommendedMove,
}) => {
  return (
    <div className={playerColor === "w" ? "board" : "board transformed"}>
      {board.getSquares().map((row, rowIndex) => (
        <>
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
                    isHighlighted={
                      highlightedSq &&
                      highlightedSq.some(
                        (move) => move.row === rowIndex && move.col === colIndex
                      )
                    }
                    isThreatened={
                      threatenedSq &&
                      threatenedSq.some((pos) => {
                        return pos.row === rowIndex && pos.col === colIndex;
                      })
                    }
                    isRecommended={
                      recommendedMove &&
                      ((recommendedMove.from.row === rowIndex &&
                        recommendedMove.from.col === colIndex) ||
                        (recommendedMove.to.row === rowIndex &&
                          recommendedMove.to.col === colIndex))
                    }
                    square={square}
                    onClick={() => handleSquareClick(rowIndex, colIndex)}
                    row={rowIndex}
                    col={colIndex}
                    isLastMoveFrom={
                      lastMove &&
                      lastMove.from.row === rowIndex &&
                      lastMove.from.col === colIndex
                    }
                    isLastMoveTo={
                      lastMove &&
                      lastMove.to.row === rowIndex &&
                      lastMove.to.col === colIndex
                    }
                  />
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
