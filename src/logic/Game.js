import { Board } from "./Board.js";
import { Pawn } from "./pieces/Pawn.js";
import { King } from "./pieces/King.js";
import { Rook } from "./pieces/Rook.js";
import { Position } from "./Position.js";
import { Move } from "./Move.js";

export class Game {
  #board;
  #moveHistory = [];
  #forwardMove = [];
  #currentTurn;
  #gameOver = false;
  #winner = null;
  #draw = false;
  #kingPos;
  #treatMoves = [];
  #check = { w: false, b: false };
  #lastMove = null;
  #enPassant = null;
  #playerColor = "w";
  #castling = {
    w: { kingside: false, queenside: false },
    b: { kingside: false, queenside: false },
  };

  constructor(
    playerColor = "w",
    gameMode = { type: "pve", aiLevel: "medium" }
  ) {
    this.#playerColor = playerColor;
    this.#currentTurn = "w";
    this.#board = new Board(playerColor);
    this.#kingPos = { b: { x: 4, y: 0 }, w: { x: 4, y: 7 } };
    this.#moveHistory = [];
    this.#forwardMove = [];
    this.#lastMove = null;
  }
  //===========================================

  run() {
    // Start the game loop or any initial game setup here
  }
  //===========================================

  reset() {
    this.#board.resetBoard();
    this.#moveHistory = [];
    this.#lastMove = null;
    this.#currentTurn = "w";
    this.#gameOver = false;
    this.#winner = null;
    this.#draw = false;
  }
  //===========================================

  checkGameOver() {
    if (this.isCheckmate()) {
      console.error("Checkmate! The game is over.");
      this.#gameOver = true;
      this.#winner = this.#currentTurn === "w" ? "b" : "w";
      return true;
    } else if (this.isStalemate()) {
      console.error("Stalemate! The game is a draw.");
      this.#gameOver = true;
      this.#draw = true;
      return true;
    }
  }
  //===========================================

  getCurrentTurn() {
    return this.#currentTurn;
  }
  //===========================================

  isCheckmate() {
    if (!this.isInCheck(this.#currentTurn)) return false;
    console.log(this.#kingPos);
    // Get all legal moves for the current player
    const legalMoves = this.getAllLegalMoves(this.#currentTurn);
    if (legalMoves.length <= 0) {
      console.log("checkmate legal moves: ", legalMoves);
      console.log(legalMoves.length === 0);
    }
    return legalMoves.length === 0;
  }
  //===========================================

  isStalemate() {
    if (this.isInCheck(this.#currentTurn)) return false;
    const legalMoves = this.getAllLegalMoves(this.#currentTurn);
    if (legalMoves.length <= 0) {
      console.log("stalemate legal moves: ", legalMoves);
      console.log(legalMoves.length === 0);
    }

    return legalMoves.length === 0;
  }
  //===========================================

  isInCheck(color) {
    //const kingPos = this.#kingPos[color];
    const kingPos = this.#board.getKingPosition(color);
    const check = this.#board
      .getThreatenedSquares(color)
      .some((sq) => sq.row === kingPos.y && sq.col === kingPos.x);
    this.#check[color] = check;
    return check;
  }
  //===========================================

  getLegalMoves(pos) {
    const piece = this.#board.getPiece(pos);
    if (!piece || piece.getColor() !== this.#currentTurn) {
      return [];
    }
    return piece.getLegalMoves(pos.row, pos.col, this.#board);
  }
  //===========================================

  addMoveToHistory(move) {
    this.#moveHistory.push(move);
  }
  //===========================================

  getBoard() {
    return this.#board;
  }
  //===========================================

  movePiece(move) {
    console.log("movePiece called with:", move);

    if (!move || !move.from || !move.to) {
      console.error("Invalid move object:", move);
      return false;
    }

    const from = move.from;
    const to = move.to;

    const piece = this.#board.getPiece(move.from);

    if (!piece || piece.getColor() !== this.#currentTurn) {
      return false;
    }

    // עדכן את הכלי שנתפס במהלך
    const capturedPiece = this.#board.getPiece(move.to);
    move.capturedPiece = capturedPiece;

    this.#board.setPiece(to, piece);
    this.#board.setPiece(from, null);

    this.#lastMove = move;

    if (piece instanceof Pawn) {
      this.movePieceAnPassant(move, piece);
    }

    if (piece instanceof King) {
      this.movePieceCastling(move);
    }

    piece._hasMoved = true;
    piece.incrementNumMoves();
    this.addMoveToHistory(this.#lastMove);
    this.#forwardMove = [];
    return true;
  }
  //===========================================
  movePieceAnPassant(move, piece) {
    const from = move.from;
    const to = move.to;

    //const piece = this.#board.getPiece(fromRow, fromCol);

    var capturePiece = this.#board.getPiece(to)
      ? this.#board.getPiece(to)
      : null;

    this.promotePawnIfNeeded(to.row, to.col, piece);

    if (
      this.#enPassant &&
      this.#enPassant.row === from.row &&
      this.#enPassant.col === from.col &&
      this.#enPassant.col !== to.col
    ) {
      capturePiece = this.#board.getPiece(
        new Position(this.#enPassant.row, to.col)
      );
      this.#lastMove.capture = capturePiece;
      move.capturedPiece = capturePiece;
      move.isEnPassant = true;

      console.log("En passant captured:", capturePiece);

      this.#lastMove.special = "en passant";
      this.#board.setPiece(new Position(this.#enPassant.row, to.col), null);
      console.log("En passant captured:", this.#enPassant);
    }
  }
  //===========================================

  movePieceCastling(move) {
    const from = move.from;
    const to = move.to;

    if (from.col - to.col === 2) {
      // Castling move
      const rookCol = 0; // Determine rook's column
      const rook = this.#board.getPiece(from.row, rookCol);
      if (rook && rook instanceof Rook && !rook._hasMoved) {
        this.#board.setPiece(new Position(from.row, to.col + 1), rook);
        this.#lastMove.special = "queenside castling";
        move.isCastling.queenside = true;
        this.#lastMove.actions.push({
          piece: rook,
          move: {
            from: { row: from.row, col: rookCol },
            to: { row: from.row, col: to.col + 1 },
          },
        });
        rook.incrementNumMoves();
        this.#board.setPiece(new Position(from.row, rookCol), null);
      }
    } else if (to.col - from.col === 2) {
      // Castling move
      const rookCol = 7; // Determine rook's column
      const rook = this.#board.getPiece(new Position(from.row, rookCol));
      if (rook && rook instanceof Rook && !rook._hasMoved) {
        this.#board.setPiece(new Position(from.row, to.col - 1), rook);
        this.#lastMove.special = "kingside castling";
        move.isCastling.kingside = true;
        // this.#lastMove.actions.push({
        //   piece: rook,
        //   move: {
        //     from: { row: from.row, col: rookCol },
        //     to: { row: from.row, col: to.col - 1 },
        //   },
        // });

        rook.incrementNumMoves();
        this.#board.setPiece(new Position(from.row, rookCol), null);
      }
    }
    this.updateKingPosition(to.row, to.col);
  }
  //===========================================

  switchTurn() {
    this.#currentTurn = this.#currentTurn === "w" ? "b" : "w";
  }
  //===========================================

  getKingPosition() {
    return this.#kingPos;
  }
  //===========================================

  updateKingPosition(row, col) {
    this.#kingPos[this.#currentTurn] = { x: col, y: row };
  }
  //===========================================
  // takes all the moves of a piece and checks if they are legal
  // by checking if the move does not put the king in check

  calcMoves(pos, piece) {
    const validMoves = [];
    const legalMoves = piece.getLegalMoves(pos, this.#board);

    legalMoves.forEach(({ row, col }) => {
      const move = new Move(pos, new Position(row, col), piece );
      const tempBoard = this.#board.clone();
      tempBoard.movePiece(move);
      const kingPos = tempBoard.getKingPosition(this.#currentTurn);

      const isInCheck = tempBoard
        .getThreatenedSquares(this.#currentTurn)
        .some((sq) => sq.row === kingPos.y && sq.col === kingPos.x);
      if (!isInCheck) {
        validMoves.push(new Position(row, col));
      }
    });

    if (piece instanceof Pawn && this.#lastMove) {
      this.calcEnPassant(validMoves, pos, piece);
    }

    if (piece instanceof King) {
      this.calcCastling(validMoves, pos, piece);
    }

    return validMoves;
  }
  //===========================================

  calcEnPassant(validMoves, pos, piece) {
    //add an passant for the pawn
    const fromRow = pos.row;
    const fromCol = pos.col;
    var lastMovePiece = this.#lastMove.piece;
    if (
      lastMovePiece instanceof Pawn &&
      lastMovePiece.getColor() !== piece.getColor()
    ) {
      var lastMoveFromRow = this.#lastMove.from.row;
      var lastMoveToRow = this.#lastMove.to.row;
      var lastMoveToCol = this.#lastMove.to.col;
      if (
        Math.abs(lastMoveFromRow - lastMoveToRow) === 2 &&
        lastMoveToRow === fromRow &&
        Math.abs(lastMoveToCol - fromCol) === 1 &&
        piece.getColor() === this.#currentTurn
      ) {
        if (piece.getColor() === "w") {
          validMoves.push(new Position(fromRow - 1, lastMoveToCol));
        } else {
          validMoves.push(new Position(fromRow + 1, lastMoveToCol));
        }

        this.#enPassant = { row: fromRow, col: fromCol };
      }
    }
  }
  //===========================================

  calcCastling(validMoves, pos, piece) {
    //add castling
    const row = piece.getColor() === "w" ? 7 : 0;
    const posKingSide1 = new Position(row, 5);
    const posKingSide2 = new Position(row, 6);
    const posRookKingSide = new Position(row, 7);
    if (
      !piece._hasMoved &&
      !this.#board.getSquare(posKingSide1).isOccupied() &&
      !this.#board.getSquare(posKingSide2).isOccupied() &&
      !this.#board
        .getThreatenedSquares(this.getCurrentTurn())
        .some(
          (sq) =>
            sq.row === row && (sq.col === 4 || sq.col === 5 || sq.col === 6)
        )
    ) {
      if (
        this.#board.getSquare(posRookKingSide).isOccupied() &&
        this.#board.getSquare(posRookKingSide).getPiece() instanceof Rook &&
        !this.#board.getSquare(posRookKingSide).getPiece()._hasMoved
      ) {
        this.#castling[this.#currentTurn].kingside = true;
        validMoves.push(new Position(row, 6)); // Kingside castling
      }
    }
    if (
      !piece._hasMoved &&
      !this.#board.getSquare(new Position(row, 1)).isOccupied() &&
      !this.#board.getSquare(new Position(row, 2)).isOccupied() &&
      !this.#board.getSquare(new Position(row, 3)).isOccupied() &&
      !this.#board
        .getThreatenedSquares(this.getCurrentTurn())
        .some(
          (sq) =>
            sq.row === row &&
            (sq.col === 1 || sq.col === 2 || sq.col === 3 || sq.col === 4)
        )
    ) {
      if (
        this.#board.getSquare(new Position(row, 0)).isOccupied() &&
        this.#board.getSquare(new Position(row, 0)).getPiece() instanceof
        Rook &&
        !this.#board.getSquare(new Position(row, 0)).getPiece()._hasMoved
      ) {
        this.#castling[this.#currentTurn].queenside = true;
        validMoves.push(new Position(row, 2)); // Queenside castling
      }
    }
  }

  //===========================================

  promotePawnIfNeeded(row, col, piece) {
    console.log(piece);

    if (
      (piece.getColor() === "w" && row === 0) ||
      (piece.getColor() === "b" && row === 7)
    ) {
      // const promotedPiece = new Queen(piece.getColor(), "q"); // Default to Queen promotion
      // this.#board.setPiece(row, col, promotedPiece);
      piece._needPromotion = true;
    }
  }
  //===========================================

  getAllLegalMoves(color) {
    const legalMoves = [];
    this.#board.getSquares().forEach((row, rowIndex) => {
      row.forEach((square, colIndex) => {
        const piece = square.getPiece();
        if (piece && piece.getColor() === color) {
          const pos = new Position(rowIndex, colIndex);
          const moves = this.calcMoves(pos, piece);
          moves.forEach((move) => {
            legalMoves.push({
              from: { row: rowIndex, col: colIndex },
              to: { row: move.row, col: move.col },
            });
          });
        }
      });
    });
    return legalMoves;
  }
  //===========================================

  getCheckStatus() {
    return this.#check;
  }
  //===========================================

  undoMove() {
    console.log("Undoing move...");
    
    if (this.#moveHistory.length === 0) {
      console.error("No moves to undo.");
      return;
    }
    if (this.#winner) {
      this.#winner = null;
    }
    const lastMove = this.#moveHistory.pop();
    const piece = lastMove.piece;
    this.#board.setPiece(lastMove.from, piece);

    if (lastMove.capturedPiece) {
      if (lastMove.isEnPassant) {
        const direction = piece.getColor() === "w" ? 1 : -1;
        this.#board.setPiece(
          new Position(lastMove.to.row + direction, lastMove.to.col),
          lastMove.capturedPiece
        );
        this.#board.setPiece(lastMove.to, null);
      } else {
        this.#board.setPiece(lastMove.to, lastMove.capturedPiece);
      }
    } else {
      this.#board.setPiece(lastMove.to, null);
    }
    
    // אם היה הצרחה החזר את הצריח למקומו
    if (lastMove.isCastling) {
      if (lastMove.isCastling.kingside) {
        const rook = this.#board.getPiece(new Position(lastMove.from.row, 5));
        this.#board.setPiece(new Position(lastMove.from.row, 7), rook);
        this.#board.setPiece(new Position(lastMove.from.row, 5), null);
        rook.decrementNumMoves();
      }else if (lastMove.isCastling.queenside) {
        const rook = this.#board.getPiece(new Position(lastMove.from.row, 3));
        this.#board.setPiece(new Position(lastMove.from.row, 0), rook);
        this.#board.setPiece(new Position(lastMove.from.row, 3), null);
        rook.decrementNumMoves();
      }
    }

    // עדכן את מצב הכלי
    piece.decrementNumMoves();
    if (piece.getNumMoves() === 0) {
      piece.setHasMoved(false);
    }

    this.#forwardMove.push(lastMove);

    this.#lastMove =
      this.#moveHistory.length > 0
        ? this.#moveHistory[this.#moveHistory.length - 1]
        : null;
    this.switchTurn();
  }
  //===========================================

  redoMove() {
    if (this.#forwardMove.length === 0) {
      console.error("No moves to redo.");
      return;
    }
    // console.log("Forward moves:", this.#forwardMove);
    const moveToRedo = this.#forwardMove.pop();
    // for (let i = 0; i < this.#forwardMove.length; i++) {
    //   const moveToRedo = this.#forwardMove[this.#forwardMove.length - 1 - i];
    //   console.log("Redoing move:", moveToRedo);
      
    //   this.movePiece(moveToRedo);
    // }

    // בצע את המהלך מחדש
    const piece = moveToRedo.piece;
    this.#board.setPiece(moveToRedo.to, piece);
    this.#board.setPiece(moveToRedo.from, null);
    piece.incrementNumMoves();

    if (moveToRedo.isCastling) {
      if (moveToRedo.isCastling.kingside) {
        const rook = this.#board.getPiece(new Position(moveToRedo.from.row, 7));
        this.#board.setPiece(new Position(moveToRedo.from.row, 5), rook);
        this.#board.setPiece(new Position(moveToRedo.from.row, 7), null);
        rook.decrementNumMoves();
      } else if (moveToRedo.isCastling.queenside) {
        const rook = this.#board.getPiece(new Position(moveToRedo.from.row, 3));
        this.#board.setPiece(new Position(moveToRedo.from.row, 0), rook);
        this.#board.setPiece(new Position(moveToRedo.from.row, 3), null);
        rook.decrementNumMoves();
      }
    }

    this.#moveHistory.push(moveToRedo);
    this.#lastMove =
      this.#moveHistory.length > 0
        ? this.#moveHistory[this.#moveHistory.length - 1]
        : null;
    this.switchTurn();
  }
  //===========================================

  clone() {
    const newGame = new Game();
    newGame.#board = this.#board.clone();
    newGame.#moveHistory = [...this.#moveHistory];
    newGame.#currentTurn = this.#currentTurn;
    // newGame.#enemyColor = this.#enemyColor;
    newGame.#gameOver = this.#gameOver;
    newGame.#winner = this.#winner;
    newGame.#draw = this.#draw;
    newGame.#kingPos = { ...this.#kingPos };
    newGame.#treatMoves = [...this.#treatMoves];
    newGame.#check = { ...this.#check };
    newGame.#lastMove = this.#lastMove
      ? {
        from: new Position(this.#lastMove.from.row, this.#lastMove.from.col),
        to: new Position(this.#lastMove.to.row, this.#lastMove.to.col),
        piece: this.#lastMove.piece,
        capturedPiece: this.#lastMove.capturedPiece,
        isEnPassant: this.#lastMove.isEnPassant,
        isCastling: this.#lastMove.isCastling,
        promotionType: this.#lastMove.promotionType,
      }
      : null;
    return newGame;
  }
  //===========================================

  getLastMove() {
    return this.#lastMove;
  }
  //===========================================

  getWinner() {
    return this.#winner;
  }
  //===========================================

  getForwardMove() {
    return this.#forwardMove.length > 0
      ? this.#forwardMove[this.#forwardMove.length - 1]
      : null;
  }
  //===========================================

  posToChessNotation(row, col) {
    const file = String.fromCharCode(97 + col);
    const rank = 8 - row;
    return `${file}${rank}`;
  }
  //===========================================

  chessNotationToPos(notation) {
    const file = notation.charCodeAt(0) - 97;
    const rank = 8 - parseInt(notation.charAt(1), 10);
    return new Position(rank, file);
  }
  //===========================================

  getMoveHistory() {
    return this.#moveHistory;
  }
}
