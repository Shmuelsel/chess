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

  /**
   * Execute a move for an engine player
   * For pawn promotion, automatically promotes based on the promotionType in the move
   * If no promotionType is specified, defaults to Queen
   * @param {Move} move - The move to execute
   * @param {Game} game - The game instance
   * @returns {Object} - Result object with success flag and promotionType
   */
  executeMove(move, game) {
    const piece = move.piece;
    const toRow = move.to.row;
    
    // Check if this is a pawn promotion move
    const isPawnPromotion = 
      piece.constructor.name === "Pawn" && 
      ((piece.getColor() === "w" && toRow === 0) || 
       (piece.getColor() === "b" && toRow === 7));

    if (isPawnPromotion) {
      // Use the promotionType from the move, or default to Queen
      const promotionType = move.promotionType || "q";
      return { success: true, promotionType: promotionType };
    }

    return { success: true };
  }
}
