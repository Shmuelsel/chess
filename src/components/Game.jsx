// import React from "react";
import React, { createContext, useContext } from "react";
import { Game } from "../logic/Game";
import { Board as boardLogic } from "../logic/Board";
import Board from "./Board";
import "./Game.css";
import App from "./App";
import { MainMenu } from "./MainMenu";


export const TurnContext = createContext();
export const useTurn = () => {
    return useContext(TurnContext);
}

const GameComponent = ({ onBack }) => {

    // const [checkmate, setCheckmate] = React.useState(false);
    // const [check, setCheck] = React.useState({ w: false, b: false });
    // const [kingPosition, setKingPosition] = React.useState(game.getKingPosition());
    const [game, setGame] = React.useState(new Game());
    const [selectedSquare, setSelectedSquare] = React.useState(null);
    const [selectedPiece, setSelectedPiece] = React.useState(null);
    const [validMoves, setValidMoves] = React.useState([]);
    const [threatenedSquares, setThreatenedSquares] = React.useState([]);
    const [turn, setTurn] = React.useState(game.getCurrentTurn());
    const [lastMove, setLastMove] = React.useState(null);
    


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
                setLastMove({ from: selectedSquare, to: { row, col } });
                setValidMoves([]);
                var enemyColor = game.getCurrentTurn() === 'w' ? 'b' : 'w';
                setThreatenedSquares(game.getBoard().getThreatenedSquares(enemyColor));
                game.switchTurn();
                setTurn(game.getCurrentTurn());
                if (game.checkGameOver()) {
                    console.log("Game Over");
                    onBack();
                }
            }
        }

        if (game.getBoard().getSquare(row, col).isOccupied() && game.getBoard().getSquare(row, col).getPiece().getColor() === game.getCurrentTurn()) {
            const square = game.getBoard().getSquare(row, col);
            const piece = square.getPiece();
            const validMoves = game.calcMoves(row, col, piece);
            if (validMoves.length <= 0) {
                console.error("No valid moves for the selected piece.");
                return;
            }
            setValidMoves(validMoves)
            setSelectedSquare({ row, col });
            setSelectedPiece(piece);
            
        }
    };

    const unduMove = () => {
        game.unduMove();
        setGame(game);
        setSelectedPiece(null);
        setSelectedSquare(null);
        setValidMoves([]);
        setThreatenedSquares(game.getBoard().getThreatenedSquares(game.getCurrentTurn() === 'w' ? 'b' : 'w'));
        setTurn(game.getCurrentTurn());
        setLastMove(game.getLastMove());
    };


    return (
        <TurnContext.Provider value={{ turn, setTurn, lastMove }}>

            <div className="game">
                <button onClick={onBack}> back</button>
                {game.getLastMove() && <button onClick={unduMove}>Undu Move</button>}
                <Board
                    board={game.getBoard()}
                    handleSquareClick={handleSquareSelection}
                    isSelected={selectedSquare}
                    highlightedSq={validMoves}
                    threatenedSq={threatenedSquares}
                    lastMove={lastMove}
                />
            </div>
        </TurnContext.Provider>
    );
};

export default GameComponent;
