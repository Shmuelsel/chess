import { PieceType } from "../pieceConstants";
import { Piece } from "./Piece";


export class Knight extends Piece {
    constructor(color) {
        super(color, PieceType.KNIGHT);
    }

    getLegalMoves(row, col, board) {
        const moves = [];
        const knightMoves = [
            [2, 1], [2, -1], [-2, 1], [-2, -1],
            [1, 2], [1, -2], [-1, 2], [-1, -2]
        ];

        for (const [dx, dy] of knightMoves) {
            const r = row + dx;
            const c = col + dy;
            if (r >= 0 && r < 8 && c >= 0 && c < 8) {
                if (!board.getSquare(r, c).isOccupied() || 
                    board.getSquare(r, c).getPiece().getColor() !== this._color) {
                moves.push([r, c]);
                }
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
        return new Knight(this._color);
    }
}