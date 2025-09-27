import { PieceType } from "../pieceConstants";
import { Piece } from "./Piece";
import { Position } from "../Position";


export class Queen extends Piece {
    constructor(color) {
        super(color, PieceType.QUEEN);
    }

    getLegalMoves(pos, board) {
        const row = pos.row;
        const col = pos.col;
        const directions = [
            [1, 0], [-1, 0], [0, 1], [0, -1],
            [1, 1], [-1, -1], [1, -1], [-1, 1]
        ];

        const moves = [];

        for (const [dx, dy] of directions) {
            let r = row + dx;
            let c = col + dy;
            while (r >= 0 && r < 8 && c >= 0 && c < 8) {
                if (board.getSquare(new Position(r, c)).isOccupied()) {
                    if (board.getSquare(new Position(r, c)).getPiece().getColor() !== this._color) {
                        moves.push(new Position(r, c));
                    }
                    break;
                }
                moves.push(new Position(r, c));
                r += dx;
                c += dy;
            }
        }
        //console.log("Queen legal moves: ", moves);

        return moves;
    }

    getThreatMoves(pos, board) {
        return this.getLegalMoves(pos, board);
    }

    getValue() {
        return 9;
    }

    clone() {
        return new Queen(this._color);
    }
}