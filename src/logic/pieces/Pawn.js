import { PieceType, PieceColor } from "../pieceConstants";
import { Piece } from "./Piece";
import { Position } from "../Position";

export class Pawn extends Piece {
    constructor(color) {
        super(color, PieceType.PAWN);
    }
    //===========================================
    
    getLegalMoves(pos, board) {
        const row = pos.row;
        const col = pos.col;

        const moves = [];
        const direction = this._color === PieceColor.WHITE ? -1 : 1;
        const startRow = this._color === PieceColor.WHITE ? 6 : 1;

        // Move forward by one square
        if (row + direction >= 0 && row + direction < 8 && !board.getSquare(new Position(row + direction, col)).isOccupied()) {
            moves.push(new Position(row + direction, col));
            // If on starting row, can move two squares forward
            if (row === startRow && row + 2 * direction >= 0 && row + 2 * direction < 8 && !board.getSquare(new Position(row + 2 * direction, col)).isOccupied()) {
                moves.push(new Position(row + 2 * direction, col));
                //moves.push([row + 2 * direction, col]);
            }
        }

        // Capture diagonally
        if (col > 0 && row + direction >= 0 && row + direction < 8 && board.getSquare(new Position(row + direction, col - 1)).isOccupied() &&
            board.getSquare(new Position(row + direction, col - 1)).getPiece().getColor() !== this._color) {
            moves.push(new Position(row + direction, col - 1));
        }
        if (col < 7 && row + direction >= 0 && row + direction < 8 && board.getSquare(new Position(row + direction, col + 1)).isOccupied() &&
            board.getSquare(new Position(row + direction, col + 1)).getPiece().getColor() !== this._color) {
            moves.push(new Position(row + direction, col + 1));
        }
        //console.log(moves);

        return moves;
    }
    //===========================================

    getThreatMoves(pos, board) {
        const row = pos.row;
        const col = pos.col;
        var threatMoves = [];
        var direction = this._color === PieceColor.WHITE ? -1 : 1;
        for (var dc = -1; dc <= 1; dc += 2) { // Check left and right captures
            if (col + dc >= 0 && col + dc < 8) {
                if (row + direction >= 0 && row + direction < 8 && board.getSquare(new Position(row + direction, col + dc)).isOccupied() && board.getSquare(new Position(row + direction, col + dc)).getPiece().getColor() !== this._color) {
                    threatMoves.push(new Position(row + direction, col + dc));
                }
            }
        }
        return threatMoves;
    }
    //===========================================

    getValue() {
        return 1;
    }
    //===========================================

    clone() {
        return new Pawn(this._color);
    }
}