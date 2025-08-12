import { Board } from "./Board.js";
import { Piece } from "./pieces/Piece.js";
import { Pawn } from "./pieces/Pawn.js";
import { King } from "./pieces/King.js";
import { Queen } from "./pieces/Queen.js";



export class Game {
    #board;
    #moveHistory = [];
    #currentTurn = 'w';
    #gameOver = false;
    #winner = null;
    #draw = false;
    #kingPos = { w: { x: 4, y: 0 }, b: { x: 4, y: 7 } };
    #treatMoves = [];


    constructor() {
        this.#board = new Board();
        this.#kingPos = { w: { x: 4, y: 0 }, b: { x: 4, y: 7 } };
    }
    //===========================================

    run() {
        // Start the game loop or any initial game setup here
    }
    //===========================================

    reset() {
        this.#board.resetBoard();
        this.#moveHistory = [];
        this.#currentTurn = 'w';
        this.#gameOver = false;
        this.#winner = null;
        this.#draw = false;
    }
    //===========================================

    checkGameOver() {
        if (this.isCheckmate()) {
            this.#gameOver = true;
            this.#winner = this.#currentTurn === 'w' ? 'b' : 'w';
        } else if (this.isStalemate()) {
            this.#gameOver = true;
            this.#draw = true;
        }

    }
    //===========================================

    getCurrentTurn() {
        return this.#currentTurn;
    }
    //===========================================

    isCheckmate() {
        if (!this.isInCheck()) return false;

        // Get all legal moves for the current player
        const legalMoves = this.getAllLegalMoves(this.#currentTurn);
        console.log("checkmate legal moves: ", legalMoves);
        
        return legalMoves.length === 0;
        
        
    }
    //===========================================

    isStalemate() {
        if (this.isInCheck()) return false;

        // Get all legal moves for the current player
        const legalMoves = this.#board.getAllLegalMoves(this.#currentTurn);
        return legalMoves.length === 0;
    }
    //===========================================

    isInCheck() {
        const kingPos = this.#kingPos[this.#currentTurn];
        return this.#board.getThreatenedSquares(this.#currentTurn).some(sq => sq[0] === kingPos.y && sq[1] === kingPos.x);
    }
    //===========================================

    getLegalMoves(row, col) {
        const piece = this.#board.getPiece(row, col);
        if (!piece || piece.getColor() !== this.#currentTurn) {
            return [];
        }
        return piece.getLegalMoves(row, col, this.#board);
    }
    //===========================================

    addMoveToHistory(move) {
        this.#moveHistory.push(move);
    }
    //===========================================

    getBoard() {
        return this.#board;
    }
    //===========================================

    movePiece(fromRow, fromCol, toRow, toCol) {
        const piece = this.#board.getPiece(fromRow, fromCol);
        if (!piece || piece.getColor() !== this.#currentTurn) {
            console.error("Invalid move: No piece at the source square or not your turn.");
            return;
        }

        this.#board.setPiece(toRow, toCol, piece);
        this.#board.setPiece(fromRow, fromCol, null);
        this.promotePawnIfNeeded(toRow, toCol, piece);
        this.addMoveToHistory({ from: { row: fromRow, col: fromCol }, to: { row: toRow, col: toCol } });
    }
    //===========================================

    switchTurn() {
        this.#currentTurn = this.#currentTurn === 'w' ? 'b' : 'w';
    }
    //===========================================

    getKingPosition() {
        return this.#kingPos;
    }
    //===========================================

    updateKingPosition(row, col) {
        this.#kingPos[this.#currentTurn] = { x: col, y: row };
    }
    //===========================================

    calcMoves(fromRow, fromCol, piece) {
        const validMoves = [];
        const legalMoves = piece.getLegalMoves(fromRow, fromCol, this.#board);
        legalMoves.forEach(move => {
            const [row, col] = move;
            const tempBoard = this.#board.clone();
            tempBoard.movePiece(fromRow, fromCol, row, col);
            const kingPos = tempBoard.getKingPosition(this.#currentTurn);
            const isInCheck = tempBoard.getThreatenedSquares(this.#currentTurn === 'w' ? 'b' : 'w').some(sq => sq[0] === kingPos.y && sq[1] === kingPos.x);
            if (!isInCheck) {
                validMoves.push(move);
            }
        });
        return validMoves;
    }
    //===========================================

    promotePawnIfNeeded(row, col, piece) {
        if (piece instanceof Pawn) {
            if ((piece.getColor() === 'w' && row === 0) || (piece.getColor() === 'b' && row === 7)) {
                const promotedPiece = new Queen(piece.getColor(), 'q'); // Default to Queen promotion
                this.#board.setPiece(row, col, promotedPiece);
            }
        }
    }
    //===========================================

    getAllLegalMoves(color) {
        const legalMoves = [];
        this.#board.getSquares().forEach((row, rowIndex) => {
            row.forEach((square, colIndex) => {
                const piece = square.getPiece();
                if (piece && piece.getColor() === color) {
                    const moves = this.calcMoves(rowIndex, colIndex, piece);
                    moves.forEach(move => {
                        legalMoves.push({ from: { row: rowIndex, col: colIndex }, to: { row: move[0], col: move[1] } });
                    });
                }
            });
        });
        return legalMoves;
    }
    //===========================================

    checkGameOver() {
        this.#treatMoves = this.#board.getThreatenedSquares(this.#currentTurn === 'w' ? 'b' : 'w');
        if (this.isCheckmate()) {
            this.#gameOver = true;
            this.#winner = this.#currentTurn === 'w' ? 'w' : 'b';
        } else if (this.isStalemate()) {
            this.#gameOver = true;
            this.#draw = true;
        }
    }
}