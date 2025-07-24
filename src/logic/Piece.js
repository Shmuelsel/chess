import { PieceColor, Piecetype } from "./pieceConstants.js";

export class Piece {
    _type;
    _color;
    _hasMoved;

    constructor(type, color) {
        this._type = type;
        this._color = color;
        this._hasMoved = false;
    }

    getLegalMoves(row, col, board){
        throw new Error("you must override getLegalMoves() in the subclass");
    }

    getThreatMoves(row, col, board){
        throw new Error("you must override getThreatMoves() in the subclass");
    }

    getPieceKey(){
        return this._type + this._color;
    }

    getType(){
        return this._type;
    }

    getColor(){
        return this._color
    }

    getHassMoved(){
        return this._hasMoved
    }

    setHassMoved(bool){
        this._hasMoved = bool
    }

    
}