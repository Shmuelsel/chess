import { Game } from "../Game";
import { HumanPlayer } from "../players/HumanPlayer";
import { EnginePlayer } from "../players/EnginePlayer";

describe("Game with Player classes", () => {
  test("should create a game with two human players", () => {
    const whitePlayer = new HumanPlayer("w");
    const blackPlayer = new HumanPlayer("b");
    const game = new Game(whitePlayer, blackPlayer, "w");

    expect(game.getWhitePlayer()).toBe(whitePlayer);
    expect(game.getBlackPlayer()).toBe(blackPlayer);
    expect(game.getWhitePlayer().isHuman()).toBe(true);
    expect(game.getBlackPlayer().isHuman()).toBe(true);
  });

  test("should create a game with human vs engine", () => {
    const whitePlayer = new HumanPlayer("w");
    const blackPlayer = new EnginePlayer("b", 10);
    const game = new Game(whitePlayer, blackPlayer, "w");

    expect(game.getWhitePlayer().isHuman()).toBe(true);
    expect(game.getBlackPlayer().isEngine()).toBe(true);
    expect(game.getBlackPlayer().getLevel()).toBe(10);
  });

  test("should get current player correctly", () => {
    const whitePlayer = new HumanPlayer("w");
    const blackPlayer = new EnginePlayer("b", 5);
    const game = new Game(whitePlayer, blackPlayer, "w");

    // Initially, white's turn
    const currentPlayer = game.getCurrentPlayer();
    expect(currentPlayer.getColor()).toBe("w");
    expect(currentPlayer.isHuman()).toBe(true);
  });

  test("should get opponent player correctly", () => {
    const whitePlayer = new HumanPlayer("w");
    const blackPlayer = new EnginePlayer("b", 5);
    const game = new Game(whitePlayer, blackPlayer, "w");

    // Initially, white's turn, so black is opponent
    const opponentPlayer = game.getOpponentPlayer();
    expect(opponentPlayer.getColor()).toBe("b");
    expect(opponentPlayer.isEngine()).toBe(true);
    expect(opponentPlayer.getLevel()).toBe(5);
  });
});
