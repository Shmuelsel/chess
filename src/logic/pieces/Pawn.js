import { PieceType, PieceColor } from "../pieceConstants";
import { Piece } from "./Piece";

export class Pawn extends Piece {
    constructor(color) {
        super(color, PieceType.PAWN);
    }

    getLegalMoves(row, col, board) {
        const moves = [];
        const direction = this._color === PieceColor.WHITE ? -1 : 1;
        const startRow = this._color === PieceColor.WHITE ? 6 : 1;

        // Move forward by one square
        if (row + direction >= 0 && row + direction < 8 && !board.getSquare(row + direction, col).isOccupied()) {
            moves.push([row + direction, col]);
            // If on starting row, can move two squares forward
            if (row === startRow && row + 2 * direction >= 0 && row + 2 * direction < 8) {
                moves.push([row + 2 * direction, col]);
            }
        }

        // Capture diagonally
        if (col > 0 && row + direction >= 0 && row + direction < 8 && board.getSquare(row + direction, col - 1).isOccupied() &&
            board.getSquare(row + direction, col - 1).getPiece().getColor() !== this._color) {
            moves.push([row + direction, col - 1]);
        }
        if (col < 7 && row + direction >= 0 && row + direction < 8 && board.getSquare(row + direction, col + 1).isOccupied()) {
            moves.push([row + direction, col + 1]);
        }
        return moves;
    }

    getThreatMoves(row, col, board) {
        console.error(row, col);
        var threatMoves = [];
        var direction = this._color === PieceColor.WHITE ? -1 : 1;
        for (var dc = -1; dc <= 1; dc += 2) { // Check left and right captures
            if (col + dc >= 0 && col + dc < 8) {
                if (row + direction >= 0 && row + direction < 8) {
                    threatMoves.push([row + direction, col + dc]);
                }
            }
        }
        //console.log(threatMoves);
        
        return threatMoves;
    }

    getValue() {
        return 1;
    }

    clone() {
        return new Pawn(this._color);
    }
}