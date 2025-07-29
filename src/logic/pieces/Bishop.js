import { PieceType } from "../pieceConstants";
import { Piece } from "./Piece";

export class Bishop extends Piece {
    constructor(color) {
        super(color, PieceType.BISHOP)
    }

    getLegalMoves(row, col, board) {
        const directions = [
            [1, 1], [-1, -1], [1, -1], [-1, 1]
        ]

        const moves = [];

        for (const [dx, dy] of directions) {
            let r = row + dx;
            let c = col + dy;
            while (r >= 0 && r < 8 && c >= 0 && c < 8) {
                if (board.getSquare(r, c).isOccupied()) {
                    if (board.getSquare(r, c).getPiece().getColor() !== this._color) {
                        moves.push(r, c);
                    }
                    break;
                }
                moves.push([r,c]);
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
        return 3;
    }

    clone() {
        return new Bishop(this._color);
    }
}