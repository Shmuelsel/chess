import { PieceColor, Piecetype } from "../pieceConstants.js"
class King extends Piece {
    constructor(color) {
        super(color, Piecetype.KING)
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
            // if (r >= 0 && r < 8 && c >= 0 && c < 8) {
            //     if ((!board.getSquare(r, c).isOccupied() || board.getSquare(r, c).getPiece() -> getColor() != color) && !board.getSquare(r, c).getThreatened()) {
            //         moves.push([dx, dy])
            //     }
            // }
        }
        return moves;
    }


    getThreatMoves(row, col, board) {
        return getLegalMoves(row, col, board);
    }

    getValue() {
        return 0;
    }

    clone() {
        return new King(_color);
    }
} 