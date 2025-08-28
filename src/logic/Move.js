class Move {
    
    constructor(piece, from, to) {
        this.piece = piece;
        this.fromRow = from.row;
        this.fromCol = from.col;
        this.toRow = to.row;
        this.toCol = to.col;
    }

    toString() {
        return `${this.piece.getKey()} from 
        (${this.fromRow}, ${this.fromCol}) to
        (${this.toRow}, ${this.toCol})`;
    }




}