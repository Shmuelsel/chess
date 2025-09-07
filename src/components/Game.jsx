import React, { createContext, useContext } from "react";
import { Game } from "../logic/Game";
import Board from "./Board";
import "./Game.css";


export const TurnContext = createContext();
export const useTurn = () => {
    return useContext(TurnContext);
}

const GameComponent = ({ onBack, timeLimit, playerMode, playerColor, level }) => {

    const [game, setGame] = React.useState(new Game(playerColor));
    const [selectedSquare, setSelectedSquare] = React.useState(null);
    const [selectedPiece, setSelectedPiece] = React.useState(null);
    const [validMoves, setValidMoves] = React.useState([]);
    const [threatenedSquares, setThreatenedSquares] = React.useState([]);
    const [turn, setTurn] = React.useState("w");
    const [lastMove, setLastMove] = React.useState(null);
    const [whiteClock, setWhiteClock] = React.useState(timeLimit.value);
    const [blackClock, setBlackClock] = React.useState(timeLimit.value);
    const [trigger, setTrigger] = React.useState(false);
    //const [historyMoves, setHistoryMoves] = React.useState([]);

    const moves = React.useRef([]);
    const redoMoves = React.useRef([]);
    const engineRef = React.useRef(null);
    const startTimeRef = React.useRef(Date.now());
    const whiteElapsedRef = React.useRef(0);
    const blackElapsedRef = React.useRef(0);
    const playerModeRef = React.useRef(playerMode);
    const playerColorRef = React.useRef(playerColor);

    const firstRender = React.useRef(true);
    
    React.useEffect(() => {
        if (playerMode !== "pve") return;

        const engine = new Worker('/stockfish/stockfish-17.1-lite-single-03e3232.js');
        engine.postMessage('uci');

        if (playerColorRef.current === "w") {
            engineRef.current = engine;
        } else {
            setTimeout(() => {
                engine.postMessage('position startpos');
                engine.postMessage(`go depth ${level}`);
            }, 1000);
            engineRef.current = engine;
        }

        engine.onmessage = (e) => {
            if (e.data.startsWith("bestmove")) {
                console.log('Stockfish :', e.data);
                const bestMove = e.data.split(" ")[1];
                moves.current.push(bestMove);
                //setHistoryMoves(prev => [...prev, bestMove]);
                const from = game.chessNotationToPos(bestMove.substring(0, 2));
                const to = game.chessNotationToPos(bestMove.substring(2, 4));
                game.movePiece(from.row, from.col, to.row, to.col);
                game.switchTurn();
                setTurn(game.getCurrentTurn());
                if (game.checkGameOver()) {
                    console.log("Game Over");
                    setTimeout(() => {
                        onBack();
                    }, 3000);
                }
            }
        };

        return () => engine.terminate();
    }, [trigger]);



    React.useEffect(() => {
        startTimeRef.current = Date.now();

        const timer = setInterval(() => {
            const now = Date.now();
            const diff = (now - startTimeRef.current) / 1000;
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
                setLastMove(prev => game.getLastMove());

                moves.current.push(game.getLastMove().actions[0].moveChessNotation);
                //setHistoryMoves(prev => [...prev, game.getLastMove().actions[0].moveChessNotation]);
                console.log(game.getLastMove().actions[0].moveChessNotation);
                
                //console.log(historyMoves);
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
                if (playerModeRef.current === "pve") {
                    setTimeout(() => {
                        engineRef.current.postMessage(`position startpos moves ${moves.current.join(" ")}`);
                        //console.log(historyMoves);
                        
                        //engineRef.current.postMessage(`position startpos moves ${historyMoves.join(" ")}`);
                        engineRef.current.postMessage(`go depth ${level}`);
                    }, 1500);
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
        redoMoves.current.push(moves.current.pop());
        // setHistoryMoves(prev => {
        //     redoMoves.current.push(prev[prev.length - 1]);
        //     return prev.slice(0, -1);
        // });
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
        moves.current.push(redoMoves.current.pop());
        // setHistoryMoves(prev => {
        //     const nextMove = redoMoves.current.pop();
        //     return [...prev, nextMove];
        // });
    };

    const resetGame = () => {
        const newGame = new Game(playerColor);
        setGame(newGame);
        setSelectedPiece(null);
        setSelectedSquare(null);
        setValidMoves([]);
        setThreatenedSquares([]);
        setTurn(newGame.getCurrentTurn());
        setLastMove(null);
        setWhiteClock(timeLimit.value);
        setBlackClock(timeLimit.value);
        moves.current = [];
        redoMoves.current = [];
        //setHistoryMoves([]);
        setTrigger(!trigger);
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
                    playerColor={playerColor}
                    board={game.getBoard()}
                    handleSquareClick={handleSquareSelection}
                    isSelected={selectedSquare}
                    highlightedSq={validMoves}
                    threatenedSq={threatenedSquares}
                    lastMove={lastMove}
                />
                <button className="button rstBtn" onClick={resetGame}>new game</button>
                {/* <input id="history-moves" type="text" readOnly value={moves.current.join(", ")} /> */}
                <div className="move-history">
                    <h4>Move History</h4>
                    <ul>
                        {moves.current.map((move, index) => (
                            <li key={index}>{move}</li>
                        ))}
                    </ul>
                </div>
                {/* <div className="last-move">{lastMove ? `Last Move: ${lastMove.actions.move.from.row} to ${lastMove.actions.move.to.row}` : ''}</div> */}
            </div>
        </TurnContext.Provider>
    );
};

export default GameComponent;
