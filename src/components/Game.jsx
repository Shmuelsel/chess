// import React from "react";
import React, { createContext, useContext} from "react";
import { Game } from "../logic/Game";
import { Board as boardLogic } from "../logic/Board";
import Board from "./Board";
import "./Game.css";

export const TurnContext = createContext();
export const useTurn = () => {
    return useContext(TurnContext);
}

const GameComponent = ({ onBack }) => {
    const [game, setGame] = React.useState(new Game());
    const [kingPosition, setKingPosition] = React.useState(game.getKingPosition());
    const [selectedSquare, setSelectedSquare] = React.useState(null);
    const [selectedPiece, setSelectedPiece] = React.useState(null);
    const [validMoves, setValidMoves] = React.useState([]);
    const [threatenedSquares, setThreatenedSquares] = React.useState([]);
    const [check, setCheck] = React.useState({ w: false, b: false });
    const [turn, setTurn] = React.useState(game.getCurrentTurn());

    

    const handleSquareSelection = (row, col) => {
        if (selectedPiece) {
            const isValid = validMoves.some(move => move[0] === row && move[1] === col);
            validMoves.forEach(move => {
            });
            if (!isValid) {
                console.log("not valid");
            }
            else {
                game.movePiece(selectedSquare.row, selectedSquare.col, row, col);
                setSelectedPiece(null);
                setSelectedSquare(null);
                setValidMoves([]);
                setThreatenedSquares(game.getBoard().getThreatenedSquares(game.getCurrentTurn()));
                game.switchTurn();
                setTurn(game.getCurrentTurn());
                
                setCheck(prev => ({
                    ...prev,
                    [game.getCurrentTurn()]: game.isInCheck()
                }));                
            }
        }

        if (game.getBoard().getSquare(row, col).isOccupied() && game.getBoard().getSquare(row, col).getPiece().getColor() === game.getCurrentTurn()) {
            const square = game.getBoard().getSquare(row, col);
            const piece = square.getPiece();
            const legalMoves = piece.getLegalMoves(row, col, game.getBoard());
            const validMoves = game.calcMoves(legalMoves, row, col, piece);
            
            if (validMoves.length <= 0) {
                console.error("No valid moves for the selected piece.");
                return;
            }
            setValidMoves(validMoves)
            setSelectedSquare({ row, col });
            setSelectedPiece(piece);
        }
    };

    
    return (
        <TurnContext.Provider value={{ turn, setTurn }}>

        <div className="game">
            <button onClick={onBack}> its start of new age</button>
            <Board
                board={game.getBoard()}
                handleSquareClick={handleSquareSelection}
                isSelected={selectedSquare}
                highlightedSq={validMoves}
                threatenedSq={threatenedSquares}
            />
        </div>
        </TurnContext.Provider>
    );
};

export default GameComponent;
