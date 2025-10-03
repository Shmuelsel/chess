import { Game } from "../Game";
import { HumanPlayer } from "../players/HumanPlayer";
import { EnginePlayer } from "../players/EnginePlayer";
import { Move } from "../Move";
import { Position } from "../Position";

describe("Game with Player move execution integration", () => {
  test("should handle human player pawn promotion", () => {
    const whitePlayer = new HumanPlayer("w");
    const blackPlayer = new HumanPlayer("b");
    const game = new Game(whitePlayer, blackPlayer, "w");

    // Setup a pawn promotion scenario
    // We need to manually place a white pawn at row 1 (near promotion)
    const board = game.getBoard();
    const pawn = board.getPiece(new Position(6, 4)); // white pawn at e2
    
    // Move the pawn to row 1 (one move from promotion)
    board.setPiece(new Position(1, 4), pawn);
    board.setPiece(new Position(6, 4), null);

    // Create a promotion move without promotionType (human player)
    const move = new Move(
      new Position(1, 4),
      new Position(0, 4),
      pawn
    );

    // Execute the move
    game.movePiece(move);

    // For human player, the pawn should be marked as needing promotion
    const movedPiece = board.getPiece(new Position(0, 4));
    expect(movedPiece._needPromotion).toBe(true);
    expect(movedPiece.constructor.name).toBe("Pawn");
  });

  test("should handle engine player pawn promotion automatically", () => {
    const whitePlayer = new EnginePlayer("w");
    const blackPlayer = new HumanPlayer("b");
    const game = new Game(whitePlayer, blackPlayer, "w");

    // Setup a pawn promotion scenario
    const board = game.getBoard();
    const pawn = board.getPiece(new Position(6, 4)); // white pawn at e2
    
    // Move the pawn to row 1 (one move from promotion)
    board.setPiece(new Position(1, 4), pawn);
    board.setPiece(new Position(6, 4), null);

    // Create a promotion move with promotionType (engine player)
    const move = new Move(
      new Position(1, 4),
      new Position(0, 4),
      pawn,
      null,
      false,
      { kingside: false, queenside: false },
      "q" // Queen promotion
    );

    // Execute the move
    game.movePiece(move);

    // For engine player, the pawn should be promoted immediately
    const promotedPiece = board.getPiece(new Position(0, 4));
    expect(promotedPiece.constructor.name).toBe("Queen");
    expect(promotedPiece.getColor()).toBe("w");
  });

  test("should handle engine player pawn promotion to knight", () => {
    const whitePlayer = new EnginePlayer("w");
    const blackPlayer = new HumanPlayer("b");
    const game = new Game(whitePlayer, blackPlayer, "w");

    // Setup a pawn promotion scenario
    const board = game.getBoard();
    const pawn = board.getPiece(new Position(6, 4));
    
    board.setPiece(new Position(1, 4), pawn);
    board.setPiece(new Position(6, 4), null);

    // Create a promotion move with knight promotion
    const move = new Move(
      new Position(1, 4),
      new Position(0, 4),
      pawn,
      null,
      false,
      { kingside: false, queenside: false },
      "n" // Knight promotion
    );

    game.movePiece(move);

    const promotedPiece = board.getPiece(new Position(0, 4));
    expect(promotedPiece.constructor.name).toBe("Knight");
    expect(promotedPiece.getColor()).toBe("w");
  });

  test("should include promotion type in move notation", () => {
    const whitePlayer = new EnginePlayer("w");
    const blackPlayer = new HumanPlayer("b");
    const game = new Game(whitePlayer, blackPlayer, "w");

    const board = game.getBoard();
    const pawn = board.getPiece(new Position(6, 4));
    
    board.setPiece(new Position(1, 4), pawn);
    board.setPiece(new Position(6, 4), null);

    const move = new Move(
      new Position(1, 4),
      new Position(0, 4),
      pawn,
      null,
      false,
      { kingside: false, queenside: false },
      "r" // Rook promotion
    );

    game.movePiece(move);

    const lastMove = game.getLastMove();
    expect(lastMove.toChessNotation()).toBe("e7e8r");
  });

  test("should handle manual promotion via promotePawn method", () => {
    const whitePlayer = new HumanPlayer("w");
    const blackPlayer = new HumanPlayer("b");
    const game = new Game(whitePlayer, blackPlayer, "w");

    const board = game.getBoard();
    const pawn = board.getPiece(new Position(6, 4));
    
    board.setPiece(new Position(0, 4), pawn);
    board.setPiece(new Position(6, 4), null);

    // Manually promote the pawn (simulating UI selection)
    game.promotePawn(0, 4, pawn, "b"); // Bishop promotion

    const promotedPiece = board.getPiece(new Position(0, 4));
    expect(promotedPiece.constructor.name).toBe("Bishop");
    expect(promotedPiece.getColor()).toBe("w");
  });
});
