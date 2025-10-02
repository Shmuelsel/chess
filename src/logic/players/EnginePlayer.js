import { Player } from "./Player.js";

/**
 * EnginePlayer class
 * Represents an AI/engine player in the chess game
 */
export class EnginePlayer extends Player {
  #level;

  constructor(color, level = 5) {
    super(color, "engine");
    this.#level = level;
  }

  getLevel() {
    return this.#level;
  }

  setLevel(level) {
    this.#level = level;
  }
}
