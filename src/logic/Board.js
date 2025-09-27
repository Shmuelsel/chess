import { Square } from "./Square";
import { Pawn } from "./pieces/Pawn";
import { King } from "./pieces/King";
import { Queen } from "./pieces/Queen";
import { Rook } from "./pieces/Rook";
import { Knight } from "./pieces/Knight";
import { Bishop } from "./pieces/Bishop";
import { PieceType } from "./pieceConstants";
import { Position } from "./Position";

export class Board {
  #squares = [];
  constructor(playerColor) {
    this.playerColor = playerColor;
    this.#squares = Array.from({ length: 8 }, () => Array(8).fill(null));
    this.initializeBoard();
  }
  //=============================================

  initializeBoard() {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        this.#squares[row][col] = new Square(row, col);
      }
    }

    // this.enemyColor = this.playerColor === "w" ? "b" : "w";
    // var queenCol = this.playerColor === "w" ? 3 : 4;
    // var kingCol = this.playerColor === "w" ? 4 : 3;

    for (let col = 0; col < 8; col++) {
      this.#squares[1][col] = new Square(1, col, new Pawn("b", "p")); // Black pawns
      this.#squares[6][col] = new Square(6, col, new Pawn("w", "p")); // White pawns
    }
    // Initialize black pieces
    this.#squares[0][0] = new Square(0, 0, new Rook("b", "r"));
    this.#squares[0][1] = new Square(0, 1, new Knight("b", "n"));
    this.#squares[0][2] = new Square(0, 2, new Bishop("b", "b"));
    this.#squares[0][3] = new Square(0, 3, new Queen("b", "q"));
    this.#squares[0][4] = new Square(0, 4, new King("b", "k"));
    this.#squares[0][5] = new Square(0, 5, new Bishop("b", "b"));
    this.#squares[0][6] = new Square(0, 6, new Knight("b", "n"));
    this.#squares[0][7] = new Square(0, 7, new Rook("b", "r"));
    // Initialize white pieces
    this.#squares[7][0] = new Square(7, 0, new Rook("w", "r"));
    this.#squares[7][1] = new Square(7, 1, new Knight("w", "n"));
    this.#squares[7][2] = new Square(7, 2, new Bishop("w", "b"));
    this.#squares[7][3] = new Square(7, 3, new Queen("w", "q"));
    this.#squares[7][4] = new Square(7, 4, new King("w", "k"));
    this.#squares[7][5] = new Square(7, 5, new Bishop("w", "b"));
    this.#squares[7][6] = new Square(7, 6, new Knight("w", "n"));
    this.#squares[7][7] = new Square(7, 7, new Rook("w", "r"));
  }
  //=============================================
  getPiece(pos) {
    return this.#squares[pos.row][pos.col].getPiece();
  }
  //=============================================
  // getPiece(row, col) {
  //   return this.#squares[row][col].getPiece();
  // }
  //=============================================
  setPiece(pos, piece) {
    this.#squares[pos.row][pos.col].setPiece(piece);
  }
  //=============================================
  // setPiece(row, col, piece) {
  //   this.#squares[row][col].setPiece(piece);
  // }
  //=============================================

  movePiece(move) {
    const from = move.from;
    const to = move.to;
    //
    const piece = this.getPiece(from);
    if (!piece) {
      console.error("No piece at the source square.");
      return;
    }
    this.setPiece(to, piece);
    this.setPiece(from, null);
  }
  //=============================================

  getSquares() {
    return this.#squares;
  }
  //=============================================

  getSquare(pos) {
    return this.#squares[pos.row][pos.col];
  }
  //=============================================

  isOccupied(row, col) {
    return this.#squares[row][col].getPiece();
  }
  //=============================================

  clone() {
    const newBoard = new Board();
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.#squares[row][col].getPiece();
        if (piece) {
          newBoard.#squares[row][col] = new Square(row, col, piece.clone());
        } else {
          newBoard.#squares[row][col] = new Square(row, col, null);
        }
      }
    }
    return newBoard;
  }
  //=============================================

  resetBoard() {
    this.#squares = Array.from({ length: 8 }, () => Array(8).fill(null));
    this.initializeBoard();
  }
  //=============================================

  getPieceKey(piece) {
    if (!piece) return null;
    return piece.getKey();
  }
  //=============================================

  getPieceOfColor(color) {
    const pieces = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.#squares[row][col].getPiece();
        if (piece && piece.getColor() === color) {
          pieces.push(piece);
        }
      }
    }
    return pieces;
  }
  //=============================================

  getThreatenedSquares(color) {
    const threatenedSquares = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const pos = new Position(row, col);
        const piece = this.getPiece(pos);
        if (piece && piece.getColor() !== color) {
          const threatMoves = piece.getThreatMoves(pos, this);
          if (threatMoves.length !== 0) {
            for (const threatPos of threatMoves) {
              threatenedSquares.push(threatPos);
            }
          }
        }
      }
    }
    return threatenedSquares;
  }
  //=============================================

  getKingPosition(color) {
    var kingPos = {};
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const pos = new Position(row, col);
        const piece = this.getPiece(pos);
        if (
          piece &&
          piece.getType() === PieceType.KING &&
          piece.getColor() === color
        ) {
          kingPos = { x: col, y: row };
        }
      }
    }
    return kingPos;
  }
  //=============================================

  isInCheck(color) {
    const kingPos = this.getKingPosition(color);
    return this.getThreatenedSquares(color).some(
      (sq) => sq.row === kingPos.y && sq.col === kingPos.x
    );
  }
  //=============================================

  getEnPassantSquare() {
    // This method should return the square that is eligible for en passant capture
    // For simplicity, we assume it returns null if no en passant is available
    return null; // Implement logic to return the en passant square if available
  }
}
