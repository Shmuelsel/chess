import { PieceType } from "../pieceConstants";
import { Piece } from "./Piece";
import { Position } from "../Position";


export class Knight extends Piece {
    constructor(color) {
        super(color, PieceType.KNIGHT);
    }

    getLegalMoves(pos, board) {
        const row = pos.row;
        const col = pos.col;
        const moves = [];
        const knightMoves = [
            [2, 1], [2, -1], [-2, 1], [-2, -1],
            [1, 2], [1, -2], [-1, 2], [-1, -2]
        ];

        for (const [dx, dy] of knightMoves) {
            const r = row + dx;
            const c = col + dy;
            if (r >= 0 && r < 8 && c >= 0 && c < 8) {
                if (!board.getSquare(new Position(r, c)).isOccupied() || 
                    board.getSquare(new Position(r, c)).getPiece().getColor() !== this._color) {
                moves.push(new Position(r, c));
                }
            }
        }
        return moves;
    }

    getThreatMoves(pos, board) {
        return this.getLegalMoves(pos, board);
    }

    getValue() {
        return 3;
    }

    clone() {
        return new Knight(this._color);
    }
}