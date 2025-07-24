export class Square {
    constructor(row, col, piece = null) {
        this.row = row;
        this.col = col;
        this.piece = piece; 
    }

    setPiece(piece) {
        this.piece = piece;
    }

    getPiece() {
        return this.piece;
    }

    clone() {
        return new Square(this.row, this.col, this.piece ? this.piece.clone() : null);
    }
}