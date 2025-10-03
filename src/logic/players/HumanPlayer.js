import { Player } from "./Player.js";

/**
 * HumanPlayer class
 * Represents a human player in the chess game
 */
export class HumanPlayer extends Player {
  constructor(color) {
    super(color, "human");
  }

  /**
   * Execute a move for a human player
   * For pawn promotion, this returns needsPromotion flag
   * The UI will handle showing the promotion popup
   * @param {Move} move - The move to execute
   * @param {Game} game - The game instance
   * @returns {Object} - Result object with success flag and needsPromotion flag
   */
  executeMove(move, game) {
    // Check if this is a pawn promotion move
    const piece = move.piece;
    const toRow = move.to.row;
    
    // Check if pawn reached the end row
    const isPawnPromotion = 
      piece.constructor.name === "Pawn" && 
      ((piece.getColor() === "w" && toRow === 0) || 
       (piece.getColor() === "b" && toRow === 7));

    if (isPawnPromotion) {
      return { success: true, needsPromotion: true };
    }

    return { success: true, needsPromotion: false };
  }
}
