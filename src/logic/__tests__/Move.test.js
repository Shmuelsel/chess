import { Move } from "../Move";
import { Position } from "../Position";
import { Pawn } from "../pieces/Pawn";
import { Queen } from "../pieces/Queen";

describe("Move class", () => {
  describe("toChessNotation", () => {
    test("should convert regular move to UCI notation", () => {
      const pawn = new Pawn("w");
      const move = new Move(new Position(6, 4), new Position(4, 4), pawn);
      expect(move.toChessNotation()).toBe("e2e4");
    });

    test("should include promotion type in notation", () => {
      const pawn = new Pawn("w");
      const move = new Move(
        new Position(1, 4),
        new Position(0, 4),
        pawn,
        null,
        false,
        { kingside: false, queenside: false },
        "q"
      );
      expect(move.toChessNotation()).toBe("e7e8q");
    });

    test("should handle knight promotion", () => {
      const pawn = new Pawn("b");
      const move = new Move(
        new Position(6, 0),
        new Position(7, 0),
        pawn,
        null,
        false,
        { kingside: false, queenside: false },
        "n"
      );
      expect(move.toChessNotation()).toBe("a2a1n");
    });

    test("should handle rook promotion", () => {
      const pawn = new Pawn("w");
      const move = new Move(
        new Position(1, 7),
        new Position(0, 7),
        pawn,
        null,
        false,
        { kingside: false, queenside: false },
        "r"
      );
      expect(move.toChessNotation()).toBe("h7h8r");
    });

    test("should handle bishop promotion", () => {
      const pawn = new Pawn("w");
      const move = new Move(
        new Position(1, 3),
        new Position(0, 3),
        pawn,
        null,
        false,
        { kingside: false, queenside: false },
        "b"
      );
      expect(move.toChessNotation()).toBe("d7d8b");
    });

    test("should handle move without promotion", () => {
      const queen = new Queen("w");
      const move = new Move(new Position(0, 3), new Position(4, 7), queen);
      expect(move.toChessNotation()).toBe("d8h4");
    });

    test("should use lowercase notation", () => {
      const pawn = new Pawn("w");
      const move = new Move(new Position(6, 0), new Position(5, 0), pawn);
      const notation = move.toChessNotation();
      expect(notation).toBe(notation.toLowerCase());
    });

    test("should handle uppercase promotion type by converting to lowercase", () => {
      const pawn = new Pawn("w");
      const move = new Move(
        new Position(1, 4),
        new Position(0, 4),
        pawn,
        null,
        false,
        { kingside: false, queenside: false },
        "Q"
      );
      expect(move.toChessNotation()).toBe("e7e8q");
    });
  });

  describe("equals", () => {
    test("should return true for equal moves", () => {
      const pawn = new Pawn("w");
      const move1 = new Move(new Position(6, 4), new Position(4, 4), pawn);
      const move2 = new Move(new Position(6, 4), new Position(4, 4), pawn);
      expect(move1.equals(move2)).toBe(true);
    });

    test("should return false for different moves", () => {
      const pawn = new Pawn("w");
      const move1 = new Move(new Position(6, 4), new Position(4, 4), pawn);
      const move2 = new Move(new Position(6, 3), new Position(4, 3), pawn);
      expect(move1.equals(move2)).toBe(false);
    });
  });
});
