class Move {
    constructor(fromRow, fromCol, toRow, toCol, piece, player) {
        this.fromRow = fromRow;
        this.fromCol = fromCol;
        this.toRow = toRow;
        this.toCol = toCol;
        this.piece = piece; // The piece being moved
        this.player = player; // The player making the move
    }

    toString() {
        return `${this.piece.getKey()} from 
        (${this.fromRow}, ${this.fromCol}) to
         (${this.toRow}, ${this.toCol}) by
          ${this.player.getName()}`;
    }


}