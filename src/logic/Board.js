import { Square } from "./Square";
import { Piece } from "./pieces/Piece";
import { Pawn } from "./pieces/Pawn";
import { King } from "./pieces/King";
import { Queen } from "./pieces/Queen";
import { Rook } from "./pieces/Rook";
import { Knight } from "./pieces/Knight";
import { Bishop } from "./pieces/Bishop";

export class Board {
    #squares = [];
    constructor() {
        this.#squares = Array.from({ length: 8 }, () => Array(8).fill(null));
        this.initializeBoard();
    }

    initializeBoard() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                this.#squares[row][col] = new Square(row, col);
            }
        }


        for (let col = 0; col < 8; col++) {
            this.#squares[1][col] = new Square(1, col, new Pawn('b', 'p')); // Black pawns
            this.#squares[6][col] = new Square(6, col, new Pawn('w', 'p')); // White pawns
        }
        // Initialize black pieces
        this.#squares[0][0] = new Square(0, 0, new Rook('b', 'r'));
        this.#squares[0][1] = new Square(0, 1, new Knight('b', 'n'));
        this.#squares[0][2] = new Square(0, 2, new Bishop('b', 'b'));
        this.#squares[0][3] = new Square(0, 3, new Queen('b', 'q'));
        this.#squares[0][4] = new Square(0, 4, new King('b', 'k'));
        this.#squares[0][5] = new Square(0, 5, new Bishop('b', 'b'));
        this.#squares[0][6] = new Square(0, 6, new Knight('b', 'n'));
        this.#squares[0][7] = new Square(0, 7, new Rook('b', 'r'));
        // Initialize white pieces
        this.#squares[7][0] = new Square(7, 0, new Rook('w', 'r'));
        this.#squares[7][1] = new Square(7, 1, new Knight('w', 'n'));
        this.#squares[7][2] = new Square(7, 2, new Bishop('w', 'b'));
        this.#squares[7][3] = new Square(7, 3, new Queen('w', 'q'));
        this.#squares[7][4] = new Square(7, 4, new King('w', 'k'));
        this.#squares[7][5] = new Square(7, 5, new Bishop('w', 'b'));
        this.#squares[7][6] = new Square(7, 6, new Knight('w', 'n'));
        this.#squares[7][7] = new Square(7, 7, new Rook('w', 'r'));
    }

    getPiece(row, col) {
        return this.#squares[row][col].getPiece();
    }

    setPiece(row, col, piece) {
        this.#squares[row][col].setPiece(piece);
    }

    getSquares() {
        return this.#squares;
    }

    getSquare(row, col) {
        //console.log(`Getting square at Row ${row}, Col ${col}`);
        //console.log(this.#squares);
        
        
        return this.#squares[row][col];
    }

    isOccupied(row, col) {
        return this.#squares[row][col].getPiece();
    }

    clone() {
        const newBoard = new Board();
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.#squares[row][col].getPiece();
                if (piece) {
                    newBoard.#squares[row][col] = new Square(row, col, piece.clone());
                } else {
                    newBoard.#squares[row][col] = new Square(row, col, null);
                }
            }
        }
        return newBoard;
    }

    resetBoard() {
        this.#squares = Array.from({ length: 8 }, () => Array(8).fill(null));
        this.initializeBoard();
    }

    getPieceKey(piece) {
        if (!piece) return null;
        return piece.getKey();
    }

    getPieceOfColor(color) {
        const pieces = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.#squares[row][col].getPiece();
                if (piece && piece.getColor() === color) {
                    pieces.push(piece);
                }
            }
        }
        return pieces;
    }

    getThreatenedSquares(color) {
        //console.log(color);
        
        const threatenedSquares = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.getPiece(row, col);
                console.log(piece, piece && piece.getColor());
                
                if (piece && piece.getColor() === color) {
                    //console.log(piece.getColor());
                    //console.log(color);
                    //console.log(true);
                    
                    const threatMoves = piece.getThreatMoves(row, col, this);
                    //console.log(piece);
                    
                    console.log(threatMoves);
                    
                    
                    for (const [r, c] of threatMoves) {
                        threatenedSquares.push([r, c]);
                    }
                }
            }
        }
        return threatenedSquares;
    }

}