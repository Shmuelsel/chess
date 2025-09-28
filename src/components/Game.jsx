import React, { createContext, useContext, useReducer, useState } from "react";
import { gameReducer, getInitialState } from "../logic/gameReducerNew";
import "./Game.css";
import ChessBoardLabels from "./ChessBoardWithLabels";
import PawnPromotion from "./PawnPromotion";
import { Queen } from "../logic/pieces/Queen";
import { Rook } from "../logic/pieces/Rook";
import { Bishop } from "../logic/pieces/Bishop";
import { Knight } from "../logic/pieces/Knight";
import { Move } from "../logic/Move";
import { Position } from "../logic/Position";

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
    //board,
    selectedSquare: selectedSquareRaw,
    selectedPiece,
    validMoves,
    threatenedSquares,
    turn,
    lastMove,
  } = state;

  // המר את selectedSquare ל-Position instance אם הוא קיים (עם memoization)
  const selectedSquare = React.useMemo(() => {
    if (!selectedSquareRaw) return null;

    // אם זה כבר Position object, החזר אותו כמו שהוא
    if (selectedSquareRaw instanceof Position) {
      return selectedSquareRaw;
    }

    // אחרת, צור Position חדש
    return new Position(selectedSquareRaw.row, selectedSquareRaw.col);
  }, [selectedSquareRaw]);

  const [whiteClock, setWhiteClock] = React.useState(timeLimit.value);
  const [blackClock, setBlackClock] = React.useState(timeLimit.value);
  const [trigger, setTrigger] = React.useState(false);
  const [popupPiecePromotion, setPopupPiecePromotion] = React.useState(null);
  const engineRef = React.useRef(null);
  const startTimeRef = React.useRef(Date.now());
  const whiteElapsedRef = React.useRef(0);
  const blackElapsedRef = React.useRef(0);
  const playerModeRef = React.useRef(playerMode);
  const playerColorRef = React.useRef(playerColor);
  const turnRef = React.useRef(turn);
  const firstRender = React.useRef(true);
  const mounted = React.useRef(false);
  const timerRef = React.useRef(null);
  const bestMoveRef = React.useRef(null);

  const enemyColor = playerColor === "w" ? "b" : "w";
  const [recommendedMove, setRecommendedMove] = useState(null);
  const [showRecommended, setShowRecommended] = useState(false);
  //===========================================
  React.useEffect(() => {
    if (!lastMove || !game) return;
    const pos = lastMove.to;
    const piece = game.getBoard().getSquare(pos).getPiece();
    if (piece && piece._needPromotion) {
      setPopupPiecePromotion(piece);
    }
  }, [lastMove, game]);
  //===========================================

  React.useEffect(() => {
    if (playerMode !== "pve") return;

    const engine = new Worker(
      "/stockfish/stockfish-17.1-lite-single-03e3232.js"
    );
    engine.postMessage("uci");

    setTimeout(() => {
      engine.postMessage("position startpos");
      engine.postMessage(`go depth ${level}`);
    }, 1000);

    engineRef.current = engine;
    let lastInfo = null;

    engine.onmessage = (e) => {
      if (e.data.startsWith("bestmove")) {
        const bestMove = e.data.split(" ")[1];
        bestMoveRef.current = bestMove;
        if (turnRef.current !== enemyColor) {
          const from = new Position(bestMove.substring(0, 2));
          const to = new Position(bestMove.substring(2, 4));
          setRecommendedMove({ from, to });
          console.log(bestMove);
          console.log("Recommended Move:", { from, to });
          return;
        }

        if (!bestMove || bestMove.length < 4) {
          console.error("Invalid bestMove:", bestMove);
          return;
        }

        if (!game) {
          console.error("No game object available for AI move");
          return;
        }
        const test = new Position(bestMove.substring(0, 2));
        //nst testMatrix = test.toMatrixPosition();
        console.log("Test Position:", test);
        const from = game.chessNotationToPos(bestMove.substring(0, 2));
        const to = game.chessNotationToPos(bestMove.substring(2, 4));
        console.log("AI bestMove:", bestMove, "from:", from, "to:", to);

        if (!from || !to) {
          console.error("Invalid positions:", { from, to, bestMove });
          return;
        }

        const piece = game.getBoard().getSquare(from).getPiece();
        if (!piece) {
          console.error("No piece at from position:", from);
          return;
        }

        const capturedPiece = game.getBoard().getSquare(to).getPiece() || null;
        dispatch({
          type: "MOVE",
          payload: {
            piece: piece,
            from: from,
            to: to,
          },
        });
      }
    };
    return () => engine.terminate();
  }, [trigger]);
  //===========================================

  React.useEffect(() => {
    turnRef.current = turn;
    updateTimers();

    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // for strict mode in development
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (game && game.checkGameOver()) {
      setTimeout(() => {
        onBack();
      }, 3000);
    }

    if (
      game &&
      game.getLastMove() &&
      playerModeRef.current === "pve" &&
      turnRef.current !== playerColorRef.current
    ) {
      setTimeout(() => {
        const moveHistory = game.getMoveHistory().map((m) => m.toChessNotation()).join(" ");
        console.log("AI thinking with moves:", moveHistory);
        engineRef.current.postMessage(`position startpos moves ${moveHistory}`);
        engineRef.current.postMessage(`go depth ${level}`);
      }, 500);
    }
    console.log("moves:", game.getMoveHistory());
  }, [turn]);
  //===========================================

  // Cleanup timer on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  //===========================================

  React.useEffect(() => {}, [selectedSquare]);
  //===========================================

  const handleSquareSelection = (row, col) => {
    if (
      playerModeRef.current === "pve" &&
      turnRef.current !== playerColorRef.current
    ) {
      return;
    }

    const pos = new Position(row, col);
    handlePieceSelection(pos);

    if (selectedPiece && selectedSquare) {
      const isValid =
        validMoves && Array.isArray(validMoves)
          ? validMoves.some((move) => move.row === row && move.col === col)
          : false;
      if (isValid) {
        dispatch({
          type: "MOVE",
          payload: {
            piece: selectedPiece,
            from: selectedSquare,
            to: pos,
          },
        });
      }
      //handlePieceSelection(pos);
      return;
    }
    // dispatch({
    //   type: "SELECT_SQUARE",
    //   payload: { row: row, col: col },
    // });
  };
  //===========================================

  const handlePieceSelection = (pos) => {
    if (!game) {
      return;
    }
    const { row, col } = pos;

    const square = game.getBoard().getSquare(pos);
    const isOccupied = square.isOccupied();

    if (!isOccupied) {
      return;
    }

    const piece = square.getPiece();
    const pieceColor = piece.getColor();
    const currentTurn = game.getCurrentTurn();

    if (pieceColor !== currentTurn) {
      return;
    }

    if (
      playerModeRef.current === "pve" &&
      currentTurn !== playerColorRef.current
    ) {
      return;
    }

    const moves = game.calcMoves(pos, piece);

    if (moves.length <= 0) {
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
  };

  const undoMove = () => {
    dispatch({ type: "UNDO" });
  };

  const redoMove = () => {
    dispatch({ type: "REDO" });
  };

  const resetGame = () => {
    dispatch({
      type: "RESET_GAME",
      payload: { playerColor },
    });
    setWhiteClock(timeLimit.value);
    setBlackClock(timeLimit.value);
    setTrigger(!trigger);
    // Reset timer references
    whiteElapsedRef.current = 0;
    blackElapsedRef.current = 0;
  };

  const updateTimers = () => {
    // Clear existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
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
  };

  const onPromotion = (pawn, newPiece) => {
    const pieceMap = {
      Queen,
      Rook,
      Bishop,
      Knight,
    };

    const PieceClass = pieceMap[newPiece];
    if (PieceClass && game && game.getLastMove()) {
      const promoted = new PieceClass(pawn.getColor());
      game.getBoard().setPiece(
        // game.getLastMove().actions[0].move.to.row,
        // game.getLastMove().actions[0].move.to.col,
        // promoted
        game.getLastMove().to,
        promoted
      );
      setPopupPiecePromotion(null);
    }
  };

  const handleTip = () => {
    if (game) {
      const moveHistory = game.getMoveHistory().map((m) => m.toChessNotation()).join(" ");
      engineRef.current.postMessage(`position startpos moves ${moveHistory}`);
      engineRef.current.postMessage(`go depth ${level}`);
      setShowRecommended(true);
      setTimeout(() => setShowRecommended(false), 4500); // 3*1.5 שניות
    }
  };

  return (
    <TurnContext.Provider value={{ turn, dispatch, lastMove }}>
      <div className="game">
        <div className="controls">
          <button className="button backBtn" onClick={onBack}>
            back
          </button>

          {game && game.getLastMove() && (
            <button className="button undoBtn" onClick={undoMove}>
              Undo Move
            </button>
          )}
          {game && game.getForwardMove() && (
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
          UPDATED CODE - Current Turn: {turn === "w" ? "White" : "Black"}
        </h3>
        {game && game.getWinner() && (
          <div className="winner-popup">
            <h3 className="winner-message">
              Winner: {game.getWinner() === "w" ? "White" : "Black"}
            </h3>
          </div>
        )}
        {game && (
          <ChessBoardLabels
            playerColor={playerColor}
            board={game.getBoard()}
            handleSquareClick={handleSquareSelection}
            isSelected={selectedSquareRaw}
            highlightedSq={validMoves || []}
            threatenedSq={threatenedSquares || []}
            lastMove={lastMove}
            recommendedMove={showRecommended ? recommendedMove : null}
          />
        )}
        {popupPiecePromotion && (
          <PawnPromotion piece={popupPiecePromotion} onPromote={onPromotion} />
        )}
        <button className="button rstBtn" onClick={resetGame}>
          new game
        </button>
        {playerMode === "pve" && (
          <button className="button tipBtn" onClick={handleTip}>
            💡
          </button>
        )}
        <div className="move-history">
          <h4>Move History</h4>
          <ul>
            {game && game.getMoveHistory().map((move, index) => (
              <li key={index}>{move.toChessNotation()}</li>
            ))}
          </ul>
        </div>
      </div>
    </TurnContext.Provider>
  );
};

export default GameComponent;
