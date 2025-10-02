import { Player } from "./Player.js";

/**
 * HumanPlayer class
 * Represents a human player in the chess game
 */
export class HumanPlayer extends Player {
  constructor(color) {
    super(color, "human");
  }
}
