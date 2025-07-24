import { PieceColor, Piecetype } from "./pieceConstants.js"
class King extends Piece{
    constructor(color){
        super(color, Piecetype.KING)
    }

    getLegalMoves(row, col, board){
       const directions = [
        [0, 1], [0, -1], [1, 0], [-1, 0],
        [1, 1], [1, -1], [-1, 1], [-1, -1]
       ]

       const moves = [];

       for(const [dx, dy] of directions){
        let r = row + dx;
        let c = col + dy;
        if (r >= 0 && r < 8 && c >= 0 && c < 8){
            //check if the dir is legal
            moves.push([dx, dy])
        }
       }
       return moves;
    }
    

    getThreatMoves(row, col, board){
        return getLegalMoves(row, col, board);
    }

    getValue() {
	return 0;
    }
}