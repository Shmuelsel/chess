import { Square } from "./Square";
export class Board {
    #squares = [];
    constructor() {
        this.#squares = Array.from({ length: 8 }, () => Array(8).fill(null));
        this.initializeBoard();
    }

    initializeBoard() {
        for (let col = 0; col < 8; col++) {
            this.#squares[1][col] = new Square(1, col, new Piece('b', 'p')); // Black pawns
            this.#squares[6][col] = new Square(6, col, new Piece('w', 'p')); // White pawns
        }
        // Initialize black pieces
        this.#squares[0][0] = new Square(0, 0, new Piece('b', 'r'));
        this.#squares[0][1] = new Square(0, 1, new Piece('b', 'n'));
        this.#squares[0][2] = new Square(0, 2, new Piece('b', 'b'));
        this.#squares[0][3] = new Square(0, 3, new Piece('b', 'q'));
        this.#squares[0][4] = new Square(0, 4, new Piece('b', 'k'));
        this.#squares[0][5] = new Square(0, 5, new Piece('b', 'b'));
        this.#squares[0][6] = new Square(0, 6, new Piece('b', 'n'));
        this.#squares[0][7] = new Square(0, 7, new Piece('b', 'r'));
        // Initialize white pieces
        this.#squares[7][0] = new Square(7, 0, new Piece('w', 'r'));
        this.#squares[7][1] = new Square(7, 1, new Piece('w', 'n'));
        this.#squares[7][2] = new Square(7, 2, new Piece('w', 'b'));
        this.#squares[7][3] = new Square(7, 3, new Piece('w', 'q'));
        this.#squares[7][4] = new Square(7, 4, new Piece('w', 'k'));
        this.#squares[7][5] = new Square(7, 5, new Piece('w', 'b'));
        this.#squares[7][6] = new Square(7, 6, new Piece('w', 'n'));
        this.#squares[7][7] = new Square(7, 7, new Piece('w', 'r'));
    }

    getPiece(row, col) {
        return this.#squares[row][col];
    }

    setPiece(row, col, piece) {
        this.#squares[row][col].setPiece(piece);
    }
        

    getSquare(row, col) {
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

    getPieceKey(piece){
        if (!piece) return null;
        return piece.getKey();
    }

    getPieceOfColor(color){
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

}