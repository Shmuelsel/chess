import React, { createContext, useContext } from "react";
import { Game } from "../logic/Game";
import Board from "./Board";
import "./Game.css";


export const TurnContext = createContext();
export const useTurn = () => {
    return useContext(TurnContext);
}

const GameComponent = ({ onBack, timeLimit }) => {

    const [game, setGame] = React.useState(new Game());
    const [selectedSquare, setSelectedSquare] = React.useState(null);
    const [selectedPiece, setSelectedPiece] = React.useState(null);
    const [validMoves, setValidMoves] = React.useState([]);
    const [threatenedSquares, setThreatenedSquares] = React.useState([]);
    const [turn, setTurn] = React.useState(game.getCurrentTurn());
    const [lastMove, setLastMove] = React.useState(null);
    const [whiteClock, setWhiteClock] = React.useState(timeLimit.value);
    const [blackClock, setBlackClock] = React.useState(timeLimit.value);
    const startTimeRef = React.useRef(Date.now());
    const whiteElapsedRef = React.useRef(0);
    const blackElapsedRef = React.useRef(0);

    React.useEffect(() => {
        startTimeRef.current = Date.now();

        const timer = setInterval(() => {
            const now = Date.now();
            const diff = (now - startTimeRef.current) / 1000; // הפרש בשניות
            startTimeRef.current = now;

            if (turn === 'w') {
                whiteElapsedRef.current += diff;

                if (whiteElapsedRef.current >= 1) {
                    setWhiteClock((prev) => Math.max(prev - 1, 0));
                    whiteElapsedRef.current = 0;
                }
            } else {
                blackElapsedRef.current += diff;

                if (blackElapsedRef.current >= 1) {
                    setBlackClock((prev) => Math.max(prev - 1, 0));
                    blackElapsedRef.current = 0;
                }
            }
        }, 100);

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

    const redoMove = () => {
        game.redoMove();
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
        setWhiteClock(timeLimit.value);
        setBlackClock(timeLimit.value);
    };

    return (
        <TurnContext.Provider value={{ turn, setTurn, lastMove }}>

            <div className="game">
                <div className="controls">
                    <button className="button backBtn" onClick={onBack}> back</button>
                    {game.getLastMove() && <button className="button undoBtn" onClick={undoMove}>Undo Move</button>}
                    {game.getForwardMove() && <button className="button redoBtn" onClick={redoMove}>Redo Move</button>}
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
                <button className="button rstBtn" onClick={resetGame}>new game</button>
                {/* <div className="last-move">{lastMove ? `Last Move: ${lastMove.actions.move.from.row} to ${lastMove.actions.move.to.row}` : ''}</div> */}
            </div>
        </TurnContext.Provider>
    );
};

export default GameComponent;
