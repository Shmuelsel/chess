import React from "react";
import Board from "./Board";
import "./ChessBoardWithLabels.css";

const ChessBoardWithLabels = ({
    playerColor,
    board,
    handleSquareClick,
    isSelected,
    highlightedSq,
    threatenedSq,
    lastMove
}) => {
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const numbers = [8, 7, 6, 5, 4, 3, 2, 1];

    return (
        <div className="chess-wrapper">
            <div className="board-container">
                {/* המספרים בצד שמאל */}
                <div className="numbers">
                    {numbers.map((n) => (
                        <div key={n} className="number">{n}</div>
                    ))}
                </div>

                {/* הלוח */}
                <Board
                    playerColor={playerColor}
                    board={board}
                    handleSquareClick={handleSquareClick}
                    isSelected={isSelected}
                    highlightedSq={highlightedSq}
                    threatenedSq={threatenedSq}
                    lastMove={lastMove}
                />

                {/* האותיות למטה */}
                <div className="letters">
                    {letters.map((l) => (
                        <div key={l} className="letter">{l}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChessBoardWithLabels;
