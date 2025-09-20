import React, { createContext, useContext, useReducer } from "react";
import { Game } from "../logic/Game";
import { gameReducer, getInitialState } from "../logic/gameReducer";
import Board from "./Board";
import "./Game.css";
import ChessBoardLabels from "./ChessBoardWithLabels";

export const TurnContext = createContext();
export const useTurn = () => {
  return useContext(TurnContext);
};

const GameComponent = ({
  onBack,
  timeLimit,
  playerMode,
  playerColor,
  level,
}) => {
  const [state, dispatch] = useReducer(
    gameReducer,
    getInitialState(playerColor)
  );

  // Extract from state
  const {
    game,
    selectedSquare,
    selectedPiece,
    validMoves,
    threatenedSquares,
    turn,
    lastMove,
    updateCounter,
  } = state;
  const [whiteClock, setWhiteClock] = React.useState(timeLimit.value);
  const [blackClock, setBlackClock] = React.useState(timeLimit.value);
  const [trigger, setTrigger] = React.useState(false);

  const moves = React.useRef([]);
  const redoMoves = React.useRef([]);
  const engineRef = React.useRef(null);
  const startTimeRef = React.useRef(Date.now());
  const whiteElapsedRef = React.useRef(0);
  const blackElapsedRef = React.useRef(0);
  const playerModeRef = React.useRef(playerMode);
  const playerColorRef = React.useRef(playerColor);
  const firstRender = React.useRef(true);
  const mounted = React.useRef(false);

  const enemyColor = playerColor === "w" ? "b" : "w";

  React.useEffect(() => {
    if (playerMode !== "pve") return;

    const engine = new Worker(
      "/stockfish/stockfish-17.1-lite-single-03e3232.js"
    );
    engine.postMessage("uci");

    if (playerColorRef.current === "w") {
      engineRef.current = engine;
    } else {
      setTimeout(() => {
        engine.postMessage("position startpos");
        engine.postMessage(`go depth ${level}`);
      }, 1000);
      engineRef.current = engine;
    }

    engine.onmessage = (e) => {
      if (e.data.startsWith("bestmove")) {
        const bestMove = e.data.split(" ")[1];
        const from = game.chessNotationToPos(bestMove.substring(0, 2));
        const to = game.chessNotationToPos(bestMove.substring(2, 4));
        dispatch({
          type: "MOVE",
          payload: {
            fromRow: from.row,
            fromCol: from.col,
            toRow: to.row,
            toCol: to.col,
          },
        });
      }
    };
    return () => engine.terminate();
  }, [trigger]);

  React.useEffect(() => {
    startTimeRef.current = Date.now();

    const timer = setInterval(() => {
      const now = Date.now();
      const diff = (now - startTimeRef.current) / 1000;
      startTimeRef.current = now;

      if (turn === "w") {
        whiteElapsedRef.current += diff;

        if (whiteElapsedRef.current >= 1) {
          setWhiteClock((prev) => Math.max(prev - 1, 0));
          whiteElapsedRef.current = 0;
        }
      } else {
        blackElapsedRef.current += diff;

        if (blackElapsedRef.current >= 1) {
          setBlackClock((prev) => Math.max(prev - 1, 0));
          blackElapsedRef.current = 0;
        }
      }
    }, 100);
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // for strict mode in development
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (game.checkGameOver()) {
      console.log("Game Over");
      setTimeout(() => {
        onBack();
      }, 3000);
    }

    if (game.getLastMove()) {
      moves.current.push(game.getLastMove().actions[0].moveChessNotation);

      // אם זה מצב PvE והתור עבר למנוע, נשלח את המהלכים למנוע
      if (playerModeRef.current === "pve" && turn !== playerColorRef.current) {
        setTimeout(() => {
          engineRef.current.postMessage(
            `position startpos moves ${moves.current.join(" ")}`
          );
          engineRef.current.postMessage(`go depth ${level}`);
        }, 500);
      }
    }

    return () => clearInterval(timer);
  }, [turn]);

  const handleSquareSelection = (row, col) => {
    // במשחק נגד המחשב, השחקן יכול לשחק רק בצבע שלו
    if (playerModeRef.current === "pve" && turn !== playerColorRef.current) {
      return;
    }

    if (selectedPiece) {
      const isValid = validMoves.some(
        (move) => move.row === row && move.col === col
      );
      validMoves.forEach((move) => {});
      if (!isValid) {
      } else {
        dispatch({
          type: "MOVE",
          payload: {
            fromRow: selectedSquare.row,
            fromCol: selectedSquare.col,
            toRow: row,
            toCol: col,
          },
        });

        // אז נשלח למנוע - נעשה זאת ב-useEffect אחרי שהמהלך נוסף
      }
    }

    if (
      game.getBoard().getSquare(row, col).isOccupied() &&
      game.getBoard().getSquare(row, col).getPiece().getColor() ===
        game.getCurrentTurn() &&
      (playerModeRef.current !== "pve" ||
        game.getCurrentTurn() === playerColorRef.current)
    ) {
      const square = game.getBoard().getSquare(row, col);
      const piece = square.getPiece();
      const moves = game.calcMoves(row, col, piece);
      if (moves.length <= 0) {
        console.error("No valid moves for the selected piece.");
        return;
      }
      dispatch({
        type: "SELECT_PIECE",
        payload: {
          row,
          col,
          piece,
          moves,
        },
      });
    }
  };

  const undoMove = () => {
    redoMoves.current.push(moves.current.pop());
    dispatch({ type: "UNDO" });
  };

  const redoMove = () => {
    moves.current.push(redoMoves.current.pop());
    dispatch({ type: "REDO" });
  };

  const resetGame = () => {
    dispatch({
      type: "RESET_GAME",
      payload: { playerColor },
    });
    setWhiteClock(timeLimit.value);
    setBlackClock(timeLimit.value);
    moves.current = [];
    redoMoves.current = [];
    setTrigger(!trigger);
  };

  return (
    <TurnContext.Provider value={{ turn, dispatch, lastMove }}>
      <div className="game">
        <div className="controls">
          <button className="button backBtn" onClick={onBack}>
            {" "}
            back
          </button>

          {game.getLastMove() && (
            <button className="button undoBtn" onClick={undoMove}>
              Undo Move
            </button>
          )}
          {game.getForwardMove() && (
            <button className="button redoBtn" onClick={redoMove}>
              Redo Move
            </button>
          )}
        </div>
        <div className="clocks">
          <div className="clock">
            <h4>White's Time</h4>
            <div className="timer">
              {Math.floor(whiteClock / 60)
                .toString()
                .padStart(2, "0")}
              :{(whiteClock % 60).toString().padStart(2, "0")}
            </div>
          </div>
          <div className="clock">
            <h4>Black's Time</h4>
            <div className="timer">
              {Math.floor(blackClock / 60)
                .toString()
                .padStart(2, "0")}
              :{(blackClock % 60).toString().padStart(2, "0")}
            </div>
          </div>
        </div>
        <h3 className="turn-indicator">
          Current Turn: {turn === "w" ? "White" : "Black"}
        </h3>
        {game.getWinner() && (
          <div className="winner-popup">
            <h3 className="winner-message">
              Winner: {game.getWinner() === "w" ? "White" : "Black"}
            </h3>
          </div>
        )}
        <ChessBoardLabels
          playerColor={playerColor}
          board={game.getBoard()}
          handleSquareClick={handleSquareSelection}
          isSelected={selectedSquare}
          highlightedSq={validMoves}
          threatenedSq={threatenedSquares}
          lastMove={lastMove}
        />
        <button className="button rstBtn" onClick={resetGame}>
          new game
        </button>
        {/* <input id="history-moves" type="text" readOnly value={moves.current.join(", ")} /> */}
        <div className="move-history">
          <h4>Move History</h4>
          <ul>
            {moves.current.map((move, index) => (
              <li key={index}>{move}</li>
            ))}
          </ul>
        </div>
        {/* <div className="last-move">{lastMove ? `Last Move: ${lastMove.actions.move.from.row} to ${lastMove.actions.move.to.row}` : ''}</div> */}
      </div>
    </TurnContext.Provider>
  );
};

export default GameComponent;
