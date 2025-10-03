import React, { createContext, useContext, useReducer, useState, useCallback } from "react";
import { gameReducer, getInitialState } from "../logic/gameReducerNew";
import "./Game.css";
import { Move } from "../logic/Move";
import ChessBoardLabels from "./ChessBoardWithLabels";
import PawnPromotion from "./PawnPromotion";
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
    getInitialState(playerColor, playerMode, level)
  );

  // Extract from state
  const {
    game,
    //board,
    selectedSquare,
    selectedPiece,
    validMoves,
    threatenedSquares,
    turn,
    lastMove,
  } = state;

  // המר את selectedSquare ל-Position instance אם הוא קיים (עם memoization)
  //   const selectedSquare = React.useMemo(() => {
  //     if (!selectedSquareRaw) return null;

  //     // אם זה כבר Position object, החזר אותו כמו שהוא
  //     if (selectedSquareRaw instanceof Position) {
  //       return selectedSquareRaw;
  //     }

  //     // אחרת, צור Position חדש
  //     return new Position(selectedSquareRaw.row, selectedSquareRaw.col);
  //   }, [selectedSquareRaw]);

  const [whiteClock, setWhiteClock] = React.useState(timeLimit.value);
  const [blackClock, setBlackClock] = React.useState(timeLimit.value);
  const [trigger, setTrigger] = React.useState(false);
  const [popupPiecePromotion, setPopupPiecePromotion] = React.useState(null);
  const engineRef = React.useRef(null);
  const startTimeRef = React.useRef(Date.now());
  const whiteElapsedRef = React.useRef(0);
  const blackElapsedRef = React.useRef(0);
  const turnRef = React.useRef(turn);
  const timerRef = React.useRef(null);
  const bestMoveRef = React.useRef(null);

  const [recommendedMove, setRecommendedMove] = useState(null);
  const [showRecommended, setShowRecommended] = useState(false);
  //===========================================
  const updateTimers = useCallback(() => {
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
  }, [turn]);
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
    const opponentPlayer = game?.getOpponentPlayer();
    if (!opponentPlayer || !opponentPlayer.isEngine()) return;

    const engine = new Worker(
      "/stockfish/stockfish-17.1-lite-single-03e3232.js"
    );
    engine.postMessage("uci");

    setTimeout(() => {
      engine.postMessage("position startpos");
      engine.postMessage(`go depth ${opponentPlayer.getLevel()}`);
    }, 1000);

    engineRef.current = engine;

    engine.onmessage = (e) => {
      if (e.data.startsWith("bestmove")) {
        const bestMove = e.data.split(" ")[1];
        bestMoveRef.current = bestMove;
        
        const currentPlayer = game?.getCurrentPlayer();
        if (!currentPlayer || !currentPlayer.isEngine()) {
          const from = new Position(bestMove.substring(0, 2));
          const to = new Position(bestMove.substring(2, 4));
          setRecommendedMove(new Move(from, to));
          console.log("Recommended Move:", { from, to });
          dispatch({ type: "MOVE", payload: { from, to } });
          return;
        }

        if (!bestMove || bestMove.length < 4) {
          console.error("Invalid bestMove:", bestMove);
          return;
        }

        if (bestMove.length > 4) {
          const promotionType = bestMove.charAt(4);
          console.log("AI promotion type detected:", promotionType);
        }

        if (!game) {
          console.error("No game object available for AI move");
          return;
        }
        const from = game.chessNotationToPos(bestMove.substring(0, 2));
        const to = game.chessNotationToPos(bestMove.substring(2, 4));
        const promotionType = bestMove.length > 4 ? bestMove.charAt(4) : null;
        console.log("AI bestMove:", bestMove, "from:", from, "to:", to, "promotion:", promotionType);

        if (!from || !to) {
          console.error("Invalid positions:", { from, to, bestMove });
          return;
        }

        const piece = game.getBoard().getSquare(from).getPiece();
        if (!piece) {
          console.error("No piece at from position:", from);
          return;
        }

        dispatch({
          type: "MOVE",
          payload: {
            piece: piece,
            from: from,
            to: to,
            promotionType: promotionType,
          },
        });
      }
    };
    return () => engine.terminate();
  }, [trigger, game, dispatch]);
  //===========================================

  React.useEffect(() => {
    turnRef.current = turn;
    updateTimers();

    // if (firstRender.current) {
    //   firstRender.current = false;
    //   return;
    // }
    // // for strict mode in development
    // if (!mounted.current) {
    //   mounted.current = true;
    //   return;
    // }
    if (game && game.checkGameOver()) {
      setTimeout(() => {
        onBack();
      }, 3000);
    }

    const currentPlayer = game?.getCurrentPlayer();
    if (
      game &&
      game.getLastMove() &&
      currentPlayer &&
      currentPlayer.isEngine()
    ) {
      setTimeout(() => {
        const moveHistory = game
          .getMoveHistory()
          .map((m) => m.toChessNotation())
          .join(" ");
        console.log("AI thinking with moves:", moveHistory);
        engineRef.current.postMessage(`position startpos moves ${moveHistory}`);
        engineRef.current.postMessage(`go depth ${currentPlayer.getLevel()}`);
      }, 500);
    }
    console.log("moves:", game.getMoveHistory());
  }, [turn, game, onBack, updateTimers]);
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

  React.useEffect(() => {
    console.log("Selected Square changed:", selectedSquare);
  }, [selectedSquare]);
  //===========================================

  const handleSquareSelection = (row, col) => {
    const currentPlayer = game?.getCurrentPlayer();
    if (currentPlayer && currentPlayer.isEngine()) {
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
      return;
    }
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

    const currentPlayer = game?.getCurrentPlayer();
    if (currentPlayer && currentPlayer.isEngine()) {
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
  //===========================================
  const undoMove = () => {
    dispatch({ type: "UNDO" });
  };
  //===========================================
  const redoMove = () => {
    dispatch({ type: "REDO" });
  };
  //===========================================
  const resetGame = () => {
    dispatch({
      type: "RESET_GAME",
      payload: { playerColor, playerMode },
    });
    setWhiteClock(timeLimit.value);
    setBlackClock(timeLimit.value);
    setTrigger(!trigger);
    // Reset timer references
    whiteElapsedRef.current = 0;
    blackElapsedRef.current = 0;
  };
  //===========================================
  const onPromotion = (pawn, newPiece) => {
    const pieceTypeMap = {
      Queen: "q",
      Rook: "r",
      Bishop: "b",
      Knight: "n",
    };
    //===========================================
    const promotionType = pieceTypeMap[newPiece];
    if (promotionType && game && game.getLastMove()) {
      const lastMove = game.getLastMove();
      lastMove.promotionType = promotionType;
      game.promotePawn(lastMove.to.row, lastMove.to.col, pawn, promotionType);
      pawn._needPromotion = false;
      setPopupPiecePromotion(null);
    }
  };
  //===========================================
  const handleTip = () => {
    if (game) {
      const moveHistory = game
        .getMoveHistory()
        .map((m) => m.toChessNotation())
        .join(" ");
      engineRef.current.postMessage(`position startpos moves ${moveHistory}`);
      engineRef.current.postMessage(`go depth ${level}`);
      setShowRecommended(true);
      setTimeout(() => setShowRecommended(false), 4500); // 3*1.5 שניות
    }
  };
  //===========================================
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
            isSelected={selectedSquare}
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
        {(game?.getWhitePlayer()?.isEngine() || game?.getBlackPlayer()?.isEngine()) && (
          <button className="button tipBtn" onClick={handleTip}>
            💡
          </button>
        )}
        <div className="move-history">
          <h4>Move History</h4>
          <ul>
            {game &&
              game
                .getMoveHistory()
                .map((move, index) => (
                  <li key={index}>{move.toChessNotation()}</li>
                ))}
          </ul>
        </div>
      </div>
    </TurnContext.Provider>
  );
};

export default GameComponent;
