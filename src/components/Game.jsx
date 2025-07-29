import React from "react";
import { Game } from "../logic/Game";
import { Board as boardLogic } from "../logic/Board";
import Board from "./Board";
import "./Game.css";


const GameComponent = ({ onBack }) => {
    const [game, setGame] = React.useState(new Game());
    const [selectedSquare, setSelectedSquare] = React.useState(null);
    const [selectedPiece, setSelectedPiece] = React.useState(null);
    const [validMoves, setValidMoves] = React.useState([]);

    const handleSquareSelection = (row, col) => {
        if (selectedPiece) {
            if (game.getBoard().getSquare(row, col).isOccupied() && game.getBoard().getSquare(row, col).getPiece().getColor() === selectedPiece.getColor()) {
                console.log(`Selecting piece at Row ${row}, Col ${col}`);
                const square = game.getBoard().getSquare(row, col);
                const piece = square.getPiece();
                const leagalMoves = piece.getLegalMoves(row, col, game.getBoard());
                console.log(`Legal moves for selected piece: ${leagalMoves}`);

                if (leagalMoves.length <= 0) {
                    console.error("No valid moves for the selected piece.");
                    return;
                }
                setValidMoves(piece.getLegalMoves(row, col, game.getBoard()))
                setSelectedSquare({ row, col });
                setSelectedPiece(piece);
                console.log(`Selected piece: ${piece.getType()} at Row ${row}, Col ${col}`);
            }
            const isValid = validMoves.some(move => move[0] === row && move[1] === col);
            validMoves.forEach(move => {
            });
            if (!isValid) {
                console.log("not valid");
                console.log(row, col);
            }
            else {
                console.log(`Moving piece: ${selectedPiece.getType()} from Row ${selectedSquare.row}, Col ${selectedSquare.col} to Row ${row}, Col ${col}`);
                game.movePiece(selectedSquare.row, selectedSquare.col, row, col);
                setSelectedPiece(null);
                setSelectedSquare(null);
                setValidMoves([]);

            }

            return;
        }
        if (game.getBoard().getSquare(row, col).isOccupied() && game.getBoard().getSquare(row, col).getPiece().getColor() === game.getCurrentTurn()) {
            console.log(`Selecting piece at Row ${row}, Col ${col}`);
            const square = game.getBoard().getSquare(row, col);
            const piece = square.getPiece();
            const leagalMoves = piece.getLegalMoves(row, col, game.getBoard());
            console.log(`Legal moves for selected piece: ${leagalMoves}`);

            if (leagalMoves.length <= 0) {
                console.error("No valid moves for the selected piece.");
                return;
            }
            setValidMoves(piece.getLegalMoves(row, col, game.getBoard()))
            setSelectedSquare({ row, col });
            setSelectedPiece(piece);
            console.log(`Selected piece: ${piece.getType()} at Row ${row}, Col ${col}`);
        }
    };

    return (

        <div className="game">
            <button onClick={onBack}> its start of new age</button>
            <Board board={game.getBoard()} handleSquareClick={handleSquareSelection} isSelected={selectedSquare} highlightedSq={validMoves} />
        </div>
    );
};

export default GameComponent;
