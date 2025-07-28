//import { Piece as PieceLogic } from "../logic/pieces/Piece";
import { PieceColor, PieceType } from "../logic/pieceConstants";
import React from "react";
//import "./Piece.css";

const PieceComponent = ({ piece }) => {
    const type = piece.getType();
    const color = piece.getColor();
    return (
        <span className={`piece ${color}`}>{color}{type}</span>
    );
}

export default PieceComponent;