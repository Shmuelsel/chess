import { Board } from "./Board.js";
import { Piece } from "./pieces/Piece.js";


export class Game{
    #board;
    #moveHistory = [];
    #currentTurn = 'w';
    #gameOver = false;
    #winner = null;
    #draw = false;
    #kingPos;
    #treatMoves = [];


    constructor() {
        this.#board = new Board();
        this.#kingPos = { w: { x: 4, y: 0 }, b: { x: 4, y: 7 } };
    }

    run() {
        // Start the game loop or any initial game setup here
    }

    reset() {
        this.#board.resetBoard();
        this.#moveHistory = [];
        this.#currentTurn = 'w';
        this.#gameOver = false;
        this.#winner = null;
        this.#draw = false;
    }

    checkGameOver() {

    }

    getCurrentTurn() {
        return this.#currentTurn;
    }

    isCheckmate() {
        // Logic to determine if the current player is in checkmate
    }

    isStalemate() {
        // Logic to determine if the game is in stalemate
    }

    isInCheck() {
        // Logic to determine if the current player is in check

    }

    getLegalMoves(row, col) {
        const piece = this.#board.getPiece(row, col);
        if (!piece || piece.getColor() !== this.#currentTurn) {
            return [];
        }
        return piece.getLegalMoves(row, col, this.#board);
    }

    addMoveToHistory(move) {
        this.#moveHistory.push(move);
    }

    getBoard() {
        return this.#board;
    }

    movePiece(fromRow, fromCol, toRow, toCol) {
        const piece = this.#board.getPiece(fromRow, fromCol);
        if (!piece || piece.getColor() !== this.#currentTurn) {
            console.error("Invalid move: No piece at the source square or not your turn.");
            return;
        }

        // Move the piece
        this.#board.setPiece(toRow, toCol, piece);
        this.#board.setPiece(fromRow, fromCol, null);
        this.addMoveToHistory({ from: { row: fromRow, col: fromCol }, to: { row: toRow, col: toCol } });

        // Switch turns
        this.switchTurn();
    }

    switchTurn() {
        this.#currentTurn = this.#currentTurn === 'w' ? 'b' : 'w';
    }


}