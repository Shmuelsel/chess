import { Game } from "./Game";

export function gameReducer(state, action) {
    const { game } = state;
    switch (action.type) {
        case "MOVE":
            const { fromRow, fromCol, toRow, toCol } = action.payload;
            const moveResult = game.movePiece(fromRow, fromCol, toRow, toCol);

            if (moveResult) {
                game.switchTurn();
            }

            return {
                ...state,
                game,
                turn: game.getCurrentTurn(),
                selectedPiece: null,
                selectedSquare: null,
                validMoves: [],
                lastMove: game.getLastMove(),
                threatenedSquares: game
                    .getBoard()
                    .getThreatenedSquares(game.getCurrentTurn()),
                updateCounter: state.updateCounter + 1,
            };

        case "UNDO":
            game.undoMove();
            return {
                ...state,
                game,
                selectedPiece: null,
                selectedSquare: null,
                validMoves: [],
                threatenedSquares: game
                    .getBoard()
                    .getThreatenedSquares(game.getCurrentTurn()),
                turn: game.getCurrentTurn(),
                lastMove: game.getLastMove(),
                updateCounter: state.updateCounter + 1,
            };

        case "REDO":
            game.redoMove();
            return {
                ...state,
                game,
                selectedPiece: null,
                selectedSquare: null,
                validMoves: [],
                threatenedSquares: game
                    .getBoard()
                    .getThreatenedSquares(game.getCurrentTurn()),
                lastMove: game.getLastMove(),
                turn: game.getCurrentTurn(),
                updateCounter: state.updateCounter + 1,
            };

        case "SELECT_PIECE":
            const { row, col, piece, moves } = action.payload;
            return {
                ...state,
                selectedSquare: { row, col },
                selectedPiece: piece,
                validMoves: moves,
            };

        case "CLEAR_SELECTION":
            return {
                ...state,
                selectedSquare: null,
                selectedPiece: null,
                validMoves: [],
            };

        case "RESET_GAME":
            return getInitialState(action.payload?.playerColor || "w");

        default:
            return state;
    }
}

export const getInitialState = (playerColor = "w") => ({
    game: new Game(playerColor),
    turn: "w",
    selectedSquare: null,
    selectedPiece: null,
    validMoves: [],
    threatenedSquares: [],
    lastMove: null,
    updateCounter: 0,
});
