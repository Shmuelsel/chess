import { PieceColor, Piecetype } from "./pieceConstants.js";

class Piece {
    #type;
    #color;
    #hasMoved;

    constructor(type, color) {
        this.#type = type;
        this.#color = this.color;
    }

    getLegalMoves(row, col, board){
        throw new Error("you must override getLegalMoves() in the subclass");
    }

    getThreatMoves(row, col, board){
        throw new Error("you must override getThreatMoves() in the subclass");
    }

    getPieceKey(){
        return this.#type + this.#color;
    }

    getType(){
        return this.#type;
    }

    getColor(){
        return this.#color
    }

    getHassMoved(){
        return this.#hasMoved
    }

    setHassMoved(bool){
        this.#hasMoved = bool
    }
}