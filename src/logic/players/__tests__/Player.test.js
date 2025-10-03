import { Player } from "../Player";
import { HumanPlayer } from "../HumanPlayer";
import { EnginePlayer } from "../EnginePlayer";
import { Move } from "../../Move";
import { Position } from "../../Position";
import { Pawn } from "../../pieces/Pawn";
import { Queen } from "../../pieces/Queen";

describe("Player classes", () => {
  describe("Player base class", () => {
    test("should create a player with color and type", () => {
      const player = new Player("w", "human");
      expect(player.getColor()).toBe("w");
      expect(player.getType()).toBe("human");
    });

    test("should correctly identify human player", () => {
      const player = new Player("w", "human");
      expect(player.isHuman()).toBe(true);
      expect(player.isEngine()).toBe(false);
    });

    test("should correctly identify engine player", () => {
      const player = new Player("b", "engine");
      expect(player.isEngine()).toBe(true);
      expect(player.isHuman()).toBe(false);
    });

    test("should have executeMove method", () => {
      const player = new Player("w", "human");
      const move = new Move(new Position(6, 4), new Position(4, 4), null);
      const result = player.executeMove(move, null);
      expect(result).toHaveProperty("success");
      expect(result.success).toBe(true);
    });
  });

  describe("HumanPlayer", () => {
    test("should create a human player", () => {
      const player = new HumanPlayer("w");
      expect(player.getColor()).toBe("w");
      expect(player.getType()).toBe("human");
      expect(player.isHuman()).toBe(true);
      expect(player.isEngine()).toBe(false);
    });

    test("should create a black human player", () => {
      const player = new HumanPlayer("b");
      expect(player.getColor()).toBe("b");
      expect(player.isHuman()).toBe(true);
    });

    test("should return needsPromotion for pawn promotion move", () => {
      const player = new HumanPlayer("w");
      const pawn = new Pawn("w");
      const move = new Move(new Position(1, 4), new Position(0, 4), pawn);
      const result = player.executeMove(move, null);
      expect(result.success).toBe(true);
      expect(result.needsPromotion).toBe(true);
    });

    test("should not return needsPromotion for regular move", () => {
      const player = new HumanPlayer("w");
      const pawn = new Pawn("w");
      const move = new Move(new Position(6, 4), new Position(4, 4), pawn);
      const result = player.executeMove(move, null);
      expect(result.success).toBe(true);
      expect(result.needsPromotion).toBe(false);
    });

    test("should handle black pawn promotion", () => {
      const player = new HumanPlayer("b");
      const pawn = new Pawn("b");
      const move = new Move(new Position(6, 4), new Position(7, 4), pawn);
      const result = player.executeMove(move, null);
      expect(result.success).toBe(true);
      expect(result.needsPromotion).toBe(true);
    });
  });

  describe("EnginePlayer", () => {
    test("should create an engine player with default level", () => {
      const player = new EnginePlayer("b");
      expect(player.getColor()).toBe("b");
      expect(player.getType()).toBe("engine");
      expect(player.isEngine()).toBe(true);
      expect(player.isHuman()).toBe(false);
      expect(player.getLevel()).toBe(5);
    });

    test("should create an engine player with custom level", () => {
      const player = new EnginePlayer("w", 12);
      expect(player.getColor()).toBe("w");
      expect(player.getLevel()).toBe(12);
    });

    test("should allow changing the level", () => {
      const player = new EnginePlayer("b", 5);
      expect(player.getLevel()).toBe(5);
      
      player.setLevel(10);
      expect(player.getLevel()).toBe(10);
    });

    test("should return promotionType for pawn promotion move", () => {
      const player = new EnginePlayer("w");
      const pawn = new Pawn("w");
      const move = new Move(new Position(1, 4), new Position(0, 4), pawn);
      move.promotionType = "q";
      const result = player.executeMove(move, null);
      expect(result.success).toBe(true);
      expect(result.promotionType).toBe("q");
    });

    test("should default to queen promotion if no promotionType specified", () => {
      const player = new EnginePlayer("w");
      const pawn = new Pawn("w");
      const move = new Move(new Position(1, 4), new Position(0, 4), pawn);
      const result = player.executeMove(move, null);
      expect(result.success).toBe(true);
      expect(result.promotionType).toBe("q");
    });

    test("should handle different promotion types", () => {
      const player = new EnginePlayer("w");
      const pawn = new Pawn("w");
      
      // Test rook promotion
      const move1 = new Move(new Position(1, 4), new Position(0, 4), pawn);
      move1.promotionType = "r";
      const result1 = player.executeMove(move1, null);
      expect(result1.promotionType).toBe("r");
      
      // Test knight promotion
      const move2 = new Move(new Position(1, 4), new Position(0, 4), pawn);
      move2.promotionType = "n";
      const result2 = player.executeMove(move2, null);
      expect(result2.promotionType).toBe("n");
      
      // Test bishop promotion
      const move3 = new Move(new Position(1, 4), new Position(0, 4), pawn);
      move3.promotionType = "b";
      const result3 = player.executeMove(move3, null);
      expect(result3.promotionType).toBe("b");
    });

    test("should not return promotionType for regular move", () => {
      const player = new EnginePlayer("w");
      const queen = new Queen("w");
      const move = new Move(new Position(6, 4), new Position(4, 4), queen);
      const result = player.executeMove(move, null);
      expect(result.success).toBe(true);
      expect(result.promotionType).toBeUndefined();
    });
  });
});
