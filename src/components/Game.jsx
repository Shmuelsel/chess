import React, { createContext, useContext } from "react";
import { Game } from "../logic/Game";
import Board from "./Board";
import "./Game.css";


export const TurnContext = createContext();
export const useTurn = () => {
    return useContext(TurnContext);
}

const GameComponent = ({ onBack }) => {

    const [game, setGame] = React.useState(new Game());
    const [selectedSquare, setSelectedSquare] = React.useState(null);
    const [selectedPiece, setSelectedPiece] = React.useState(null);
    const [validMoves, setValidMoves] = React.useState([]);
    const [threatenedSquares, setThreatenedSquares] = React.useState([]);
    const [turn, setTurn] = React.useState(game.getCurrentTurn());
    const [lastMove, setLastMove] = React.useState(null);
    const [whiteClock, setWhiteClock] = React.useState(5 * 60);
    const [blackClock, setBlackClock] = React.useState(5 * 60);

    React.useEffect(() => {
        const timer = setInterval(() => {
            turn === 'w' ? setWhiteClock((prevClock) => prevClock - 1) : setBlackClock((prevClock) => prevClock - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [turn]);

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
                setLastMove(game.getLastMove());
                setValidMoves([]);
                var enemyColor = game.getCurrentTurn() === 'w' ? 'b' : 'w';
                setThreatenedSquares(game.getBoard().getThreatenedSquares(enemyColor));
                game.switchTurn();
                setTurn(game.getCurrentTurn());
                if (game.checkGameOver()) {
                    console.log("Game Over");
                    setTimeout(() => {
                        onBack();
                    }, 1000);
                }
            }
        }

        if (game.getBoard().getSquare(row, col).isOccupied() && game.getBoard().getSquare(row, col).getPiece().getColor() === game.getCurrentTurn()) {
            const square = game.getBoard().getSquare(row, col);
            const piece = square.getPiece();
            const validMoves = game.calcMoves(row, col, piece);
            //console.log(validMoves);

            if (validMoves.length <= 0) {
                console.error("No valid moves for the selected piece.");
                return;
            }
            setValidMoves(validMoves)
            setSelectedSquare({ row, col });
            setSelectedPiece(piece);

        }
    };

    const undoMove = () => {
        game.undoMove();
        setGame(game);
        setSelectedPiece(null);
        setSelectedSquare(null);
        setValidMoves([]);
        setThreatenedSquares(game.getBoard().getThreatenedSquares(game.getCurrentTurn() === 'w' ? 'b' : 'w'));
        setTurn(game.getCurrentTurn());
        setLastMove(game.getLastMove());
    };

    const resetGame = () => {
        const newGame = new Game();
        setGame(newGame);
        setSelectedPiece(null);
        setSelectedSquare(null);
        setValidMoves([]);
        setThreatenedSquares([]);
        setTurn(newGame.getCurrentTurn());
        setLastMove(null);
    };

    return (
        <TurnContext.Provider value={{ turn, setTurn, lastMove }}>

            <div className="game">
                <div className="controls">
                    <button onClick={onBack}> back</button>
                    {game.getLastMove() && <button onClick={undoMove}>Undo Move</button>}
                </div>
                <div className="clocks">
                    <div className="clock">
                        <h4>White's Time</h4>
                        <div className="timer">{Math.floor(whiteClock / 60).toString().padStart(2, '0')}:{(whiteClock % 60).toString().padStart(2, '0')}</div>
                    </div>
                    <div className="clock">
                        <h4>Black's Time</h4>
                        <div className="timer">{Math.floor(blackClock / 60).toString().padStart(2, '0')}:{(blackClock % 60).toString().padStart(2, '0')}</div>
                    </div>
                </div>
                <h3 className="turn-indicator">Current Turn: {turn === 'w' ? 'White' : 'Black'}</h3>
                {game.getWinner() && <div className="winner-popup">
                    <h3 className="winner-message">Winner: {game.getWinner() === 'w' ? 'White' : 'Black'}</h3>
                </div>}
                <Board
                    board={game.getBoard()}
                    handleSquareClick={handleSquareSelection}
                    isSelected={selectedSquare}
                    highlightedSq={validMoves}
                    threatenedSq={threatenedSquares}
                    lastMove={lastMove}
                />
                <button onClick={resetGame}>new game</button>
                {/* <div className="last-move">{lastMove ? `Last Move: ${lastMove.actions.move.from.row} to ${lastMove.actions.move.to.row}` : ''}</div> */}
            </div>
        </TurnContext.Provider>
    );
};

export default GameComponent;
