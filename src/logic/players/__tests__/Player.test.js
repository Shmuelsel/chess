import { Player } from "../Player";
import { HumanPlayer } from "../HumanPlayer";
import { EnginePlayer } from "../EnginePlayer";

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
  });
});
