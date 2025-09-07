import { Position } from "./Position";

export class Move {
    fromRow;
    fromCol;
    toRow;
    toCol;

    constructor(piece, from, to) {
        this.piece = piece;
        this.fromRow = from.row;
        this.fromCol = from.col;
        this.toRow = to.row;
        this.toCol = to.col;
    }

    // constructor(from, to) {
    //     //call to constructor(fromRow, fromCol, toRow, toCol)
    //     this(from.row, from.col, to.row, to.col);
    // }

    // constructor(fromRow, fromCol, toRow, toCol) {
    //     this.fromRow = fromRow;
    //     this.fromCol = fromCol;
    //     this.toRow = toRow;
    //     this.toCol = toCol;
    // }

    static buildMoveFromChessNotation(chessNotation, piece) {
        const letterToCol = (letter) => letter.charCodeAt(0) - 97;
        const match = chessNotation.match(/^([a-h])([1-8]) to ([a-h])([1-8])$/);
        if (match) {
            const fromCol = letterToCol(match[1]);
            const fromRow = parseInt(match[2]) - 1;
            const toCol = letterToCol(match[3]);
            const toRow = parseInt(match[4]) - 1;
            return new Move(piece, new Position(fromRow, fromCol), new Position(toRow, toCol));
        } else {
            throw new Error('Invalid chess notation');
        }
    }

    toString() {
        return `${this.piece.getKey()} from 
        (${this.fromRow}, ${this.fromCol}) to
        (${this.toRow}, ${this.toCol})`;
    }

    toChessNotation() {
        const colToLetter = (col) => String.fromCharCode(col + 97);
        return `${colToLetter(this.fromCol)}${this.fromRow + 1} to ${colToLetter(this.toCol)}${this.toRow + 1}`;
    }

}