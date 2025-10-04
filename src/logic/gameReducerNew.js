import { Game } from "./Game";
import { Position } from "./Position";
import { Move } from "./Move";
import { GameMode, PlayerColor } from "./gameConstants";

export const getInitialState = (playerColor = PlayerColor.WHITE, playerMode = GameMode.PLAYER_VS_ENGINE) => {
  const game = new Game(playerColor, playerMode);
  return {
    game: game,
    turn: PlayerColor.WHITE,
    selectedSquare: null,
    selectedPiece: null,
    validMoves: [],
    threatenedSquares: [],
    lastMove: null,
    moves: [],
    redoMoves: [],
    updateCounter: 0,
    playerMode: playerMode,
    playerColor: playerColor,
  };
};

export function gameReducer(state, action) {
  try {
    const { game } = state;

    switch (action.type) {
      case "MOVE":
        const { piece: movePiece, from: moveFrom, to: moveTo, promotionType } = action.payload;
        const move = new Move(moveFrom, moveTo, movePiece, null, false, { kingside: false, queenside: false }, promotionType);
        const moveResult = game.movePiece(move);

        if (moveResult) {
          game.switchTurn();
        }

        const newMoves = game.getLastMove()
          ? [...state.moves, game.getLastMove().toChessNotation()]
          : state.moves;

        return {
          ...state,
          game,
          selectedPiece: null,
          selectedSquare: null,
          validMoves: [],
          threatenedSquares:
            game.getBoard().getThreatenedSquares(game.getCurrentTurn()) || [],
          turn: game.getCurrentTurn(),
          lastMove: game.getLastMove(),
          moves: newMoves,
          redoMoves: [],
          updateCounter: state.updateCounter + 1,
        };

      case "UNDO":
        if (state.moves.length === 0) {
          return state; // אין מהלכים לבטל
        }

        if (state.playerMode === GameMode.PLAYER_VS_ENGINE) {
          // במשחק נגד מנוע: תמיד בטל 2 מהלכים (מנוע + שחקן קודם)
          const movesToUndo = Math.min(2, state.moves.length);

          for (let i = 0; i < movesToUndo; i++) {
            game.undoMove();
          }

          const movesToSave = state.moves.slice(-movesToUndo);
          const undoMoves = state.moves.slice(0, -movesToUndo);
          const newRedoMoves = [...state.redoMoves, ...movesToSave];

          return {
            ...state,
            game,
            selectedPiece: null,
            selectedSquare: null,
            validMoves: [],
            threatenedSquares:
              game.getBoard().getThreatenedSquares(game.getCurrentTurn()) || [],
            turn: game.getCurrentTurn(),
            lastMove: game.getLastMove(),
            moves: undoMoves,
            redoMoves: newRedoMoves,
            updateCounter: state.updateCounter + 1,
          };
        } else {
          // במשחק שחקן נגד שחקן: בטל מהלך אחד
          game.undoMove();
          const lastMove = state.moves[state.moves.length - 1];
          const undoMoves = state.moves.slice(0, -1);
          const newRedoMoves = lastMove
            ? [...state.redoMoves, lastMove]
            : state.redoMoves;

          return {
            ...state,
            game,
            selectedPiece: null,
            selectedSquare: null,
            validMoves: [],
            threatenedSquares:
              game.getBoard().getThreatenedSquares(game.getCurrentTurn()) || [],
            turn: game.getCurrentTurn(),
            lastMove: game.getLastMove(),
            moves: undoMoves,
            redoMoves: newRedoMoves,
            updateCounter: state.updateCounter + 1,
          };
        }

      case "REDO":
        if (state.redoMoves.length === 0) {
          return state; // אין מהלכים לשחזר
        }

        if (state.playerMode === GameMode.PLAYER_VS_ENGINE) {
          // במשחק נגד מנוע: שחזר 2 מהלכים
          const movesToRedo = Math.min(2, state.redoMoves.length);

          for (let i = 0; i < movesToRedo; i++) {
            game.redoMove();
          }

          const movesToRestore = state.redoMoves.slice(-movesToRedo);
          const newMovesRedo = [...state.moves, ...movesToRestore];
          const newRedoMovesRedo = state.redoMoves.slice(0, -movesToRedo);

          return {
            ...state,
            game,
            selectedPiece: null,
            selectedSquare: null,
            validMoves: [],
            threatenedSquares:
              game.getBoard().getThreatenedSquares(game.getCurrentTurn()) || [],
            lastMove: game.getLastMove(),
            turn: game.getCurrentTurn(),
            moves: newMovesRedo,
            redoMoves: newRedoMovesRedo,
            updateCounter: state.updateCounter + 1,
          };
        } else {
          // במשחק שחקן נגד שחקן: שחזר מהלך אחד
          game.redoMove();
          const redoMove = state.redoMoves[state.redoMoves.length - 1];
          const newMovesRedo = [...state.moves, redoMove];
          const newRedoMovesRedo = state.redoMoves.slice(0, -1);

          return {
            ...state,
            game,
            selectedPiece: null,
            selectedSquare: null,
            validMoves: [],
            threatenedSquares:
              game.getBoard().getThreatenedSquares(game.getCurrentTurn()) || [],
            lastMove: game.getLastMove(),
            turn: game.getCurrentTurn(),
            moves: newMovesRedo,
            redoMoves: newRedoMovesRedo,
            updateCounter: state.updateCounter + 1,
          };
        }

      case "SELECT_PIECE":
        const { row: pieceRow, col: pieceCol, piece, moves } = action.payload;
        return {
          ...state,
          selectedSquare: new Position(pieceRow, pieceCol),
          selectedPiece: piece,
          validMoves: moves || [],
          threatenedSquares: state.threatenedSquares || [],
        };

      case "CLEAR_SELECTION":
        return {
          ...state,
          selectedSquare: null,
          selectedPiece: null,
          validMoves: [],
          threatenedSquares: state.threatenedSquares || [],
        };

      case "RESET_GAME":
        return getInitialState(
          action.payload?.playerColor || PlayerColor.WHITE,
          action.payload?.playerMode || GameMode.PLAYER_VS_ENGINE
        );

      default:
        return state;
    }
  } catch (error) {
    console.error("gameReducer error:", error);
    return state;
  }
}
