import { Game } from "./Game";
import { Position } from "./Position";
import { Move } from "./Move";

export const getInitialState = (playerColor = "w") => {
  const game = new Game(playerColor);
  return {
    game: game,
    turn: "w",
    selectedSquare: null,
    selectedPiece: null,
    validMoves: [],
    threatenedSquares: [],
    lastMove: null,
    moves: [],
    redoMoves: [],
    updateCounter: 0,
  };
};

export function gameReducer(state, action) {
  try {
    const { game } = state;

    switch (action.type) {
      case "MOVE":
        const { piece: movePiece, from: moveFrom, to: moveTo } = action.payload;
        const move = new Move(moveFrom, moveTo, movePiece);
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
        game.undoMove();
        const lastMove = state.moves[state.moves.length - 1];
        const undoMoves = state.moves.slice(0, -2);
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

      case "REDO":
        game.redoMove();
        const redoMove = state.redoMoves[state.redoMoves.length - 1];
        const newMovesRedo = redoMove
          ? [...state.moves, redoMove]
          : state.moves;
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
        return getInitialState(action.payload?.playerColor || "w");

      default:
        return state;
    }
  } catch (error) {
    console.error("gameReducer error:", error);
    return state;
  }
}
