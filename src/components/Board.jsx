import Square from "./Square";
import { Position } from "../logic/Position";
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
                      isSelected.equals(new Position(rowIndex, colIndex))
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
                        return pos.equals(new Position(rowIndex, colIndex));
                      })
                    }
                    isRecommended={
                      recommendedMove &&
                      ((recommendedMove.from.equals(new Position(rowIndex, colIndex))) ||
                      (recommendedMove.to.equals(new Position(rowIndex, colIndex))))
                    }
                    square={square}
                    onClick={() => handleSquareClick(rowIndex, colIndex)}
                    row={rowIndex}
                    col={colIndex}
                    isLastMoveFrom={
                      lastMove &&
                      lastMove.from.equals(new Position(rowIndex, colIndex))
                    }
                    isLastMoveTo={
                      lastMove &&
                      lastMove.to.equals(new Position(rowIndex, colIndex))
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
