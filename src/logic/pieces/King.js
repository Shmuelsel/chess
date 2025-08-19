import { PieceColor, PieceType } from "../pieceConstants.js"
import { Piece } from "./Piece";


export class King extends Piece {
    constructor(color) {
        super(color, PieceType.KING)
    }

    getLegalMoves(row, col, board) {
        const directions = [
            [0, 1], [0, -1], [1, 0], [-1, 0],
            [1, 1], [1, -1], [-1, 1], [-1, -1]
        ]

        const moves = [];

        for (const [dx, dy] of directions) {
            let r = row + dx;
            let c = col + dy;
            if (r >= 0 && r < 8 && c >= 0 && c < 8) {
                if ((!board.getSquare(r, c).isOccupied() ||
                    board.getSquare(r, c).getPiece().getColor() !== this._color) &&
                    !board.getSquare(r, c).getThreatened()) {
                    moves.push([r, c])
                }
            }
        }
        return moves;
    }


    getThreatMoves(row, col, board) {
        return this.getLegalMoves(row, col, board);
    }

    getValue() {
        return 0;
    }

    clone() {
        return new King(this._color);
    }

} 