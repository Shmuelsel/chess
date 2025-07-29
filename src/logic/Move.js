class Move {
    constructor(fromRow, fromCol, toRow, toCol) {
        this.fromRow = fromRow;
        this.fromCol = fromCol;
        this.toRow = toRow;
        this.toCol = toCol;

    }

    toString() {
        return `${this.piece.getKey()} from 
        (${this.fromRow}, ${this.fromCol}) to
         (${this.toRow}, ${this.toCol}) by
          ${this.player.getName()}`;
    }


}