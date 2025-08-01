import { PieceColor, PieceType } from "../logic/pieceConstants";
import React from "react";
import { PieceImages } from "../logic/pieceConstants";
import "./Piece.css";
const PieceComponent = ({ piece }) => {
    return (
            <div className="pieceImg-container">
                <img
                    src={PieceImages[piece.getType() + piece.getColor()]}
                    alt=""
                    className="piece-image"
                />
            </div>
    );
}

export default PieceComponent;