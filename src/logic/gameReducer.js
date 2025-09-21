import { Game } from "./Game";

export function gameReducer(state, action) {
    switch (action.type) {
        case "MOVE": {
            const { fromRow, fromCol, toRow, toCol } = action.payload;
            // צור עותק חדש של המשחק
            const newGame = state.game.clone();
            const moveResult = newGame.movePiece(fromRow, fromCol, toRow, toCol);

            if (moveResult) {
                newGame.switchTurn();
            }

            return {
                ...state,
                game: newGame,
                turn: newGame.getCurrentTurn(),
                selectedPiece: null,
                selectedSquare: null,
                validMoves: [],
                lastMove: newGame.getLastMove(),
                threatenedSquares: newGame
                    .getBoard()
                    .getThreatenedSquares(newGame.getCurrentTurn()),
                updateCounter: state.updateCounter + 1,
            };
        }

        case "UNDO": {
            const newGame = state.game.clone();
            newGame.undoMove();
            return {
                ...state,
                game: newGame,
                selectedPiece: null,
                selectedSquare: null,
                validMoves: [],
                threatenedSquares: newGame
                    .getBoard()
                    .getThreatenedSquares(newGame.getCurrentTurn()),
                turn: newGame.getCurrentTurn(),
                lastMove: newGame.getLastMove(),
                updateCounter: state.updateCounter + 1,
            };
        }

        case "REDO": {
            const newGame = state.game.clone();
            newGame.redoMove();
            return {
                ...state,
                game: newGame,
                selectedPiece: null,
                selectedSquare: null,
                validMoves: [],
                threatenedSquares: newGame
                    .getBoard()
                    .getThreatenedSquares(newGame.getCurrentTurn()),
                lastMove: newGame.getLastMove(),
                turn: newGame.getCurrentTurn(),
                updateCounter: state.updateCounter + 1,
            };
        }

        case "SELECT_PIECE": {
            const { row, col, piece, moves } = action.payload;
            return {
                ...state,
                selectedSquare: { row, col },
                selectedPiece: piece,
                validMoves: moves,
            };
        }

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
    //board: new Game(playerColor).board,
});