import { getInitialState } from "../gameReducerNew";

describe("gameReducerNew - Player creation", () => {
  test("should create HumanPlayer for both sides in PvP mode", () => {
    const state = getInitialState("w", "pvp", 5);
    
    expect(state.game.getWhitePlayer().isHuman()).toBe(true);
    expect(state.game.getBlackPlayer().isHuman()).toBe(true);
    expect(state.game.getWhitePlayer().getColor()).toBe("w");
    expect(state.game.getBlackPlayer().getColor()).toBe("b");
  });

  test("should create HumanPlayer for white and EnginePlayer for black in PvE mode with white player", () => {
    const state = getInitialState("w", "pve", 8);
    
    expect(state.game.getWhitePlayer().isHuman()).toBe(true);
    expect(state.game.getBlackPlayer().isEngine()).toBe(true);
    expect(state.game.getBlackPlayer().getLevel()).toBe(8);
  });

  test("should create EnginePlayer for white and HumanPlayer for black in PvE mode with black player", () => {
    const state = getInitialState("b", "pve", 12);
    
    expect(state.game.getWhitePlayer().isEngine()).toBe(true);
    expect(state.game.getBlackPlayer().isHuman()).toBe(true);
    expect(state.game.getWhitePlayer().getLevel()).toBe(12);
  });

  test("should use default level of 5 if not provided", () => {
    const state = getInitialState("w", "pve");
    
    expect(state.game.getBlackPlayer().isEngine()).toBe(true);
    expect(state.game.getBlackPlayer().getLevel()).toBe(5);
  });

  test("should maintain playerMode and playerColor in state", () => {
    const state = getInitialState("b", "pvp", 5);
    
    expect(state.playerMode).toBe("pvp");
    expect(state.playerColor).toBe("b");
  });
});
