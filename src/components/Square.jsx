import React from "react";
import { Square as SquareLogic } from "../logic/Square";
import "./Square.css";

const Square = ({ square, onClick, row, col }) => {
    const [piece, setPiece] = React.useState(square.getPiece());

  return (
    <div
      className={`square ${row} ${col} `}
      onClick={onClick}
    >

    </div>
  );
};

export default Square;
