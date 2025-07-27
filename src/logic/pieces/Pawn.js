import { PieceType } from "../pieceConstants";
class Pawn extends Piece {
    constructor(color) {
        super(color, PieceType.PAWN);
    }

    getLegalMoves(row, col, board) {
        const moves = [];
        const direction = this.color === PieceColor.WHITE ? 1 : -1;
        const startRow = this.color === PieceColor.WHITE ? 1 : 6;

        // Move forward by one square
        if (row + direction >= 0 && row + direction < 8) {
            moves.push([row + direction, col]);
            // If on starting row, can move two squares forward
            if (row === startRow && row + 2 * direction >= 0 && row + 2 * direction < 8) {
                moves.push([row + 2 * direction, col]);
            }
        }

        // Capture diagonally
        if (col > 0 && row + direction >= 0 && row + direction < 8) {
            moves.push([row + direction, col - 1]);
        }
        if (col < 7 && row + direction >= 0 && row + direction < 8) {
            moves.push([row + direction, col + 1]);
        }



        return moves;
    }

    getThreatMoves(row, col, board) {
        treatMoves = [];
        const direction = this.color === PieceColor.WHITE ? 1 : -1;
        if (col > 0 && row + direction >= 0 && row + direction < 8) {
            treatMoves.push([row + direction, col - 1]);
        }
        if (col < 7 && row + direction >= 0 && row + direction < 8) {
            treatMoves.push([row + direction, col + 1]);
        }
        return treatMoves;
    }

    getValue() {
        return 1;
    }

    clone() {
        return new Pawn(this._color);
    }
}