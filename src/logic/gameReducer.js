import { Game } from "./Game";

export function gameReducer(state, action) {
    switch (action.type) {
        case "MOVE":
            return {
                ...state,
            };
        case "UNDO":
            return {
                ...state,
                game: state.game.undoMove(),
                selectedPiece: null,
                selectedSquare: null,
                validMoves: [],
                threatenedSquares: state.game.getBoard().getThreatenedSquares(state.turn),
                //lastMove: null,
                //turn: lastMove ? lastMove.turn : state.turn,
                lastMove: state.game.getLastMove(),
                //redoMoves: [...state.redoMoves, lastMove],
            };

        case "REDO":
            return {
                ...state,
                
            };
        case "RESET_GAME":
            return initialState;
        default:
            return state;
    }
};

export const initialState = {
    game: new Game(),
    turn: "w",
    //historyMoves: [],
    selectedSquare: null,
    selectedPiece: null,
    validMoves: [],
    threatenedSquares: [],
    lastMove: null,

};
