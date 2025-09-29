import { Position } from "./Position";

export class Move {
  from;
  to;
  piece;
  capturedPiece;
  isEnPassant;
  isCastling;
  promotionType;

  constructor(
    from,
    to,
    piece,
    capturedPiece = null,
    isEnPassant = false,
    isCastling = { kingside: false, queenside: false },
    promotionType = null
  ) {
    this.from = from;
    this.to = to;
    this.piece = piece;
    this.capturedPiece = capturedPiece;
    this.isEnPassant = isEnPassant;
    this.isCastling = isCastling;
    this.promotionType = promotionType;
  }

  static buildMoveFromChessNotation(chessNotation, piece) {
    const letterToCol = (letter) => letter.charCodeAt(0) - 97;
    const match = chessNotation.match(/^([a-h])([1-8]) to ([a-h])([1-8])$/);
    if (match) {
      const fromCol = letterToCol(match[1]);
      const fromRow = parseInt(match[2]) - 1;
      const toCol = letterToCol(match[3]);
      const toRow = parseInt(match[4]) - 1;
      return new Move(
        new Position(fromRow, fromCol),
        new Position(toRow, toCol),
        piece
      );
    } else {
      throw new Error("Invalid chess notation");
    }
  }

  toString() {
    return `${this.piece.getKey()} from 
        (${this.from.row}, ${this.from.col}) to
        (${this.to.row}, ${this.to.col})`;
  }

  toChessNotation() {
    const from = this.from.toChessNotation();
    const to = this.to.toChessNotation();
    return `${from}${to}`;
  }

  equals(other) {
    if (!(other instanceof Move)) return false;
    return (
      this.from.equals(other.from) &&
      this.to.equals(other.to)
    );
  }
}
