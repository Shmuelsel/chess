import { Piece } from "../logic/pieces/Piece";
import { PieceColor, PieceType } from "../logic/pieceConstants";
import React from "react";
import "./Piece.css";

const PieceComponent = ({ piece, row, col }) => {
    const pieceClass = `piece ${piece.getColor().toLowerCase()}-${piece.getType().toLowerCase()}`;
    
    return (
        <div className={pieceClass} style={{ top: row * 60, left: col * 60 }}>
        {piece.getType().charAt(0).toUpperCase()}
        </div>
    );
    }