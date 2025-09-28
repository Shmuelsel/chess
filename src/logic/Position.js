export class Position {
    row;
    col;
  constructor(row, col) {
    if (typeof row === "string") {
      // If the first parameter is a string, treat it as chess notation
      const file = row.charCodeAt(0) - 97;
      const rank = 8 - (parseInt(row[1]));
      this.row = rank;
      this.col = file;
    } else {
      this.row = row;
      this.col = col;
    }
  }

  toString() {
    return `(${this.row}, ${this.col})`;
  }

  toChessNotation() {
    const file = String.fromCharCode('A'.charCodeAt(0) + this.col);
    const rank = 8 - this.row;
    return `${file}${rank}`;
  }

  equals(other) {
    if (!(other instanceof Position)) return false;
    return this.row === other.row && this.col === other.col;
  }
}
