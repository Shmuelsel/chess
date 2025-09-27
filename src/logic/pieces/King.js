import { PieceType } from "../pieceConstants.js"
import { Piece } from "./Piece";
import { Position } from "../Position.js";


export class King extends Piece {
    constructor(color) {
        super(color, PieceType.KING)
    }

    getLegalMoves(pos, board) {
        const row = pos.row;
        const col = pos.col;
        const directions = [
            [0, 1], [0, -1], [1, 0], [-1, 0],
            [1, 1], [1, -1], [-1, 1], [-1, -1]
        ]

        const moves = [];

        for (const [dx, dy] of directions) {
            let r = row + dx;
            let c = col + dy;
            if (r >= 0 && r < 8 && c >= 0 && c < 8) {
                if ((!board.getSquare(new Position(r, c)).isOccupied() ||
                    board.getSquare(new Position(r, c)).getPiece().getColor() !== this._color) &&
                    !board.getSquare(new Position(r, c)).getThreatened()) {
                    moves.push(new Position(r, c))
                }
            }
        }
        return moves;
    }


    getThreatMoves(pos, board) {
        return this.getLegalMoves(pos, board);
    }

    getValue() {
        return 0;
    }

    clone() {
        return new King(this._color);
    }

} 