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

        // Check for castling rights
        const castlingRights = this.getCastlingRights(board);
        if (castlingRights) {
            moves.push(...castlingRights);
        }
        //console.log(moves);

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

    getCastlingRights(board) {
        const castlingRights = [];
        const row = this._color === PieceColor.WHITE ? 7 : 0;

        // Check kingside castling
        if ((this._color === PieceColor.WHITE && this._color === 'w') || (this._color === PieceColor.BLACK && this._color === 'b')) {
            if (!this.getHasMoved() && board.getSquare(row, 7).isOccupied() && !board.getSquare(row, 0).isOccupied()) {
                castlingRights.push([row, 6]); // Kingside castling
            }
        }

        // Check queenside castling
        if ((this._color === PieceColor.WHITE && this._color === 'w') || (this._color === PieceColor.BLACK && this._color === 'b')) {
            if (!this.getHasMoved() && !board.getSquare(row, 3).isOccupied() &&  !board.getSquare(row, 2).isOccupied() && !board.getSquare(row, 1).isOccupied()) {
                castlingRights.push([row, 2]); // Queenside castling
            }
        }

        return castlingRights;
    }
} 