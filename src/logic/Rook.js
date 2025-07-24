import { Piecetype } from "./pieceConstants";
class Rook extends Piece {
    constructor(color) {
        super(color, Piecetype.ROOK);
    }

    getLegalMoves(row, col, board) {
        const directions = [
            [1, 0], [-1, 0], [0, 1], [0, -1]
        ];

        const moves = [];

        for (const [dx, dy] of directions) {
            let r = row + dx;
            let c = col + dy;
            while (r >= 0 && r < 8 && c >= 0 && c < 8) {
                // if (board.getSquare(r, c).isOccupied()) {
                //     if (board.getSquare(r, c).getPiece().getColor() !== this.color) {
                //         moves.push([r, c]);
                //     }
                //     break;
                // }
                moves.push([r, c]);
                r += dx;
                c += dy;
            }
        }
        return moves;
    }

    getThreatMoves(row, col, board) {
        return this.getLegalMoves(row, col, board);
    }

    getValue() {
        return 5;
    }

    clone() {
        return new Rook(this._color);
    }
}