import { Board } from "./Board.js";
import { Piece } from "./pieces/Piece.js";
import { Pawn } from "./pieces/Pawn.js";
import { King } from "./pieces/King.js";
import { Queen } from "./pieces/Queen.js";
import { Rook } from "./pieces/Rook.js";



export class Game {
    #board;
    #moveHistory = [];
    #currentTurn = 'w';
    #enemyColor = this.#currentTurn === 'w' ? 'b' : 'w';
    #gameOver = false;
    #winner = null;
    #draw = false;
    #kingPos;
    #treatMoves = [];
    #check = { w: false, b: false };
    #lastMove = null;
    #enPassant = null;
    #castling = { w: { kingside: false, queenside: false }, b: { kingside: false, queenside: false } };


    constructor() {
        this.#board = new Board();
        this.#kingPos = { b: { x: 4, y: 0 }, w: { x: 4, y: 7 } };
        this.#moveHistory = [];
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
            console.error("Checkmate! The game is over.");
            this.#gameOver = true;
            this.#winner = this.#currentTurn === 'w' ? 'b' : 'w';
            return true;

        } else if (this.isStalemate()) {
            console.error("Stalemate! The game is a draw.");
            this.#gameOver = true;
            this.#draw = true;
            return true;
        }
    }
    //===========================================

    getCurrentTurn() {
        return this.#currentTurn;
    }
    //===========================================

    isCheckmate() {
        if (!this.isInCheck(this.#currentTurn)) return false;
        console.log(this.#kingPos);
        // Get all legal moves for the current player
        const legalMoves = this.getAllLegalMoves(this.#currentTurn);
        if (legalMoves.length <= 0) {
            console.log("checkmate legal moves: ", legalMoves);
            console.log(legalMoves.length === 0);
        }
        return legalMoves.length === 0;
    }
    //===========================================

    isStalemate() {
        if (this.isInCheck(this.#currentTurn)) return false;
        const legalMoves = this.getAllLegalMoves(this.#currentTurn);
        if (legalMoves.length <= 0) {
            console.log("stalemate legal moves: ", legalMoves);
            console.log(legalMoves.length === 0);
        }

        return legalMoves.length === 0;
    }
    //===========================================

    isInCheck(color) {
        //const kingPos = this.#kingPos[color];
        const kingPos = this.#board.getKingPosition(color);
        const check = this.#board.getThreatenedSquares(color).some(sq => sq[0] === kingPos.y && sq[1] === kingPos.x);
        this.#check[color] = check;
        return check;
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

        if (piece instanceof Pawn) {
            this.promotePawnIfNeeded(toRow, toCol, piece);
            if (this.#enPassant && this.#enPassant.row === fromRow && this.#enPassant.col === fromCol && this.#enPassant.col !== toCol) {
                this.#board.setPiece(this.#enPassant.row, toCol, null);
                console.log("En passant captured:", this.#enPassant);
            }
        }

        if (piece instanceof King) {
            if (fromCol - toCol === 2) { // Castling move
                const rookCol = 0; // Determine rook's column
                const rook = this.#board.getPiece(fromRow, rookCol);
                if (rook && rook instanceof Rook && !rook._hasMoved) {
                    this.#board.setPiece(fromRow, toCol + 1, rook);
                    this.#board.setPiece(fromRow, rookCol, null);
                }
            }else if (toCol - fromCol === 2) { // Castling move
                const rookCol = 7; // Determine rook's column
                const rook = this.#board.getPiece(fromRow, rookCol);
                if (rook && rook instanceof Rook && !rook._hasMoved) {
                    this.#board.setPiece(fromRow, toCol - 1, rook);
                    this.#board.setPiece(fromRow, rookCol, null);
                }
            }
            this.updateKingPosition(toRow, toCol);
        }

        piece._hasMoved = true;

        this.#lastMove = { piece: piece, from: { row: fromRow, col: fromCol }, to: { row: toRow, col: toCol } };
        this.addMoveToHistory(this.#lastMove);

        //console.log(this.#moveHistory);

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
    // takes all the moves of a piece and checks if they are legal
    // by checking if the move does not put the king in check

    calcMoves(fromRow, fromCol, piece) {
        const validMoves = [];
        const legalMoves = piece.getLegalMoves(fromRow, fromCol, this.#board);
        //console.log(legalMoves);

        legalMoves.forEach(move => {
            const [row, col] = move;
            const tempBoard = this.#board.clone();
            tempBoard.movePiece(fromRow, fromCol, row, col);
            const kingPos = tempBoard.getKingPosition(this.#currentTurn);

            const isInCheck = tempBoard.getThreatenedSquares(this.#currentTurn).some(sq => sq[0] === kingPos.y && sq[1] === kingPos.x);
            if (!isInCheck) {
                validMoves.push(move);
            }
        });

        //add an passant for the pawn
        if (piece instanceof Pawn) {
            if (this.#lastMove && this.#lastMove.piece instanceof Pawn && this.#lastMove.piece.getColor() !== piece.getColor()) {
                var row = this.#lastMove.to.row;
                var col = this.#lastMove.to.col;
                if (this.#lastMove && Math.abs(this.#lastMove.from.row - this.#lastMove.to.row) === 2 && row === fromRow && Math.abs(col - fromCol) === 1 && piece.getColor() === this.#currentTurn) {
                    if (piece.getColor() === 'w') {
                        validMoves.push([fromRow - 1, col]);
                    } else {
                        validMoves.push([fromRow + 1, col]);
                    }
                    this.#enPassant = { row: fromRow, col: fromCol };
                }
            }
        }

        //add castling
        if (piece instanceof King) {
            const row = piece.getColor() === 'w' ? 7 : 0;
            if(!piece._hasMoved && !this.#board.getSquare(row, 5).isOccupied() && !this.#board.getSquare(row, 6).isOccupied()) {
                if(this.#board.getSquare(row, 7).isOccupied() && this.#board.getSquare(row, 7).getPiece() instanceof Rook && !this.#board.getSquare(row, 7).getPiece()._hasMoved) {
                    this.#castling[this.#currentTurn].kingside = true;
                    validMoves.push([row, 6]); // Kingside castling
                }
            }
            if(!piece._hasMoved && !this.#board.getSquare(row, 1).isOccupied() && !this.#board.getSquare(row, 2).isOccupied() && !this.#board.getSquare(row, 3).isOccupied()) {
                if(this.#board.getSquare(row, 0).isOccupied() && this.#board.getSquare(row, 0).getPiece() instanceof Rook && !this.#board.getSquare(row, 0).getPiece()._hasMoved) {
                    console.log(!this.#board.getSquare(row, 0).getPiece()._hasMoved);
                    
                    this.#castling[this.#currentTurn].queenside = true;
                    validMoves.push([row, 2]); // Queenside castling
                }
            }
        }

        return validMoves;
    }
    //===========================================

    promotePawnIfNeeded(row, col, piece) {
        if ((piece.getColor() === 'w' && row === 0) || (piece.getColor() === 'b' && row === 7)) {
            const promotedPiece = new Queen(piece.getColor(), 'q'); // Default to Queen promotion
            this.#board.setPiece(row, col, promotedPiece);
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

    getCheckStatus() {
        return this.#check;
    }
    //===========================================

    unduMove() {
        if (this.#moveHistory.length === 0) {
            console.error("No moves to undo.");
            return;
        }
        const lastMove = this.#moveHistory.pop();
        const from = lastMove.from;
        const to = lastMove.to;
        const piece = lastMove.piece;
        if (!piece) {
            console.error("Invalid undo: No piece at the destination square.");
            return;
        }
        this.#board.setPiece(from.row, from.col, piece);
        this.#board.setPiece(to.row, to.col, null);
        this.#lastMove = this.#moveHistory.length > 0 ? this.#moveHistory[this.#moveHistory.length - 1] : null;
        this.switchTurn();
    }
    //===========================================

    clone() {
        const newGame = new Game();
        newGame.#board = this.#board.clone();
        newGame.#moveHistory = [...this.#moveHistory];
        newGame.#currentTurn = this.#currentTurn;
        newGame.#enemyColor = this.#enemyColor;
        newGame.#gameOver = this.#gameOver;
        newGame.#winner = this.#winner;
        newGame.#draw = this.#draw;
        newGame.#kingPos = { ...this.#kingPos };
        newGame.#treatMoves = [...this.#treatMoves];
        newGame.#check = { ...this.#check };
        newGame.#lastMove = this.#lastMove ? { from: { ...this.#lastMove.from }, to: { ...this.#lastMove.to } } : null;
        return newGame;
    }
    //===========================================

    getLastMove() {
        return this.#lastMove;
    }
}