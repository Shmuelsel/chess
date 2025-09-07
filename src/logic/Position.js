export class Position{

    // constructor(chessNotation) {
    //     const letterToCol = (letter) => letter.charCodeAt(0) - 97;
    //     const match = chessNotation.match(/^([a-h])([1-8])$/);
    //     if (match) {
    //         col = letterToCol(match[1]);
    //         row = parseInt(match[2]) - 1;
    //         this(row, col);
    //     } else {
    //         throw new Error('Invalid chess notation');
    //     }
    // }

    // constructor(row, col) {
    //     this.row = row;
    //     this.col = col;
    // }

    constructor({ row, col, notation }) {
        if (notation) {
            const letterToCol = (letter) => letter.charCodeAt(0) - 97;
            this.row = parseInt(notation[1]) - 1;
            this.col = letterToCol(notation[0]);
        } else {
            this.row = row;
            this.col = col;
        }
    }

    toString() {
        return `(${this.row}, ${this.col})`;
    }

    toChessNotation() {
        const colToLetter = (col) => String.fromCharCode(col + 97);
        return `${colToLetter(this.col)}${this.row + 1}`;
    }
}